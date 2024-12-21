import axios from 'axios';

const API_BASE_URL = 'http://192.168.219.196:3000/api/v1/';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// 토큰 관리를 위한 유틸리티
export const tokenManager = {
  token: null as string | null,
  setToken(newToken: string | null) {
    this.token = newToken;
  },
  getToken() {
    return this.token;
  },
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedEventEmitter.emit();
    }
    return Promise.reject(error);
  }
);
