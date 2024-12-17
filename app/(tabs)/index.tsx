import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { BoardTabs } from '~/components/board/BoardTabs';
import CustomCarousel from '~/components/customCarousel';
import GrayLine from '~/components/grayline';
import MenuCards from '~/components/home/MenuCards';
import YoutubeSection from '~/components/home/YoutubeSection';
import MainMenu from '~/components/maincategory/mainmenu';
import { LessonCard } from '~/components/todayvoca/lessoncard';
import { useAdbanner } from '~/queries/hooks/adbanner/useAdbanner';
import { useRefreshUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { AdBanner } from '~/src/components/ads/AdBanner';
import { adUnitId } from '~/src/config/ads';

export default function Home() {
  const queryClient = useQueryClient();
  const refreshUserInfo = useRefreshUserInfo();

  const { isRefetching, refetch } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const response = await fetch('/api/lessons');
      return response.json();
    },
  });
  const { data: adBannerResponse } = useAdbanner({ limit: 5 });

  // console.log('adBanners:', JSON.stringify(adBannerResponse, null, 2));

  const adBanners = useMemo(() => {
    if (!adBannerResponse?.pages) return [];
    return adBannerResponse.pages.flatMap((page) =>
      page.map((banner: any) => ({
        ...banner,
      }))
    );
  }, [adBannerResponse]);

  // console.log('adBanners1111:', JSON.stringify(adBanners, null, 2));

  const onRefresh = async () => {
    await Promise.all([
      refetch(),
      refreshUserInfo(),
      queryClient.invalidateQueries({ queryKey: ['words'] }),
      queryClient.invalidateQueries({ queryKey: ['logs'] }),
      queryClient.invalidateQueries({ queryKey: ['posts'] }),
      queryClient.invalidateQueries({ queryKey: ['todayWords'] }),
    ]);
  };

  return (
    <ScrollView
      className="bg-white"
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}>
      <Stack.Screen
        options={{
          headerTitle: '',
          title: 'HOME',
        }}
      />
      <View>
        <CustomCarousel items={adBanners} />
      </View>
      <View className="flex-row justify-around">
        <MainMenu />
      </View>
      <GrayLine thickness={5} marginTop={10} />
      <View className="-mb-4">
        <MenuCards />
      </View>
      <AdBanner />
      <GrayLine thickness={5} marginTop={0} />
      <YoutubeSection />
      <GrayLine thickness={5} marginTop={0} />
      <AdBanner />
      <GrayLine thickness={5} marginTop={0} />
      <LessonCard
        onMorePress={() => router.push('/write/with-words')}
        participationCount={10}
        points={500}
      />
      <View>
        <GrayLine thickness={5} marginTop={10} />
      </View>
      <View className="w-full ">
        <BannerAd
          unitId={adUnitId ?? ''}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
      <GrayLine thickness={5} marginTop={0} />
      <BoardTabs />
      <View className="mb-10">
        <GrayLine thickness={5} marginTop={10} />
      </View>
    </ScrollView>
  );
}
