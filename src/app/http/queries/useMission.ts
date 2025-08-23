import { missionRequest } from '@/app/http/requests/mission';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetMission = () => {
  return useQuery({
    queryKey: ['get-mission'],
    queryFn: async () => await missionRequest.getTasks(),
    refetchOnWindowFocus: true,
  });
};

export const useUpdateMission = () => {
  return useMutation({

    mutationFn: async (query: 'shareLink' | 'joinGroup' | 'readTerms') =>
      missionRequest.updateTasks(query),

  });
};
