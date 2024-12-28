import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
// const API_BASE_URL = 'http://192.168.219.196:3000/api/v1/';
// const API_BASE_URL = 'http://localhost:3000/api/v1/';
const API_BASE_URL = 'https://api.berakorean.com/api/v1/';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키를 주고받기 위해 필요
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 토큰이 만료된 경우
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        console.log('API - isRefreshing', isRefreshing);
        // 이미 토큰 리프레시가 진행 중인 경우
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        console.log('API - try');
        console.log('API - originalRequest', originalRequest);
        const response = await api.post('/auth/refresh');
        const { access_token } = response.data;
        console.log('API - access_token', access_token);
        await AsyncStorage.setItem('userToken', access_token);

        api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        }

        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        unauthorizedEventEmitter.emit();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// 요청 인터셉터 추가
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 401 에러 처리를 위한 이벤트 에미터
export const unauthorizedEventEmitter = {
  listeners: new Set<() => void>(),
  emit() {
    this.listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
};

// // 토큰 관리를 위한 유틸리티
// export const tokenManager = {
//   token: null as string | null,
//   setToken(newToken: string | null) {
//     this.token = newToken;
//   },
//   getToken() {
//     return this.token;
//   },
// };
