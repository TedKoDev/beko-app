import { Platform } from 'react-native';

export const adUnitId =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_GOOGLE_AD_UNIT_ID_IOS
    : process.env.EXPO_PUBLIC_GOOGLE_AD_UNIT_ID_ANDROID;
