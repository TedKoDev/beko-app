import { Stack } from 'expo-router';
import React from 'react';
import { View, FlatList, Text } from 'react-native';

import CommentItem from '~/app/event/[id]/components/CommentItem';
import {
  useComments,
  useToggleCommentLike,
  useDeleteComment,
  useUpdateComment,
} from '~/queries/hooks/comments/useComments';
import { AdBanner } from '~/src/components/ads/AdBanner';
import { useAuthStore } from '~/store/authStore';

export default function MyCommentsScreen() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const toggleLike = useToggleCommentLike();
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();

  console.log('userInfo', userInfo?.user_id);

  const { data, fetchNextPage, hasNextPage, isLoading } = useComments(
    0,
    userInfo?.user_id || 0,
    'latest'
  );

  const handleToggleLike = (commentId: number) => {
    toggleLike.mutate(commentId);
  };

  const handleDelete = (commentId: number) => {
    deleteComment.mutate(commentId);
  };

  const handleEdit = (commentId: number, newContent: string) => {
    updateComment.mutate({ commentId, content: newContent });
  };

  const renderItem = ({ item }: any) => (
    <CommentItem
      comment={item}
      onToggleLike={handleToggleLike}
      onDelete={handleDelete}
      onEdit={handleEdit}
      isQuestionAuthor={false}
      post_type="NORMAL"
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AdBanner />
      <Stack.Screen
        options={{
          title: 'My Comments',
          headerTitleAlign: 'center',
          headerShadowVisible: true,
        }}
      />
      <FlatList
        data={data?.pages.flatMap((page) => page.data) || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.comment_id.toString()}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-gray-500">No comments yet</Text>
          </View>
        )}
      />
    </View>
  );
}
