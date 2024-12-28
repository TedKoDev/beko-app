import { FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function InstagramStyleItem({ event }: any) {
  const activeMedia = event.media?.filter((media: any) => media.deleted_at === null) || [];

  return (
    <Link href={`/event/${event.post_id}`} asChild>
      <Pressable className="border-b border-gray-200 bg-white">
        <View className="flex-row items-center p-3">
          <View className="flex-row items-center">
            {event.type === 'QUESTION' && (
              <Text className="mr-2 text-lg text-purple-custom">Q.</Text>
            )}
            {event.user_profile_picture_url ? (
              <Image
                source={{ uri: event.user_profile_picture_url }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <FontAwesome name="user-circle" size={32} color="#B227D4" />
            )}
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="font-bold">{event.username || ''}</Text>
                {event.flag_icon && (
                  <Text className="ml-2 text-xs text-orange-400">{event.flag_icon}</Text>
                )}
                {event.user_level != null && (
                  <Text className="ml-1 text-xs text-orange-400">Lv {event.user_level}</Text>
                )}
              </View>
              <Text className="text-xs text-gray-500">
                {dayjs(event.created_at).format('YY/MMM/DD')}
              </Text>
            </View>
          </View>
        </View>

        {activeMedia.length > 0 && (
          <View className="relative border border-gray-200 shadow-sm">
            <Image
              source={{ uri: activeMedia[0].media_url }}
              style={{ width: '100%', height: 384 }}
              contentFit="contain"
              transition={200}
            />
            {activeMedia.length > 1 && (
              <View className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1">
                <Text className="text-sm text-white">+{activeMedia.length - 1}</Text>
              </View>
            )}
          </View>
        )}

        <View className="p-3">
          {event.post_content?.title && (
            <Text className="mb-2 text-base font-bold" numberOfLines={2}>
              {event.post_content.title}
            </Text>
          )}
          {event.post_content?.content && (
            <Text className="text-sm text-gray-600" numberOfLines={3}>
              {event.post_content.content}
            </Text>
          )}
        </View>

        <View className="mt-2 flex-row items-center justify-between p-3">
          <View className="flex-row items-center gap-2">
            {event.category_name && (
              <Text className="text-xs text-purple-custom">{event.category_name}</Text>
            )}
            {event.type === 'QUESTION' && event.post_content?.points != null && (
              <Text className="text-xs text-orange-500">{event.post_content.points}P</Text>
            )}
          </View>

          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <Feather name="eye" size={20} color="gray" />
              <Text className="ml-2 text-sm text-gray-600">{event.views || 0}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <Feather name="message-circle" size={20} color="gray" />
              <Text className="ml-2 text-sm text-gray-600">{event.comment_count || 0}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <FontAwesome
                name={event.user_liked ? 'heart' : 'heart-o'}
                size={20}
                color={event.user_liked ? 'red' : 'gray'}
              />
              <Text className="ml-2 text-sm text-gray-600">{event.likes || 0}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
