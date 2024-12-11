import { useState, useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { notificationService } from '../../../services/notificationService';

import { getNotificationSettings, updateNotificationSettings } from '~/services/authService';

export const useNotification = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);

  const registerForPushNotifications = useCallback(async () => {
    try {
      if (!Device.isDevice) {
        throw new Error('Must use physical device for Push Notifications');
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Failed to get push token for push notification!');
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID, // expo 프로젝트 ID 입력
        })
      ).data;

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      setPushToken(token);

      // 서버에 토큰 등록
      await notificationService.registerPushToken(token);

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      throw error;
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
        console.error('Failed to fetch notification settings:', error);
      }
    };

    fetchSettings();
  }, [userId]);

  const updateSettings = async (newSettings: any) => {
    console.log('updateSettings', newSettings);
    const filteredSettings = Object.fromEntries(
      Object.entries(newSettings).filter(([key, _]) => !key.endsWith('_at'))
    );

    console.log('Filtered Settings', filteredSettings);

    try {
      await updateNotificationSettings(userId, filteredSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  return { settings, updateSettings };
};
