import { useQuery } from '@tanstack/react-query';
import { youtubeService } from '~/services/youtubeService';
import { useAuthStore } from '~/store/authStore';

// videoId 추출 유틸 함수
const getYoutubeVideoId = (url: string) => {
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

export interface YoutubeItem {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  channelId: string;
  thumbnail: string;
}

const CHANNEL_INFO = {
  id: 'UCnV92PH-m2oxVD-jXIggNkQ',
  name: '베라한국어',
};

export const useYoutubeLinks = () => {
  const token = useAuthStore((state) => state.userToken);
  return useQuery({
    queryKey: ['youtube', 'links'],
    queryFn: async () => {
      const data = await youtubeService.getAllLinks();

      const uniqueLinks = Array.from(new Set(data.map((item) => item.link)));

      return uniqueLinks.map((link, index): YoutubeItem => {
        const videoId = getYoutubeVideoId(link);
        //console.log('VideoId', videoId);
        return {
          id: `${videoId}-${index}`,
          videoId,
          title: data[index].name,
          channel: CHANNEL_INFO.name,
          channelId: CHANNEL_INFO.id,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        };
      });
    },
    staleTime: 1000 * 60 * 5, // 5분간 데이터가 신선하다고 간주

    refetchOnWindowFocus: false,
    enabled: !!token,
  });
};

export const useRandomYoutubeLink = () => {
  return useQuery({
    queryKey: ['youtube', 'random'],
    queryFn: async () => {
      const data = await youtubeService.getRandomLink();
      const videoId = getYoutubeVideoId(data.link);

      return {
        id: videoId,
        videoId,
        title: '카페 재즈',
        channel: CHANNEL_INFO.name,
        channelId: CHANNEL_INFO.id,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    },
  });
};
