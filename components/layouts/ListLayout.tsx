import { Ionicons, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import EventListingItem from '~/components/EventListingItem';
import InstagramStyleItem from '~/components/InstagramStyleItem';

interface ListLayoutProps {
  headerTitle: string;
  showSearchButton?: boolean;
  data: any[];
  showViewToggle?: boolean;
  showWriteButton?: boolean;
  hideButton?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => Promise<any>;
  isRefreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  renderItem?: ({ item }: { item: any }) => React.ReactElement;
  defaultViewMode?: 'list' | 'instagram';
}

export default function ListLayout({
  headerTitle,
  data,
  showViewToggle = true,
  isLoading = false,
  onLoadMore,
  onRefresh,
  isRefreshing = false,
  hideButton = false,
  showSearchButton = false,
  showWriteButton = false,
  writeRoute = '/write',
  onScroll,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
  renderItem,
  defaultViewMode = 'list',
}: ListLayoutProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'instagram'>(defaultViewMode);

  useEffect(() => {
    if (data?.length) {
      const imageUrls = data.reduce((acc: string[], item) => {
        if (item.media?.length) {
          acc.push(item.media[0].media_url);
        }
        if (item.user_profile_picture_url) {
          acc.push(item.user_profile_picture_url);
        }
        return acc;
      }, []);

      Image.prefetch(imageUrls);
    }
  }, [data]);

  const toggleViewMode = () => {
    const nextMode = viewMode === 'list' ? 'instagram' : 'list';
    if (data?.length) {
      const imageUrls = data.reduce((acc: string[], item) => {
        if (item.media?.length) {
          acc.push(item.media[0].media_url);
        }
        return acc;
      }, []);

      Image.prefetch(imageUrls);
    }
    setViewMode(nextMode);
  };

  const HeaderRight = () => {
    return (
      <View className="mr-4 flex-row items-center gap-4">
        {showSearchButton && (
          <Link href="/search" asChild>
            <Feather name="search" size={24} color="#B227D4" />
          </Link>
        )}
        {showWriteButton && (
          <Pressable
            onPress={() => {
              console.log('write button pressed');
              router.push(writeRoute as any);
            }}>
            <Feather name="edit" size={24} color="#B227D4" />
          </Pressable>
        )}
        {showViewToggle && (
          <Pressable onPress={toggleViewMode}>
            <Feather name={viewMode === 'list' ? 'grid' : 'list'} size={24} color="#B227D4" />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* {!hideHeader && ( */}
      <Stack.Screen
        options={{
          title: headerTitle,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          headerLeft: () =>
            hideButton ? null : (
              <Pressable
                onPress={() => {
                  console.log('back pressed');
                  router.back();
                }}
                style={({ pressed }) => ({
                  marginLeft: 0,
                  padding: 8,
                  opacity: pressed ? 0.5 : 1,
                  zIndex: 999,
                  elevation: 2,
                  position: 'relative',
                })}>
                <Ionicons name="chevron-back" size={24} color="#B227D4" />
              </Pressable>
            ),
          headerRight: () => (
            <View
              style={{
                zIndex: 2,
                elevation: 2,
                position: 'relative',
              }}>
              <HeaderRight />
            </View>
          ),
        }}
      />
      {/* )} */}

      <FlatList
        data={data}
        key={viewMode}
        renderItem={({ item }) =>
          renderItem ? (
            renderItem({ item })
          ) : viewMode === 'list' ? (
            <EventListingItem event={item} />
          ) : (
            <InstagramStyleItem event={item} />
          )
        }
        keyExtractor={(item) => item.post_id}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-white" />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListFooterComponent={() =>
          isLoading ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={contentContainerStyle}
      />
    </View>
  );
}
