import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

export interface ImageInfo {
  uri: string;
  type: string;
}

interface ImagePickerProps {
  images: ImageInfo[];
  onImagesChange: (images: ImageInfo[]) => void;
  maxImages?: number;
  isLoading?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  isLoading = false,
}) => {
  const pickImages = async () => {
    try {
      if (images.length >= maxImages) {
        Alert.alert('알림', `최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
        return;
      }

      const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
        return;
      }

      const remainingSlots = maxImages - images.length;
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
        allowsEditing: false,
        exif: false,
        base64: false,
        videoMaxDuration: undefined,
        presentationStyle: ExpoImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
        aspect: undefined,
        options: {
          compress: 0.8,
          format: 'jpeg' as any,
        },
      });

      if (!result.canceled) {
        const newImages = await Promise.all(
          result.assets.map(async (asset) => {
            const response = await fetch(asset.uri);
            const blob = await response.blob();
            return {
              uri: asset.uri,
              type: blob.type || 'image/jpeg',
            };
          })
        );
        onImagesChange([...images, ...newImages].slice(0, maxImages));
      }
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      Alert.alert('오류', '이미지를 선택하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={pickImages}
          disabled={isLoading || images.length >= maxImages}
          className="flex-row items-center rounded-lg bg-gray-100 p-3">
          {isLoading ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Ionicons name="image-outline" size={24} color="#666" />
          )}
          <Text className="ml-2">{isLoading ? 'Loading images...' : 'Add Images'}</Text>
        </TouchableOpacity>

        <Text className="text-sm text-gray-600">
          {images.length}/{maxImages}
        </Text>
      </View>

      {/* Image Preview */}
      <ScrollView horizontal className="mt-2">
        {images.map((image, index) => (
          <View key={index} className="mr-2">
            <View className="relative">
              <Image source={{ uri: image.uri }} className="h-20 w-20 rounded-lg" />
              <TouchableOpacity
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1"
                onPress={() => removeImage(index)}>
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
