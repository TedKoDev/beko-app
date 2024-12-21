import { Feather, FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
export default function EventListItem({ event }: any) {
  // 삭제되지 않은 미디어만 필터링
  const activeMedia = event.media?.filter((media: any) => media.deleted_at === null) || [];

  //console.log('event', JSON.stringify(event, null, 2));
  return (
    <Link href={`/event/${event.post_id}`} asChild>
      <Pressable className="border-b border-gray-200 bg-white p-4">
        <View className="mb-2 flex-row items-center">
          <View className="flex-1 flex-row items-center">
            {event.type === 'QUESTION' && (
              <Text className="mr-2 text-lg text-purple-custom">Q.</Text>
            )}
            {event.user_profile_picture_url ? (
              <Image
                source={{ uri: event.user_profile_picture_url }}
                style={{ width: 24, height: 24, borderRadius: 12 }}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <FontAwesome name="user-circle" size={24} color="#7b33ff" />
            )}
            <Text className="ml-2 text-sm text-gray-500">{event.username || ''}</Text>

            {event.flag_icon && (
              <Text className="ml-2 text-xs text-orange-400">{event.flag_icon}</Text>
            )}

            {event.user_level != null && (
              <Text className="ml-2 text-xs text-orange-400">Lv {event.user_level}</Text>
            )}
            <Text className="ml-2 text-sm text-gray-500">
              · {dayjs(event.created_at).format('YY/MMM/DD')}
            </Text>
          </View>
        </View>

        <View className={`flex-row ${activeMedia.length > 0 ? 'gap-4' : ''}`}>
          <View className={`flex-1 ${activeMedia.length > 0 ? 'flex-[2]' : ''}`}>
            {event.post_content?.title && (
              <Text className="mb-2 text-lg font-bold" numberOfLines={2}>
                {event.post_content.title}
              </Text>
            )}
            <Text className="text-base text-gray-600" numberOfLines={2}>
              {event.post_content?.content || ''}
            </Text>
          </View>

          {activeMedia.length > 0 && (
            <View className="relative flex-1">
              <Image
                source={{ uri: activeMedia[0].media_url }}
                style={{
                  width: '100%',
                  height: 80,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: '#f4f4f4',
                }}
                contentFit="fill"
                transition={200}
              />
              {activeMedia.length > 1 && (
                <View className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-1">
                  <Text className="text-xs text-white">+{activeMedia.length - 1}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            {event.category_name && (
              <Text className="text-xs text-purple-custom">{event.category_name}</Text>
            )}
            {event.type === 'QUESTION' && (
              <>
                <Text className="text-xs text-gray-500">·</Text>
                {event.post_content?.points != null && (
                  <Text className="text-xs text-orange-500">{event.post_content.points}P</Text>
                )}
                {event.post_content?.is_answer && (
                  <>
                    <Text className="text-xs text-gray-500">·</Text>
                    <Text className="text-xs text-green-500">답변완료</Text>
                  </>
                )}
              </>
            )}
          </View>

          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <Feather name="eye" size={16} color="gray" />
              <Text className="ml-1 text-sm text-gray-500">{event.views || 0}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <Feather name="message-square" size={16} color="gray" />
              <Text className="ml-1 text-sm text-gray-500">{event.comment_count || 0}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <FontAwesome
                name={event.user_liked ? 'heart' : 'heart-o'}
                size={16}
                color={event.user_liked ? 'red' : 'gray'}
              />
              <Text className="ml-1 text-sm text-gray-500">{event.likes || 0}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
