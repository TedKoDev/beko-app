import * as Updates from 'expo-updates';
import { Platform, Linking } from 'react-native';

interface VersionCheckResponse {
  needsUpdate: boolean;
  storeUrl: string;
}

const STORE_URLS = {
  ios: '앱스토어_URL_여기에_입력',
  android: '플레이스토어_URL_여기에_입력',
};

export const checkAppVersion = async (): Promise<VersionCheckResponse> => {
  try {
    const update = await Updates.checkForUpdateAsync();
    const storeUrl = Platform.OS === 'ios' ? STORE_URLS.ios : STORE_URLS.android;

    // update.isAvailable이 true면 새 버전이 있다는 의미
    return {
      needsUpdate: update.isAvailable,
      storeUrl,
    };
  } catch (error) {
    console.error('Version check failed:', error);
    return {
      needsUpdate: false,
      storeUrl: Platform.OS === 'ios' ? STORE_URLS.ios : STORE_URLS.android,
    };
  }
};
