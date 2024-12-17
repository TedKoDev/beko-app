import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { useConsultationById } from '~/queries/hooks/posts/useConsultations';
import { useUpdateConsultation } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { queryClient } from '~/queries/queryClient';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';
import { getStatusColor, getStatusText } from '~/types/consultation';

export default function EditConsultation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: consultation, isLoading } = useConsultationById(Number(id));

  // 초기 상태 설정
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<
    { uri: string; type: string; media_id?: number }[]
  >([]);

  // consultation 데이터가 로드되면 초기값 설정
  useEffect(() => {
    if (consultation) {
      // 제목과 내용 설정
      setTitle(consultation.post_content.title || '');
      setContent(consultation.post_content.content || '');

      // 카테고리 설정
      setSelectedCategory(consultation.category_id);

      // 이미지 설정
      if (consultation.media) {
        const activeImages = consultation.media
          .filter((m: any) => !m.deleted_at && m.media_type === 'IMAGE')
          .map((media: any) => ({
            uri: media.media_url,
            type: 'image/jpeg',
            media_id: media.media_id,
          }));
        setSelectedImages(activeImages);
      }
    }
  }, [consultation]);

  const updatePost = useUpdateConsultation();
  const { data: topics = [] } = useTopics();

  const { data: userInfo } = useUserInfo();

  const [isImageLoading, setIsImageLoading] = useState(false);

  const MAX_IMAGES = 5;

  const consultationCategories = topics.find((topic) => topic.topic_id === 1)?.category || [];

  // console.log('consultationCategories', consultationCategories);

  const pickImages = async () => {
    try {
      if (selectedImages.length >= MAX_IMAGES) {
        Alert.alert('Alert', 'You can only upload up to 5 images.');
        return;
      }

      setIsImageLoading(true);

      const remainingSlots = MAX_IMAGES - selectedImages.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
        }));
        setSelectedImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
      }
    } catch (error) {
      console.error('EditConsultationScreen - 이미지 선택 오류:', error);
      Alert.alert('Error', 'Failed to select image.');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Alert', 'Please enter both title and content.');
      return;
    }

    try {
      setIsImageLoading(true);

      // 새로운 이미지와 기존 이미지 구분
      const newImages = selectedImages.filter((image) => !image.media_id);
      const existingImages = selectedImages.filter((image) => image.media_id);

      // 새 이미지 업로드
      const uploadedUrls = await Promise.all(
        newImages.map(async (image) => {
          const extension = image.uri.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
          const { url } = await getPresignedUrlApi(fileName, image.type);
          const response = await fetch(image.uri);
          const blob = await response.blob();
          await uploadFileToS3(url, blob);
          return url.split('?')[0];
        })
      );

      // 업데이트 데이터 구성
      const updateData = {
        postId: Number(id),
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategory!,
        points: selectedCategoryPrice,
        media: [
          ...existingImages.map((image) => ({
            media_id: image.media_id,
            mediaUrl: image.uri,
            mediaType: 'IMAGE',
          })),
          ...uploadedUrls.map((url) => ({
            mediaUrl: url,
            mediaType: 'IMAGE',
          })),
        ],
      };

      // console.log('updateData', JSON.stringify(updateData, null, 2));

      // Convert mediaType from string to 'IMAGE' | 'VIDEO' type
      const formattedUpdateData = {
        ...updateData,
        media: updateData.media.map((media) => ({
          ...media,
          mediaType: media.mediaType as 'IMAGE' | 'VIDEO',
        })),
      };
      // 데이터 업데이트가 반영될 시간을 주기
      // await new Promise((resolve) => setTimeout(resolve, 100));

      await updatePost.mutateAsync(formattedUpdateData);
      // 데이터 업데이트가 반영될 시간을 주기
      await new Promise((resolve) => setTimeout(resolve, 100));

      await queryClient.invalidateQueries({ queryKey: ['consultations'] });
      await queryClient.invalidateQueries({ queryKey: ['consultation', Number(id)] });
      await queryClient.refetchQueries({ queryKey: ['consultation', Number(id)] });
      await queryClient.refetchQueries({ queryKey: ['consultations'] });
      await queryClient.refetchQueries({ queryKey: ['consultation', Number(id)] });

      // setTimeout을 사용하여 네비게이션 지연
      setTimeout(() => {
        router.dismissAll();
        router.push(`/consultations/${consultation?.post_id}`);
      }, 300);
    } catch (error) {
      console.error('EditConsultationScreen - 수정 실패:', error);
      Alert.alert('Error', 'Failed to update.');
    } finally {
      setIsImageLoading(false);
    }
  };

  // 선택된 카테고리의 기본 가격 가져오기
  const selectedCategoryPrice =
    consultationCategories.find((cat) => cat.category_id === selectedCategory)?.base_price || 0;

  // 포인트가 충분한지 확인
  const hasEnoughPoints = (userInfo?.points || 0) >= selectedCategoryPrice;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#B227D4" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Edit Consultation',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={24} color="#B227D4" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-white p-4">
        {/* 카테고리 택 */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-bold">Consultation Type</Text>
            <Text className="text-sm text-gray-500">
              Current Selection:{' '}
              {
                consultationCategories.find((cat) => cat.category_id === selectedCategory)
                  ?.category_name
              }
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {consultationCategories.map((category) => (
              <TouchableOpacity
                key={category.category_id}
                onPress={() => setSelectedCategory(category.category_id)}
                className={`mr-2 rounded-full border px-4 py-2 ${
                  selectedCategory === category.category_id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300'
                }`}>
                <View className="flex-row items-center">
                  {selectedCategory === category.category_id && (
                    <Ionicons name="checkmark-circle" size={16} color="#B227D4" className="mr-1" />
                  )}
                  <Text
                    className={
                      selectedCategory === category.category_id
                        ? 'text-purple-500'
                        : 'text-gray-600'
                    }>
                    {category.category_name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 상담 상태 표시 */}
        <View className="mb-4">
          <Text className="mb-2 text-base font-bold">Consultation Status</Text>
          <View className={`rounded-lg p-3 ${getStatusColor(consultation?.post_content.status)}`}>
            <Text className="text-center font-medium">
              {getStatusText(consultation?.post_content.status)}
            </Text>
          </View>
        </View>

        {/* 가격 및 포인트 정보 */}
        <View className="mb-4 rounded-lg bg-gray-100 p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-gray-600">Consultation Cost</Text>
            <Text className="text-lg font-bold text-purple-500">{selectedCategoryPrice} P</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">Owned Points</Text>
            <Text
              className={`text-lg font-bold ${hasEnoughPoints ? 'text-green-500' : 'text-red-500'}`}>
              {userInfo?.points || 0} P
            </Text>
          </View>
          {!hasEnoughPoints && (
            <Text className="mt-2 text-sm text-red-500">
              You don't have enough points. Please charge and use it.
            </Text>
          )}
        </View>

        {/* 제목 입력 */}
        <TextInput
          className="mb-4 rounded-lg border border-gray-300 p-3"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        {/* 내용 입력 */}
        <TextInput
          className="mb-4 h-40 rounded-lg border border-gray-300 p-3"
          placeholder="Write your consultation content"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {/* 이미지 섹션 */}
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
              <Text className="ml-2">{isImageLoading ? '이미지 로딩중...' : '이미지 추가'}</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">
              {selectedImages.length}/{MAX_IMAGES}
            </Text>
          </View>

          {/* 이미지 미리보기 */}
          <ScrollView horizontal className="mt-2">
            {selectedImages.map((image, index) => (
              <View key={index} className="mr-2">
                <View className="relative">
                  <Image
                    source={{ uri: image.uri }}
                    className="h-20 w-20 rounded-lg"
                    resizeMode="cover"
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

        {/* 수정 버튼 */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-lg bg-purple-500 p-4"
          disabled={updatePost.isPending}>
          <Text className="text-center font-bold text-white">
            {updatePost.isPending ? '수정 중...' : '수정하기'}
          </Text>
        </TouchableOpacity>

        {/* Bottom Padding */}
        <View className="h-10" />
      </ScrollView>
    </>
  );
}
