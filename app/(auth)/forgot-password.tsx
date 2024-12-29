import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

import { forgotPasswordApi, resendVerificationEmailApi } from '~/services/authService';
import { isValidEmail } from '~/utils/validation';

type TabType = 'password' | 'email';

export default function ForgotPasswordScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('password');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setError('');
      setSuccess('');

      if (!email || !isValidEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      setIsLoading(true);
      await forgotPasswordApi(email);
      setSuccess('Password reset link has been sent to your email');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while requesting password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setError('');
      setSuccess('');

      if (!email || !isValidEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      setIsLoading(true);
      await resendVerificationEmailApi(email);
      setSuccess('Verification email has been resent');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while resending verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'password') {
      return (
        <View className="flex-1 px-4 py-6">
          <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: 'Password / Email Check',
            }}
          />
          <Text className="mb-2 text-lg font-bold text-gray-800">Find Password</Text>
          <Text className="mb-6 text-gray-600">
            Enter your registered email address to receive a password reset link.
          </Text>

          <View className="space-y-4">
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? <Text className="text-red-500">{error}</Text> : null}
            {success ? <Text className="text-green-500">{success}</Text> : null}

            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={isLoading}
              className={`rounded-lg px-4 py-3 ${isLoading ? 'bg-gray-400' : 'bg-purple-custom'}`}>
              <Text className="text-center font-medium text-white">
                {isLoading ? 'Processing...' : 'Get Password Reset Link'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1 px-4 py-6">
        <Text className="mb-2 text-lg font-bold text-gray-800">Resend Verification Email</Text>
        <Text className="mb-6 text-gray-600">
          Enter your registered email address to receive a verification email.
        </Text>

        <View className="space-y-4">
          <TextInput
            className="rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text className="text-red-500">{error}</Text> : null}
          {success ? <Text className="text-green-500">{success}</Text> : null}

          <TouchableOpacity
            onPress={handleResendVerification}
            disabled={isLoading}
            className={`rounded-lg px-4 py-3 ${isLoading ? 'bg-gray-400' : 'bg-purple-custom'}`}>
            <Text className="text-center font-medium text-white">
              {isLoading ? 'Processing...' : 'Resend Verification Email'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tab Buttons */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab('password')}
          className={`flex-1 p-4 ${
            activeTab === 'password' ? 'border-b-2 border-purple-custom' : ''
          }`}
          activeOpacity={0.7}>
          <Text
            className={`text-center font-medium ${
              activeTab === 'password' ? 'text-purple-custom' : 'text-gray-600'
            }`}>
            Find Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('email')}
          className={`flex-1 p-4 ${activeTab === 'email' ? 'border-b-2 border-purple-custom' : ''}`}
          activeOpacity={0.7}>
          <Text
            className={`text-center font-medium ${
              activeTab === 'email' ? 'text-purple-custom' : 'text-gray-600'
            }`}>
            Resend Verification Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">{renderContent()}</ScrollView>
    </View>
  );
}
