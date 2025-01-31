import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { api } from './api';

// 스토어 URL 기본값 설정
const DEFAULT_STORE_URLS = {
  ios: 'https://apps.apple.com/us/app/berakorean/id6739745872',
  android: 'https://play.google.com/store/apps/details?id=com.ordihong.beko',
} as const;

interface VersionCheckResponse {
  needsUpdate: boolean;
  storeUrl?: string;
  message?: string;
  forceUpdate: boolean;
}

// 버전 문자열을 숫자 배열로 변환하는 함수
const parseVersion = (version: string): number[] => {
  return version.split('.').map(Number);
};

// 버전을 비교하는 함수 (v1이 v2보다 낮으면 true)
const isLowerVersion = (v1: string, v2: string): boolean => {
  const v1Parts = parseVersion(v1);
  const v2Parts = parseVersion(v2);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    if (v1Part < v2Part) return true;
    if (v1Part > v2Part) return false;
  }
  return false;
};

export const checkAppVersion = async (): Promise<VersionCheckResponse> => {
  try {
    const currentVersion = Constants.expoConfig?.version || '1.0.0';
    const buildNumber = String(
      Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1'
    );

    console.log('[checkVersionService] Current version:', currentVersion);
    console.log('[checkVersionService] Current build:', buildNumber);

    const response = await api.get('/app-version/check', {
      params: {
        platform: Platform.OS,
        version: currentVersion,
        build: parseInt(buildNumber, 10),
      },
    });

    console.log('[checkVersionService] Server response:', response.data);

    // 서버에서 최신 버전 정보를 받아옴
    const latestVersion = response.data.latestVersion;
    const forceUpdate = response.data.forceUpdate;

    // 버전 비교
    const needsUpdate = latestVersion
      ? isLowerVersion(currentVersion, latestVersion)
      : response.data.needsUpdate;

    // 백엔드에서 storeUrl을 보내지 않은 경우 기본 URL 사용
    const storeUrl =
      response.data.storeUrl ||
      (Platform.OS === 'ios' || Platform.OS === 'android'
        ? DEFAULT_STORE_URLS[Platform.OS]
        : undefined);

    return {
      needsUpdate,
      storeUrl,
      message:
        response.data.message || `새로운 버전(${latestVersion})이 있습니다. 업데이트하시겠습니까?`,
      forceUpdate: forceUpdate || false,
    };
  } catch (error) {
    console.error('[checkVersionService] Version check failed:', error);
    return {
      needsUpdate: false,
      forceUpdate: false,
    };
  }
};
