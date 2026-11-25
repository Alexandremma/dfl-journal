import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { setNotebookFavorite } from '@/services';

export function useToggleNotebookFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; isFavorite: boolean }) => setNotebookFavorite(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notebooks.all });
    },
  });
}
