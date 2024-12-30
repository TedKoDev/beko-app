import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { create } from 'zustand';

// import { tokenManager } from '../services/api';
import {
  getUserInfoApi,
  loginApi,
  registerApi,
  authService,
  logoutApi,
} from '../services/authService';

interface UserInfo {
  account_status: string;
  bio: string;
  country: {
    country_code: string;
    country_id: number;
    country_name: string;
    flag_icon: string;
  };
  created_at: string;
  email: string;
  last_login_at: string;
  level: number;
  points: number;
  profile_picture_url: string;
  role: string;
  terms_agreed: boolean;
  privacy_agreed: boolean;
  marketing_agreed: boolean;
  social_login: {
    provider: string;
    provider_user_id: string;
  }[];
  stats: {
    commentCount: number;
    followersCount: number;
    followingCount: number;
    likedPostsCount: number;
    postCount: number;
  };
  today_task_count: number;
  user_id: number;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userInfo?: UserInfo;
  userToken?: string;
  login: (email: string, password: string) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string,
    country_id: number,
    term_agreement: boolean,
    privacy_agreement: boolean,
    marketing_agreement: boolean
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUserInfo: (info: UserInfo) => void;
  updateUserInfo: (newData: UserInfo) => void;
  socialLogin: (
    provider: 'APPLE' | 'GOOGLE',
    providerUserId: string,
    email?: string,
    name?: string
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userInfo: undefined,
  userToken: undefined,

  register: async (
    name: string,
    email: string,
    password: string,
    country_id: number,
    terms_agreed: boolean,
    privacy_agreed: boolean,
    marketing_agreed: boolean
  ) => {
    console.log('register');

    await registerApi(
      name,
      email,
      password,
      country_id,
      terms_agreed,
      privacy_agreed,
      marketing_agreed
    );
    //console.log('register response', response);
  },

  login: async (email: string, password: string) => {
    const data = await loginApi(email, password);
    if (data) {
      await AsyncStorage.setItem('userToken', data.access_token);

      const userInfo = await authService.getUserInfoApi(data.access_token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      set({
        isAuthenticated: true,
        userInfo,
        userToken: data.access_token,
      });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    // tokenManager.setToken(null);
    useAuthStore.setState({ userToken: undefined });
    set({ isAuthenticated: false, userInfo: undefined, userToken: undefined });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        set({ isAuthenticated: false, userToken: undefined, userInfo: undefined });
        return;
      }

      const userInfo = await getUserInfoApi(token);
      if (userInfo) {
        set({
          isAuthenticated: true,
          userToken: token,
          userInfo,
        });
      } else {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        set({ isAuthenticated: false, userToken: undefined, userInfo: undefined });
      }
    } catch (error) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      set({ isAuthenticated: false, userToken: undefined, userInfo: undefined });
    }
  },

  setUserInfo: (info) => {
    set({ userInfo: info });
  },

  updateUserInfo: (newData) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            today_task_count: newData.today_task_count,
            points: newData.points,
            stats: {
              ...state.userInfo.stats,
              ...newData.stats,
            },
          }
        : undefined,
    })),

  socialLogin: async (provider, providerUserId, email, name) => {
    try {
      const response = await authService.socialLoginApi(provider, providerUserId, email, name);

      if (response.access_token) {
        await AsyncStorage.setItem('userToken', response.access_token);

        const userInfo = await authService.getUserInfoApi(response.access_token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

        set({
          isAuthenticated: true,
          userInfo,
          userToken: response.access_token,
        });
      }
    } catch (error) {
      console.error('Social login failed:', error);
      throw error;
    }
  },
}));
