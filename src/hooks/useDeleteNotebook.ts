import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { deleteNotebook } from '@/services';

export function useDeleteNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string }) => deleteNotebook(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notebooks.all });
    },
  });
}
