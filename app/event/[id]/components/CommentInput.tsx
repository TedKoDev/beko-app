import { Feather } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Pressable } from 'react-native-gesture-handler';

import { useCreateComment } from '~/queries/hooks/comments/useComments';

interface CommentInputProps {
  postId: number;
  placeholder?: string;
  onCommentSubmitted?: () => void;
}

export default function CommentInput({
  postId,
  placeholder = 'Write a comment...',
  onCommentSubmitted,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const createCommentMutation = useCreateComment();
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: content.trim(),
      });
      setContent('');
      onCommentSubmitted?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to write a comment.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-row items-center border-t border-gray-200 bg-white px-4 py-2">
        <View className="mr-2 flex-1">
          <TextInput
            ref={inputRef}
            className="h-auto rounded-full bg-gray-100 px-4 py-2"
            placeholder={placeholder}
            value={content}
            onChangeText={(text) => {
              if (text.length <= 200) {
                setContent(text);
              }
            }}
            multiline
            maxLength={200}
          />
          {content.length >= 200 ? (
            <Text className="mt-1 text-right text-sm text-red-500">max length is 200</Text>
          ) : null}
        </View>
        <Pressable
          onPress={handleSubmit}
          disabled={createCommentMutation.isPending || !content.trim()}
          className="rounded-full p-2"
          style={{ opacity: content.trim() ? 1 : 0.5 }}>
          <Feather name="send" size={24} color="#7b33ff" />
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
