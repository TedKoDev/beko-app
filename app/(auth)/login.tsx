import { AntDesign } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';

import Auth from './components/Auth';

import { useAuthStore } from '~/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, socialLogin } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        await login(email, password);
      } catch (error: any) {
        //console.log('Error details:', error);
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message;

        switch (statusCode) {
          case 404:
            alert('User not found. Please sign up first.');
            break;
          case 401:
            alert('Incorrect password. Please try again.');
            break;
          case 403:
            alert('Email verification required. Please check your email.');
            break;
          default:
            alert(errorMessage || 'Login failed. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please enter email and password');
    }
  };

  const handleAppleLogin = async () => {
    try {
      console.log('Apple login started');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // JWT 디코딩 (base64 디코딩)
      const payload = credential.identityToken.split('.')[1];
      const decodedPayload = decodeBase64(payload);
      const decodedToken = JSON.parse(decodedPayload);

      console.log('decodedToken', decodedToken);
      // 이메일 정보 추출
      const email = decodedToken.email;

      await socialLogin('APPLE', credential.user, email, '');

      console.log('Apple login success');
      router.replace('/');
    } catch (error: any) {
      console.log('Apple login error:', error);
      if (error.code === 'ERR_CANCELED') {
        console.log('User cancelled Apple login');
      } else {
        console.error('Apple login error:', error);
        alert('Apple login failed. Please try again.');
      }
    }
  };

  // base64 디코딩 함수
  const decodeBase64 = (input: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }

    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Video
          source={require('../../assets/background.mp4')}
          isMuted
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#fff"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#fff"
          />

          <Pressable style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </Pressable>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {Platform.OS === 'ios' && (
            <Pressable style={styles.socialButton} onPress={handleAppleLogin}>
              <AntDesign name="apple1" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </Pressable>
          )}

          <Auth />

          <Pressable style={styles.registerLink} onPress={() => router.push('/register')}>
            <Text style={styles.registerLinkText}>Don't have an account? Register</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  loginButton: {
    backgroundColor: 'rgba(178, 39, 212, 0.7)',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  registerLink: {
    marginTop: 20,
  },
  registerLinkText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
