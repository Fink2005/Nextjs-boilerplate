import { goldMiningRequest } from '@/app/http/requests/goldMining';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useGetRestTime = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['get-rest-time'],
    queryFn: () => goldMiningRequest.GoldMiningRestTimes(),
  });

  // If restTimes === 0, invalidate immediately
  useEffect(() => {
    if (query.data?.restTimes === 0) {
      queryClient.invalidateQueries({ queryKey: ['get-rest-time'] });
    }
  }, [query.data?.restTimes, queryClient]);

  return query;
};
