import { api } from './api';

import { useAuthStore } from '../store/authStore';
import { router } from 'expo-router';
import axios from 'axios';

interface CheckResponse {
  available: boolean;
  message: string;
}

interface SocialLoginResponse {
  access_token: string;
  user: {
    user_id: number;
    username: string;
    email: string;
  };
}

export const getCountryListApi = async () => {
  try {
    const response = await api.get('/country/list'); // 또는 '/country'
    if (response.data.status === 'success') {
      return response.data.data; // 실제 국가 데이터 배열 반환
    }
    throw new Error(response.data.message || '국가 목록을 가져오는데 실패했습니다');
  } catch (error) {
    console.error('국가 목록 조회 실패:', error);
    throw error;
  }
};
export const loginApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    //console.log('Login success', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const registerApi = async (
  name: string,
  email: string,
  password: string,
  country_id: number,
  term_agreement: boolean,
  privacy_agreement: boolean,
  marketing_agreement: boolean
) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      country_id,
      term_agreement,
      privacy_agreement,
      marketing_agreement,
    });
    console.log('Register success', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Register failed', error);
    if (error.response?.status === 409) {
      throw new Error(
        'This email is already registered. Please try with a different email address or log in if you already have an account.'
      );
    }
    throw new Error(
      'Registration failed. Please check your information and try again. If the problem persists, please contact our support team.'
    );
  }
};

export const checkEmailApi = async (email: string): Promise<CheckResponse> => {
  try {
    const response = await api.post('/auth/check-email', { email });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('email already taken');
    }
    throw new Error('email check failed');
  }
};

export const checkNameApi = async (name: string): Promise<CheckResponse> => {
  try {
    const response = await api.post('/auth/check-name', { name });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('name already taken');
    }
    throw new Error('name check failed');
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateName = (name: string): boolean => {
  return name.length >= 2;
};

export const checkEmail = async (email: string): Promise<boolean> => {
  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email address');
  }

  const response = await checkEmailApi(email);
  return response.available;
};

export const checkName = async (name: string): Promise<boolean> => {
  if (!validateName(name)) {
    throw new Error('Name must be at least 2 characters long');
  }

  const response = await checkNameApi(name);
  return response.available;
};

export const getUserInfoApi = async (token: string) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // 토큰이 만료되었거나 유효하지 않은 경우
        useAuthStore.getState().logout();
        router.replace('/login');
      }
    }
    throw error;
  }
};

export const updateUserProfileApi = async (token: string, updateData: any) => {
  try {
    // console.log('API request data:', updateData);
    const response = await api.post('/users/update-profile', updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // console.log('API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update profile API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const deactivateUserApi = async (userId: number, password: string) => {
  console.log('deactivateUserApi4', userId, password);
  const token = useAuthStore.getState().userToken;
  console.log('deactivateUserApi5', token);
  if (!token) {
    throw new Error('No token found');
  }
  try {
    const response = await api.post(
      `/users/deactivate`,
      { password }, // 비밀번호가 올바르게 전달되는지 확인
      {
        headers: {
          Authorization: `Bearer ${token}`, // 유효한 토큰인지 확인
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Deactivate user API error:', error);
    throw new Error('Failed to deactivate user');
  }
};

export const socialLoginApi = async (
  provider: 'APPLE' | 'GOOGLE',
  providerUserId: string,
  email?: string,
  name?: string
): Promise<SocialLoginResponse> => {
  try {
    const response = await api.post('/auth/social-login', {
      provider,
      providerUserId,
      email,
      name,
    });
    return response.data;
  } catch (error) {
    console.error('Social login API failed:', error);
    throw error;
  }
};

export const getNotificationSettings = async (userId: number) => {
  const token = useAuthStore.getState().userToken;
  try {
    const response = await api.get(`/users/notification-settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw error;
  }
};
export const updatePasswordApi = async (currentPassword: string, newPassword: string) => {
  console.log('updatePasswordApi', currentPassword, newPassword);
  const token = useAuthStore.getState().userToken;
  try {
    const response = await api.patch(
      '/users/update-password',
      {
        currentPassword,
        newPassword,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('updatePasswordApi response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
export const updateNotificationSettings = async (userId: number, settings: any) => {
  console.log('sss', userId, settings);
  try {
    const token = useAuthStore.getState().userToken;
    const response = await api.patch(`/users/notification-settings`, settings, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

export const authService = {
  checkEmail,
  checkName,
  loginApi,
  registerApi,
  getUserInfoApi,
  updateUserProfileApi,
  updatePasswordApi,
  deactivateUserApi,
  socialLoginApi,
};
