import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { useUpdatePost } from '~/queries/hooks/posts/usePosts';

export default function EditSentence({ post }) {
  const [sentence, setSentence] = useState(post.post_content.content || '');
  const updatePost = useUpdatePost();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      if (!sentence.trim()) {
        Alert.alert('Notice', 'Please enter content.');
        return;
      }

      await updatePost.mutateAsync({
        postId: post.post_id,
        content: sentence.trim(),
        type: 'SENTENCE',
        categoryId: post.category_id,
        title: post.post_content.title,
      });

      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.back();
    } catch (error) {
      console.error('Failed to update post:', error);
      Alert.alert('Error', 'Failed to update post');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-4">
        <Text className="mb-2 text-base font-medium">Edit your sentence:</Text>
        <TextInput
          className="min-h-[100] rounded-lg border border-gray-300 bg-gray-50 p-3"
          multiline
          textAlignVertical="top"
          value={sentence}
          onChangeText={(text) => {
            if (text.length <= 200) {
              setSentence(text);
            }
          }}
        />
        <Text className="mt-1 text-right text-sm text-gray-500">
          {sentence.length}/{200}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="rounded-lg bg-purple-custom p-4"
        disabled={updatePost.isPending}>
        <Text className="text-center font-bold text-white">
          {updatePost.isPending ? 'Updating...' : 'Update Post'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
