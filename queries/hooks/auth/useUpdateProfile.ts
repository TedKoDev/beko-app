import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserProfileApi } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

interface UpdateUserProfileDto {
  userId: number;
  username: string;
  bio?: string;
  profile_picture_url?: string;
  country_id: number;
  terms_agreed?: boolean;
  privacy_agreed?: boolean;
  marketing_agreed?: boolean;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.userToken);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const currentUserInfo = useAuthStore((state) => state.userInfo);

  return useMutation({
    mutationFn: async (updateData: UpdateUserProfileDto) => {
      if (!token) throw new Error('No token available');

      const formattedData = {
        userId: Number(updateData.userId),
        username: updateData.username,
        bio: updateData.bio || '',
        profile_picture_url: updateData.profile_picture_url,
        country_id: Number(updateData.country_id),
        terms_agreed: updateData.terms_agreed,
        privacy_agreed: updateData.privacy_agreed,
        marketing_agreed: updateData.marketing_agreed,
      };

      return updateUserProfileApi(token, formattedData);
    },

    onMutate: async (newData: any) => {
      const previousData = queryClient.getQueryData(['userInfo']);

      const optimisticUpdate: any = {
        ...currentUserInfo,
        username: newData.username,
        bio: newData.bio,
        profile_picture_url: newData.profile_picture_url,
        country_id: Number(newData.country_id),
      };

      setUserInfo(optimisticUpdate);
      queryClient.setQueryData(['userInfo'], optimisticUpdate);

      return { previousData };
    },

    onSuccess: (response) => {
      setUserInfo(response);
      queryClient.setQueryData(['userInfo'], response);
    },

    onError: (error, _, context: any) => {
      if (context?.previousData) {
        setUserInfo(context.previousData);
        queryClient.setQueryData(['userInfo'], context.previousData);
      }
      throw error;
    },
  });
};
