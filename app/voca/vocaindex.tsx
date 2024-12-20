import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import UserWordListPage from './userwordlist';
import WordListPage from './wordlist';

export default function VocaPage() {
  const [activeTab, setActiveTab] = useState('WordList');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'WordList':
        return (
          <View className="flex-1">
            <WordListPage />
          </View>
        );
      case 'UserWordList':
        return (
          <View className="flex-1">
            <UserWordListPage />
          </View>
        );
    }
  };
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerTitle: 'Voca',
          headerShadowVisible: true,
        }}
      />
      {/* Tab Buttons */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab('WordList')}
          className={`flex-1 p-4 ${activeTab === 'WordList' ? 'border-purple-custom border-b-2' : ''}`}>
          <Text
            className={`text-center font-medium ${
              activeTab === 'WordList' ? 'text-purple-custom' : 'text-gray-600'
            }`}>
            Voca List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('UserWordList')}
          className={`flex-1 p-4 ${activeTab === 'UserWordList' ? 'border-purple-custom border-b-2' : ''}`}>
          <Text
            className={`text-center font-medium ${
              activeTab === 'UserWordList' ? 'text-purple-custom' : 'text-gray-600'
            }`}>
            My Voca
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}
    </View>
  );
}
