import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import AdList from '../AdList';

import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { adUnitId } from '~/src/config/ads';
interface NoticeSectionProps {
  title: string;
  categoryId: number;
  items: any[];
}

const NoticeSection: React.FC<NoticeSectionProps> = ({ title, categoryId, items }) => {
  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center justify-between px-4">
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/board/notice',
              params: { categoryId },
            })
          }>
          <Text className="text-purple-custom">See more</Text>
        </TouchableOpacity>
      </View>
      <View>
        <AdList items={items.slice(0, 3)} />
      </View>
    </View>
  );
};

const NoticeCategories: React.FC = () => {
  const { data: topics } = useTopics();

  const { data: posts } = usePosts({
    page: 1,
    limit: 30,
    sort: 'latest',
    type: 'COLUMN',
    topicId: undefined,
    categoryId: undefined,
  });

  console.log('posts§12312312:', JSON.stringify(posts, null, 2));

  const noticeTopic = topics?.find((topic) => topic.title === 'Notice');
  const noticePosts = posts?.pages[0]?.data || [];

  if (!noticeTopic) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No notice categories found</Text>
      </View>
    );
  }

  return (
    <>
      <View className="w-full ">
        <BannerAd
          unitId={adUnitId || ''}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
      <ScrollView className="flex-1">
        {noticeTopic.category.map((category) => {
          // 해당 카테고리의 게시물만 필터링
          const categoryPosts = noticePosts
            .filter((post: any) => post.category_id === category.category_id)
            .map((post: any) => ({
              id: post.post_id,
              company_name: post.post_content.title,
              description: post.post_content.content,
              image_url: post.media[0]?.media_url || '',
              created_at: post.created_at,
              link: null, // 필요한 경우 링크 추가
            }));

          return (
            <NoticeSection
              key={category.category_id}
              title={category.category_name}
              categoryId={category.category_id}
              items={categoryPosts}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

export default NoticeCategories;
