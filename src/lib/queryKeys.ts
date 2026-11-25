export const queryKeys = {
  profile: {
    current: ['profile', 'current'] as const,
  },
  notebooks: {
    all: ['notebooks'] as const,
    list: (favoritesOnly: boolean) => ['notebooks', { favoritesOnly }] as const,
  },
} as const;
