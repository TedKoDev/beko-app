import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { useNotificationSettings } from '~/queries/hooks/notification/useNotification';

export default function NotificationSettings() {
  const userId = 1; // 실제 사용자 ID로 변경
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
          headerTitle: '알림 설정',
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-base">앱 알림 설정</Text>
        </View>

        <View className="border-t border-gray-200">
          <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
            <View>
              <Text className="text-base">혜택 및 이벤트 알림</Text>
              <Text className="text-sm text-gray-500">
                유용한 혜택과 다양한 이벤트 정보를 알려드려요.
              </Text>
            </View>
            <Switch
              value={settings.notification_benefit}
              onValueChange={(value) =>
                updateSettings({ ...settings, notification_benefit: value })
              }
              trackColor={{ false: '#767577', true: '#FF6B6C' }}
              thumbColor={'#f4f3f4'}
            />
          </View>

          <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
            <Text className="text-base">커뮤니티 활동 알림</Text>
            <Switch
              value={settings.notification_community}
              onValueChange={(value) =>
                updateSettings({ ...settings, notification_community: value })
              }
              trackColor={{ false: '#767577', true: '#FF6B6C' }}
              thumbColor={'#f4f3f4'}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
