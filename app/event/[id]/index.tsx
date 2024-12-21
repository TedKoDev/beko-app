import { Feather, FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

import CommentInput from './components/CommentInput';
import CommentSection from './components/CommentSection';
import UserInfo from './components/UserInfo';

import { useComments } from '~/queries/hooks/comments/useComments';
import { useGetPostById } from '~/queries/hooks/posts/usePosts';
import { useTogglePostLike } from '~/queries/hooks/useLikes';

const { width } = Dimensions.get('window');

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const { data: post, isLoading } = useGetPostById(Number(id));
  const { data } = useComments(Number(id), null, 'latest');

  // console.log('post', post);

  const [activeIndex, setActiveIndex] = useState(0);
  const togglePostLikeMutation = useTogglePostLike();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  }, []);

  // Move the useComments hook call here, but only use it if post is defined

  const comment_count = data?.pages[0]?.total ?? 0;

  if (isLoading) return <Text>Loading...</Text>;
  if (!post) return <Text>Post not found</Text>;

  // console.log('post', JSON.stringify(post, null, 2));
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View className="flex-1 bg-white">
          <Stack.Screen
            options={{
              headerTitle: 'Detail',
            }}
          />

          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets>
            <UserInfo
              post_id={post.post_id}
              user_id={post.user_id}
              username={post.username}
              createdAt={dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}
              user_level={post.user_level}
              flag_icon={post.country_flag_icon}
              user_profile_picture_url={post.user_profile_picture_url}
            />

            <View className="py-2">
              {/* Post Content */}
              {post.post_content.title && (
                <Text className="mb-2 px-2 text-lg font-bold">{post.post_content.title}</Text>
              )}
              {post.media && post.media.length > 0 && (
                <View>
                  <FlatList
                    data={post.media}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => setSelectedImage(item.media_url)}>
                        <Image
                          contentFit="contain"
                          source={{ uri: item.media_url }}
                          style={{ width, height: 300 }}
                          className="mb-4 rounded-lg"
                        />
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.media_id.toString()}
                  />
                  <View className="mt-2 flex-row justify-center">
                    {post.media.map((_: any, index: any) => (
                      <View
                        key={index}
                        className={`mx-1 h-2 w-2 rounded-full ${
                          index === activeIndex ? 'bg-purple-custom' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </View>
                </View>
              )}
              {post.post_content.content && (
                <Text className="mb-4 px-2 text-base text-gray-800">
                  {post.post_content.content}
                </Text>
              )}
              {/* 토픽 카테고리 */}
              <View className="ml-4 flex-row items-center gap-2">
                <Text className="text-sm font-bold text-purple-custom">Category:</Text>
                <Text className="text-sm text-gray-500">{post.category_name}</Text>
              </View>

              {/* Engagement Stats */}
              <View className="mt-2 flex-row items-center gap-4 border-b border-gray-200 px-4 pb-4">
                <Pressable onPress={() => togglePostLikeMutation.mutate(post.post_id)}>
                  <View className="flex-row items-center">
                    <FontAwesome
                      name={post.user_liked ? 'heart' : 'heart-o'}
                      size={24}
                      color={post.user_liked ? 'red' : '#666666'}
                    />
                    <Text className="ml-1 text-sm text-gray-500">{post.likes}</Text>
                  </View>
                </Pressable>

                <View className="flex-row items-center">
                  <Feather name="message-square" size={24} color="#666666" />
                  <Text className="ml-1 text-sm text-gray-500">{comment_count || 0}</Text>
                </View>

                <View className="flex-row items-center">
                  <Feather name="eye" size={24} color="#666666" />
                  <Text className="ml-1 text-sm text-gray-500">{post.views}</Text>
                </View>

                {post.type === 'QUESTION' && (
                  <View className="flex-row items-center">
                    <FontAwesome name="diamond" size={24} color="orange" />
                    <Text className="ml-1 text-sm text-orange-500">
                      p.
                      {post.post_content.points || 0}
                    </Text>
                  </View>
                )}
              </View>

              {/* Comments Section */}
              <View className="px-4">
                <CommentSection
                  postId={post.post_id}
                  postType={post.type}
                  post_user_id={post.user_id}
                />
              </View>
              {/* <View className="h-20" /> */}
            </View>
          </ScrollView>

          <View className="mb-2 border-t border-gray-200">
            <CommentInput postId={post.post_id} />
            {/* {Platform.OS === 'android' && <View className="h-14" />} */}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 이미지 전체화면 모달 */}
      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/90"
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}>
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: selectedImage || undefined }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
              contentPosition="center"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
