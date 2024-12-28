import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { useAddPost } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { CreateMediaDto, CreatePostDto } from '~/services/postService';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';

const MAX_IMAGES = 3;

export default function WriteForConsultationScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(2);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ uri: string; type: string }[]>([]);

  const { data: topics = [] } = useTopics();
  const { data: userInfo } = useUserInfo();
  const addPost = useAddPost();

  // 1:1 문의 토픽의 카테고리만 필터링
  const consultationCategories = topics.find((topic) => topic.topic_id === 1)?.category || [];

  // 선택된 카테고리의 기본 가격 가져오기
  const selectedCategoryPrice =
    consultationCategories.find((cat) => cat.category_id === selectedCategory)?.base_price || 0;

  // 포인트가 충분한지 확인
  const hasEnoughPoints = (userInfo?.points || 0) >= selectedCategoryPrice;

  const pickImages = async () => {
    try {
      if (selectedImages.length >= MAX_IMAGES) {
        Alert.alert('Alert', 'You can only upload up to 3 images.');
        return;
      }

      // 권한 체크 추가
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Alert', 'Photo library access is required.');
        return;
      }

      setIsImageLoading(true);

      const remainingSlots = MAX_IMAGES - selectedImages.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8, // 품질을 약간 낮춤
        selectionLimit: remainingSlots,
        allowsEditing: false, // 편집 비활성화
        exif: false, // EXIF 데이터 비활성화
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
        }));
        setSelectedImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
      }
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      Alert.alert('오류', '이미지를 선택하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('알림', '제목을 입력해주세요.');
        return;
      }

      if (!content.trim()) {
        Alert.alert('알림', '내용을 입력해주세요.');
        return;
      }

      if (!selectedCategory) {
        Alert.alert('알림', '상담 유형을 선택해주세요.');
        return;
      }

      if (!hasEnoughPoints) {
        Alert.alert(
          '포인트 부족',
          '상담을 신청하기 위한 포인트가 부족합니다.\n포인트를 충전하시겠습니까?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Charge',
              onPress: () => router.push('/(tabs)/feed'),
            },
          ]
        );
        return;
      }

      setIsImageLoading(true);

      const uploadedUrls = await Promise.all(
        selectedImages.map(async (image) => {
          const extension = image.uri.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
          const { url } = await getPresignedUrlApi(fileName, image.type);
          const response = await fetch(image.uri);
          const blob = await response.blob();
          await uploadFileToS3(url, blob);
          return url.split('?')[0];
        })
      );

      const mediaData = uploadedUrls.map((url) => ({
        mediaUrl: url,
        mediaType: 'IMAGE',
      }));

      const postData: CreatePostDto = {
        type: 'CONSULTATION',
        categoryId: selectedCategory,
        title: title.trim(),
        content: content.trim(),
        basePrice: selectedCategoryPrice,
        isPrivate: true,
        media: mediaData as CreateMediaDto[],
      };

      await addPost.mutateAsync(postData);
      // router.back();
      router.dismissAll();
      router.push('/consultations');
    } catch (error) {
      console.error('상담 글 작성 실패:', error);
      Alert.alert('오류', '상담 글 작성에 실패했습니다.');
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '1:1 Consultation',
        }}
      />
      <ScrollView className="flex-1 bg-white p-4">
        {/* 상담 유형 선택 */}
        <View className="mb-4">
          <Text className="mb-2 text-gray-600">Consultation Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {consultationCategories.map((category) => (
                <TouchableOpacity
                  key={category.category_id}
                  onPress={() => setSelectedCategory(category.category_id)}
                  className={`rounded-full px-4 py-2 ${
                    selectedCategory === category.category_id ? 'bg-purple-custom' : 'bg-gray-200'
                  }`}>
                  <Text
                    className={
                      selectedCategory === category.category_id ? 'text-white' : 'text-gray-700'
                    }>
                    {category.category_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 가격 및 포인트 정보 */}
        {selectedCategory && (
          <View className="mb-4 rounded-lg bg-gray-100 p-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-gray-600">Consultation Cost</Text>
              <Text className="text-lg font-bold text-purple-custom">
                {selectedCategoryPrice} P
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Points</Text>
              <Text
                className={`text-lg font-bold ${hasEnoughPoints ? 'text-green-500' : 'text-red-500'}`}>
                {userInfo?.points || 0} P
              </Text>
            </View>
            {!hasEnoughPoints && (
              <Text className="mt-2 text-sm text-red-500">
                Not enough points. Please charge and use it.
              </Text>
            )}
          </View>
        )}

        {/* 제목 입력 */}
        <View className="mb-4 ">
          <TextInput
            className="rounded-lg border border-gray-300 p-3"
            placeholder="Enter the title"
            value={title}
            onChangeText={(text) => {
              if (text.length <= 200) {
                setTitle(text);
              }
            }}
            maxLength={200}
          />
          <Text className="mt-1 text-right text-sm text-gray-500">
            {title.length}/{200}
          </Text>
        </View>

        {/* 내용 입력 */}
        <View className="mb-4 ">
          <TextInput
            className="h-40 rounded-lg border border-gray-300 p-3"
            placeholder="Enter the content"
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={(text) => {
              if (text.length <= 1000) {
                setContent(text);
              }
            }}
          />
          <Text className="mt-1 text-right text-sm text-gray-500">
            {content.length}/{1000}
          </Text>
        </View>

        {/* Image attachment */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={pickImages}
              disabled={isImageLoading || selectedImages.length >= MAX_IMAGES}
              className="flex-row items-center rounded-lg bg-gray-100 p-3">
              {isImageLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Ionicons name="image-outline" size={24} color="#666" />
              )}
              <Text className="ml-2">{isImageLoading ? 'Loading...' : 'Add image'}</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">
              {selectedImages.length}/{MAX_IMAGES}
            </Text>
          </View>

          {/* Image preview */}
          <ScrollView horizontal className="mt-2">
            {selectedImages.map((image, index) => (
              <View key={index} className="mr-2">
                <View className="relative">
                  <Image
                    source={{ uri: image.uri }}
                    className="h-20 w-20 rounded-lg"
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoadEnd={() => setIsImageLoading(false)}
                  />
                  <TouchableOpacity
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1"
                    onPress={() =>
                      setSelectedImages((images) => images.filter((_, i) => i !== index))
                    }>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Submit button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-lg bg-purple-custom p-4"
          disabled={addPost.isPending}>
          <Text className="text-center font-bold text-white">
            {addPost.isPending ? 'Writing...' : 'Write consultation'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
