import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { notificationService } from '../../../services/notificationService';

export const useNotification = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const projectId = 'fd62690b-c7b1-4850-a014-8fd3746a89ea';

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
