import { useMutation } from '@tanstack/react-query';

import { deactivateUserApi } from '~/services/authService';

export const useDeactivateUser = () => {
  //console.log('useDeactivateUser2');

  return useMutation({
    mutationFn: async ({ userId, password }: { userId: number; password: string }) => {
      //console.log('useDeactivateUser3', userId, password);
      return await deactivateUserApi(userId, password);
    },
  });
};
