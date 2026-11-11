export const routes = {
  login: '/login',
  home: '/',
  settings: '/settings',
  notebookDetail: '/notebooks/:notebookId',
  notebook: (notebookId: string) => `/notebooks/${notebookId}`,
  noteDetail: '/notebooks/:notebookId/notes/:noteId',
  note: (notebookId: string, noteId: string) => `/notebooks/${notebookId}/notes/${noteId}`,
} as const;
