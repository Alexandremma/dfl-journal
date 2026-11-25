import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getNotebooks } from '@/services';
import { useSession } from './useSession';

export function useGetNotebooks(favoritesOnly: boolean) {
  const { session } = useSession();
  return useQuery({
    queryKey: queryKeys.notebooks.list(favoritesOnly),
    queryFn: () => getNotebooks({ favoritesOnly }),
    enabled: Boolean(session),
  });
}
