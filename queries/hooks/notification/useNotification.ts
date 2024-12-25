import { useState, useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { notificationService } from '../../../services/notificationService';

import {
  authService,
  getNotificationSettings,
  updateNotificationSettings,
} from '~/services/authService';
import { useAuthStore } from '~/store/authStore';
import { useMutation } from '@tanstack/react-query';

export const useNotification = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);

  const registerForPushNotifications = useCallback(async () => {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications are not available in simulator/emulator');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync().catch(
        (error) => {
          console.log('Permission check failed:', error);
          return { status: 'error' };
        }
      );

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync().catch((error) => {
          console.log('Permission request failed:', error);
          return { status: 'error' };
        });
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }

      try {
        const tokenResponse = await Notifications.getExpoPushTokenAsync({
          projectId: 'fd62690b-c7b1-4850-a014-8fd3746a89ea',
        });

        const token = tokenResponse.data;

        if (Platform.OS === 'android') {
          try {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
          } catch (error) {
            console.log('Android channel setup failed:', error);
          }
        }

        setPushToken(token);

        try {
          await notificationService.registerPushToken(token);
        } catch (error) {
          console.log('Token registration to server failed:', error);
        }

        return token;
      } catch (error) {
        console.log('Failed to get push token:', error);
        return null;
      }
    } catch (error) {
      console.log('Push notification registration failed:', error);
      return null;
    }
  }, []);

  return {
    pushToken,
    registerForPushNotifications,
  };
};

export const useNotificationSettings = (userId: number) => {
  const [settings, setSettings] = useState({
    notification_benefit: false,
    notification_community: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getNotificationSettings(userId);
        setSettings(data);
      } catch (error) {
        console.log('Failed to fetch notification settings:', error);
      }
    };

    fetchSettings();
  }, [userId]);

  const updateSettings = async (newSettings: any) => {
    const filteredSettings = Object.fromEntries(
      Object.entries(newSettings).filter(([key, _]) => !key.endsWith('_at'))
    );

    try {
      await updateNotificationSettings(userId, filteredSettings);
      setSettings(newSettings);
    } catch (error) {
      console.log('Failed to update notification settings:', error);
    }
  };

  return { settings, updateSettings };
};

interface UpdateAgreementsDto {
  terms_agreed: boolean;
  privacy_agreed: boolean;
  marketing_agreed: boolean;
}

export const useAgreements = () => {
  const { userToken, setUserInfo, userInfo } = useAuthStore();

  const updateAgreementsMutation = useMutation({
    mutationFn: async (agreements: UpdateAgreementsDto) => {
      if (!userToken) throw new Error('No token found');
      return authService.updateInitialAgreementsApi(userToken, agreements);
    },
    onSuccess: (_, variables) => {
      // 로컬 상태 업데이트
      setUserInfo({
        ...userInfo,
        terms_agreed: variables.terms_agreed,
        privacy_agreed: variables.privacy_agreed,
        marketing_agreed: variables.marketing_agreed,
      });
    },
  });

  const updateAgreements = async (agreements: UpdateAgreementsDto) => {
    try {
      await updateAgreementsMutation.mutateAsync(agreements);
      return true;
    } catch (error) {
      console.error('Failed to update agreements:', error);
      throw error;
    }
  };

  return {
    updateAgreements,
    isUpdating: updateAgreementsMutation.isPending,
    error: updateAgreementsMutation.error,
  };
};
