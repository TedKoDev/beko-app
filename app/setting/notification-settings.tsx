import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import CustomSwitch from '~/components/common/CustomSwitch';
import { useNotificationSettings } from '~/queries/hooks/notification/useNotification';
import { useAuthStore } from '~/store/authStore';

export default function NotificationSettings() {
  // const userId = 1;

  const { userInfo } = useAuthStore();
  const userId = userInfo?.user_id;

  // console.log('userId', userId);

  const { settings, updateSettings } = useNotificationSettings(userId);
  const [allNotifications, setAllNotifications] = useState(false);

  useEffect(() => {
    setAllNotifications(settings.notification_benefit && settings.notification_community);
  }, [settings]);

  const handleToggleAll = () => {
    const newStatus = !allNotifications;
    setAllNotifications(newStatus);
    updateSettings({
      notification_benefit: newStatus,
      notification_community: newStatus,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Notification Settings',
          headerShadowVisible: true,
        }}
      />

      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-base">Notification Settings</Text>
        </View>

        <View className="border-t border-gray-200">
          <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
            <View>
              <Text className="text-base">Benefit and Event Notifications</Text>
              <Text className="text-sm text-gray-500">
                We will notify you of useful benefits {'\n'}
                and various event information.
              </Text>
            </View>
            <CustomSwitch
              value={settings.notification_benefit}
              onValueChange={(value) =>
                updateSettings({ ...settings, notification_benefit: value })
              }
            />
          </View>

          <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
            <Text className="text-base">Community Activity Notifications</Text>
            <CustomSwitch
              value={settings.notification_community}
              onValueChange={(value) =>
                updateSettings({ ...settings, notification_community: value })
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
