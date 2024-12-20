import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, FlatList, Modal, Alert } from 'react-native';

import { useCountry } from '~/queries/hooks/utils/useCountry';
import { authService } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

interface Country {
  country_id: number;
  country_code: string;
  country_name: string;
  flag_icon: string;
  user_count: number;
}

export default function RegisterScreen() {
  const params = useLocalSearchParams<{
    term_agreement: string;
    privacy_agreement: string;
    marketing_agreement: string;
  }>();

  console.log('params', params);
  const agreements = {
    terms: Boolean(Number(params.term_agreement)), // '1' -> true, '0' -> false
    privacy: Boolean(Number(params.privacy_agreement)),
    marketing: Boolean(Number(params.marketing_agreement)),
  };

  console.log('agreements', agreements);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  // const [setIsCheckingName] = useState(false);
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const { register } = useAuthStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<Country>({
    country_id: 1, // Global의 ID
    country_code: 'GL',
    country_name: 'Global',
    flag_icon: '🌎',
    user_count: 0,
  });

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: countries } = useCountry();
  console.log('countries', countries);

  const filteredCountries = countries?.filter(
    (country: Country) =>
      country.country_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.country_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkName = debounce(async (name: string) => {
    if (!name) {
      setNameError('');
      setIsNameValid(false);
      return;
    }

    try {
      const available = await authService.checkName(name);
      setIsNameValid(available);
      setNameError(available ? '' : 'This name is already taken.');
    } catch (error) {
      if (error instanceof Error) {
        setNameError(error.message);
      } else {
        setNameError('Failed to check name availability.');
      }
      setIsNameValid(false);
    }
  }, 500);

  const checkEmail = async (email: string) => {
    if (!email) {
      setEmailError('');
      setIsEmailValid(false);
      return;
    }
    setIsCheckingEmail(true);
    try {
      const available = await authService.checkEmail(email);
      setIsEmailValid(available);
      setEmailError(available ? '' : 'This email is already registered.');
    } catch (error) {
      if (error instanceof Error) {
        setEmailError(error.message);
      } else {
        setEmailError('Failed to check email availability.');
      }
      setIsEmailValid(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleRegister = async () => {
    if (isLoading) return;

    if (!isEmailValid || !isNameValid) {
      alert('Please make sure both email and name are available.');
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    // 비밀번호 유효성 검사를 위한 정규식
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and contain:\n\n' +
          '• At least one uppercase letter\n' +
          '• At least one lowercase letter\n' +
          '• At least one number\n' +
          '• At least one special character (@$!%*?&)'
      );
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await register(
        name,
        email,
        password,
        selectedCountry.country_id,
        agreements.terms,
        agreements.privacy,
        agreements.marketing
      );
      alert('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Registration failed: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="mb-8 text-2xl font-semibold text-gray-800">Create Account</Text>

          <Pressable
            className="mb-4 h-[50px] w-full flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-4"
            onPress={() => setShowCountryModal(true)}>
            <Text className="text-base text-gray-800">
              {selectedCountry.flag_icon} {selectedCountry.country_name}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </Pressable>

          <View className="w-full">
            <TextInput
              className={`mb-4 h-[50px] w-full rounded-lg border bg-white px-4 ${
                nameError ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="NickName"
              value={name}
              onChangeText={(text) => {
                setName(text);
                checkName(text);
              }}
            />
            {nameError ? (
              <Text className="-mt-2 mb-2 text-xs text-red-500">{nameError}</Text>
            ) : isNameValid && name ? (
              <Text className="-mt-2 mb-2 text-xs text-green-600">This name is available!</Text>
            ) : null}
          </View>

          <View className="w-full">
            <View className="mb-4 flex-row items-center">
              <TextInput
                className={`mr-2 h-[50px] flex-1 rounded-lg border bg-white px-4 ${
                  emailError ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Pressable
                className={`rounded-lg bg-[#7b33ff] px-4 py-2.5 ${
                  isCheckingEmail ? 'opacity-70' : ''
                }`}
                onPress={() => checkEmail(email)}
                disabled={isCheckingEmail}>
                <Text className="text-sm font-medium text-white">
                  {isCheckingEmail ? 'Checking...' : 'Check'}
                </Text>
              </Pressable>
            </View>
            {emailError ? (
              <Text className="-mt-2 mb-2 text-xs text-red-500">{emailError}</Text>
            ) : isEmailValid && email ? (
              <Text className="-mt-2 mb-2 text-xs text-green-600">This email is available!</Text>
            ) : null}
          </View>

          <TextInput
            className="mb-4 h-[50px] w-full rounded-lg border border-gray-200 bg-white px-4"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text className="-mt-2 mb-4 text-xs text-gray-500">
            Password must be at least 8 characters long and contain uppercase, lowercase, number,
            and special character
          </Text>

          <TextInput
            className="mb-4 h-[50px] w-full rounded-lg border border-gray-200 bg-white px-4"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Pressable
            className={`mt-4 h-[50px] w-full items-center justify-center rounded-lg ${
              isLoading ? 'opacity-70' : ''
            } bg-[#7b33ff]`}
            onPress={handleRegister}
            disabled={isLoading}>
            <Text className="text-lg font-semibold text-white">
              {isLoading ? '등록 중...' : 'Sign Up'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-base text-[#5568FE] underline">
              Already have an account? Login
            </Text>
          </Pressable>
        </View>

        <Modal visible={showCountryModal} animationType="slide" transparent>
          <View className="flex-1 justify-end bg-black/50">
            <View className="max-h-[80%] rounded-t-3xl bg-white px-5 pb-5">
              <View className="flex-row items-center justify-between border-b border-gray-100 py-4">
                <Text className="text-lg font-semibold text-gray-800">Select Country</Text>
                <Pressable onPress={() => setShowCountryModal(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </Pressable>
              </View>

              <TextInput
                className="my-2.5 h-10 rounded-lg bg-gray-100 px-4"
                placeholder="Search country..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.country_code}
                renderItem={({ item }) => (
                  <Pressable
                    className="border-b border-gray-100 py-3"
                    onPress={() => {
                      setSelectedCountry(item);
                      setShowCountryModal(false);
                    }}>
                    <Text className="text-base text-gray-800">
                      {item.flag_icon} {item.country_name}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
