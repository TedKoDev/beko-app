import React, { useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { adUnitId } from '~/src/config/ads';

interface AdBannerProps {
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View className={`w-full ${isLoaded ? className : 'h-0'}`}>
      <BannerAd
        unitId={adUnitId ?? ''}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => setIsLoaded(true)}
        onAdFailedToLoad={() => setIsLoaded(false)}
      />
    </View>
  );
};
