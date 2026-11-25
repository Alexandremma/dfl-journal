import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { updateNotebook } from '@/services';

export function useUpdateNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; title: string }) => updateNotebook(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notebooks.all });
    },
  });
}
