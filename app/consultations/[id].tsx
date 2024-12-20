import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';

import ConsultationCommentSection from './components/ConsultationCommentSection';
import EditCommentModal from '../event/[id]/components/EditCommentModal';

import { useAnswerConsultation } from '~/queries/hooks/comments/useAnswerConsultation';
import { useCreateComment, useUpdateComment } from '~/queries/hooks/comments/useComments';
import { useConsultationById } from '~/queries/hooks/posts/useConsultations';
import { useDeletePost } from '~/queries/hooks/posts/usePosts';
import { commentService } from '~/services/commentService';
import { useAuthStore } from '~/store/authStore';
import { ConsultationStatus, getStatusColor, getStatusText } from '~/types/consultation';

export default function ConsultationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // app/consultations/[id].tsx
  const { data: consultation, isLoading } = useConsultationById(Number(id));
  console.log('123consultation', JSON.stringify(consultation, null, 2));

  const { userInfo } = useAuthStore();
  console.log('userInfo', userInfo);
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const answerConsultationMutation = useAnswerConsultation();

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const deletePost = useDeletePost();
  const isAuthor = userInfo?.user_id === consultation?.user_id;
  const isTeacher = userInfo?.role === 'TEACHER' || userInfo?.role === 'ADMIN';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#7b33ff" />
      </View>
    );
  }

  if (!consultation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Consultation information not found.</Text>
      </View>
    );
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      Alert.alert('Notification', 'Please enter the comment content.');
      return;
    }
    try {
      await createCommentMutation.mutateAsync({
        postId: consultation.post_id,
        content: newComment.trim(),
      });
      setNewComment('');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to write comment.' + error.message);
    }
  };

  const handleEditSubmit = async (newContent: string) => {
    if (!editingCommentId || !newContent.trim()) {
      Alert.alert('Notification', 'Please enter the comment content.');
      return;
    }
    try {
      await updateCommentMutation.mutateAsync({
        commentId: editingCommentId,
        content: newContent.trim(),
      });
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update comment.');
    }
  };

  const handlePostDelete = () => {
    Alert.alert('Delete post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // 게시글 삭제 API 호출
            await deletePost.mutateAsync(consultation.post_id);
            router.back();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete post.');
          }
        },
      },
    ]);
  };

  const handleConfirmAnswer = async (commentId: number) => {
    Alert.alert(
      'Confirm answer',
      'Are you sure you want to confirm this answer?\nAfter confirmation, it cannot be modified and the consultation points will be credited.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'default',
          onPress: async () => {
            try {
              const { data } = await commentService.getComments({
                postId: consultation.post_id,
                sort: 'latest',
              });
              const comment = data.find((c: any) => c.comment_id === commentId);

              if (!comment) {
                Alert.alert('Error', 'Failed to find answer.');
                return;
              }

              await answerConsultationMutation.mutateAsync({
                postId: consultation.post_id,
                content: comment.content,
                commentId,
              });
              Alert.alert('Notification', 'Answer confirmed.');
            } catch (error) {
              console.error('Error confirming answer:', error);
              Alert.alert('Error', 'Failed to confirm answer.');
            }
          },
        },
      ]
    );
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Consultation Detail',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={24} color="#7b33ff" />
            </TouchableOpacity>
          ),
          headerRight: isAuthor
            ? () => (
                <View className="mr-4 flex-row">
                  <TouchableOpacity onPress={() => router.push(`/consultations/${id}/edit`)}>
                    <MaterialIcons name="edit" size={24} color="#7b33ff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePostDelete} className="ml-4">
                    <MaterialIcons name="delete" size={24} color="#7b33ff" />
                  </TouchableOpacity>
                </View>
              )
            : undefined,
        }}
      />
      <ScrollView className="flex-1 bg-white ">
        {/* 상담 작성자 정보 */}
        <View className="mb-10 border-b border-gray-200 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ uri: consultation.user_profile_picture_url || undefined }}
                className="h-10 w-10 rounded-full bg-gray-200"
                contentFit="cover"
              />
              <View className="ml-3">
                <Text className="font-bold">{consultation.username}</Text>
                <Text className="text-sm text-gray-500">Lv.{consultation.user_level}</Text>
              </View>
            </View>
            <Text className="text-2xl">{consultation.country_flag_icon}</Text>
          </View>
        </View>

        {/* 상담 내용 */}
        <View className="p-4">
          {/* 상태 및 제목 */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-2xl font-bold">{consultation.post_content.title}</Text>
            <View
              className={`rounded-full px-4 py-2 ${getStatusColor(
                consultation.post_content.status as ConsultationStatus
              )}`}>
              <Text className="font-medium">{getStatusText(consultation.post_content.status)}</Text>
            </View>
          </View>

          {/* 카테고리 및 가격 정보 */}
          <View className="mb-4 rounded-lg bg-gray-50 p-3">
            <View className="flex-row items-center justify-between border-b border-gray-200 pb-2">
              <Text className="text-gray-600">카테고리</Text>
              <Text className="font-medium">{consultation.category_name}</Text>
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-gray-600">상담 비용</Text>
              <Text className="font-bold text-purple-500">{consultation.post_content.price} P</Text>
            </View>
          </View>

          {/* 상담 내용 */}
          <View className="rounded-lg bg-white p-4">
            <Text className="text-base leading-6 text-gray-800">
              {consultation.post_content.content}
            </Text>
          </View>

          {/* 이미지가 있는 경우 이미지 표시 */}
          {consultation.media &&
            consultation.media.filter((m: any) => !m.deleted_at && m.media_type === 'IMAGE')
              .length > 0 && (
              <View>
                <FlatList
                  data={consultation.media.filter(
                    (m: any) => !m.deleted_at && m.media_type === 'IMAGE'
                  )}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedImage(item.media_url)}>
                      <Image
                        contentFit="cover"
                        source={{ uri: item.media_url }}
                        style={{ width, height: 300 }}
                        className="mb-4 rounded-lg"
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.media_id.toString()}
                />
                <View className="mt-2 flex-row justify-center">
                  {consultation.media
                    .filter((m: any) => !m.deleted_at && m.media_type === 'IMAGE')
                    .map((_: any, index: any) => (
                      <View
                        key={index}
                        className={`mx-1 h-2 w-2 rounded-full ${
                          index === activeIndex ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                </View>
              </View>
            )}
        </View>

        {/* 선생님 정보 (있는 경우) */}
        {consultation.post_content.teacher && (
          <View className="mt-4 border-t border-gray-200 p-4">
            <Text className="mb-2 text-lg font-bold">담당 선생님</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: consultation.post_content.teacher.profile_picture_url || undefined,
                  }}
                  className="h-10 w-10 rounded-full bg-gray-200"
                  contentFit="cover"
                />
                <View className="ml-3">
                  <Text className="font-bold">{consultation.post_content.teacher.username}</Text>
                  <Text className="text-sm text-gray-500">
                    Lv.{consultation.post_content.teacher.level}
                  </Text>
                </View>
              </View>
              <Text className="text-2xl">
                {consultation.post_content.teacher.country?.flag_icon}
              </Text>
            </View>
          </View>
        )}

        {/* 댓글 섹션 */}
        <ConsultationCommentSection
          postId={consultation.post_id}
          onEdit={(commentId, content) => {
            setEditingCommentId(commentId);
            setEditingCommentContent(content);
          }}
          onConfirm={handleConfirmAnswer}
          status={consultation.post_content.status}
        />
      </ScrollView>
      {/* 댓글 작성 */}
      {isTeacher && (
        <View className="border-t border-gray-200 bg-white p-4">
          <View className="mb-2">
            <Text className="text-base font-bold">답변 작성</Text>
          </View>

          <TextInput
            className="mb-3 rounded-lg border border-gray-300 p-2"
            placeholder="답변을 입력하세요"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            numberOfLines={4}
          />

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleCommentSubmit}
              className="mr-2 flex-1 rounded-lg bg-purple-500 p-3">
              <Text className="text-center font-medium text-white">답변 작성</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* 댓글 수정 모달 */}
      <EditCommentModal
        visible={editingCommentId !== null}
        onClose={() => setEditingCommentId(null)}
        onSubmit={handleEditSubmit}
        initialContent={editingCommentContent}
      />
      {/* 이미지 전체화면 모달 */}
      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/90"
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}>
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: selectedImage || undefined }}
              style={{ width: '100%', height: '100%' }} // 명시적인 크기 지정
              contentFit="contain"
              contentPosition="center"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
