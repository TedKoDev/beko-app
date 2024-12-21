import dayjs from 'dayjs';
import { Stack } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

import { useGetPointHistory } from '~/queries/hooks/points/usePoints';
import { useAuthStore } from '~/store/authStore';
import { PointHistory } from '~/types/point';

export default function PointHistoryScreen() {
  const userInfo = useAuthStore((state) => state.userInfo);

  //console.log(userInfo?.user_id);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useGetPointHistory(userInfo?.user_id || 0);

  //console.log(JSON.stringify(data, null, 2));

  const renderItem = ({ item }: { item: PointHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyType}>{item.post_id ? `Post #${item.post_id}` : 'System'}</Text>
        <Text style={[styles.points, { color: item.points_change >= 0 ? '#2E7D32' : '#C62828' }]}>
          {item.points_change >= 0 ? '+' : ''}
          {item.points_change}
        </Text>
      </View>
      <Text style={styles.description}>{item.change_reason}</Text>
      <Text style={styles.date}>{dayjs(item.change_date).format('YYYY.MM.DD HH:mm')}</Text>
    </View>
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allItems = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7b33ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Point History',
          headerTitleAlign: 'center',
        }}
      />

      <View style={styles.totalPoints}>
        <Text style={styles.totalPointsLabel}>Total Points</Text>
        <Text style={styles.totalPointsValue}>{userInfo?.points || 0}</Text>
      </View>

      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.point_id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator style={styles.loader} color="#7b33ff" /> : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No point history yet</Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS === 'android' ? 16 : 0,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPoints: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalPointsLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalPointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7b33ff',
    marginTop: 5,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  loader: {
    padding: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
