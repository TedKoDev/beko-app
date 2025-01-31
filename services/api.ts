import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

// const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const API_BASE_URL = 'http://192.168.219.133:3000/api/v1/';
// const API_BASE_URL = 'http://localhost:3000/api/v1/';
// const API_BASE_URL = 'https://api.berakorean.com/api/v1/';

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
      console.log('[API] Token expired, checking refresh status');

      // 이미 리프레시 시도를 했거나 진행 중인 경우 바로 로그아웃
      if ((originalRequest as any)._retry || isRefreshing) {
        console.log('[API] Already tried refresh or refreshing in progress, logging out');
        isRefreshing = false;
        failedQueue = [];
        await AsyncStorage.removeItem('userToken');
        unauthorizedEventEmitter.emit();
        return Promise.reject(error);
      }

      try {
        console.log('[API] Starting token refresh');
        isRefreshing = true;
        (originalRequest as any)._retry = true;

        const response = await api.post('/auth/refresh');
        const { access_token } = response.data;

        console.log('[API] Got new access token');
        await AsyncStorage.setItem('userToken', access_token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        }

        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshError) {
        console.log('[API] Refresh failed, cleaning up');
        processQueue(refreshError, null);
        await AsyncStorage.removeItem('userToken');
        unauthorizedEventEmitter.emit();
        return Promise.reject(refreshError);
      } finally {
        console.log('[API] Refresh process completed');
        isRefreshing = false;
        failedQueue = [];
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
