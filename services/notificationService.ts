import { useAuthStore } from '~/store/authStore';
import { api } from './api';

export const notificationService = {
  registerPushToken: async (token: string) => {
    try {
      const userToken = useAuthStore.getState().userToken;
      console.log('userToken', userToken);
      if (!userToken) {
        throw new Error('No token found');
      }
      const response = await api.post(
        `/notifications/register-token`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error registering push token:', error);
      throw error;
    }
  },
};
