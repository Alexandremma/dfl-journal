import { getSupabase } from '@/lib/supabase';
import type { Notebook } from '@/types';
import { currentUserId } from './current-user';

type NotebookRow = {
  id: string;
  title: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  notes: { count: number }[];
};

const notebookColumns = 'id, title, is_favorite, created_at, updated_at, notes(count)';

export function toNotebook(row: NotebookRow): Notebook {
  return {
    id: row.id,
    title: row.title,
    isFavorite: row.is_favorite,
    notesCount: row.notes[0]?.count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getNotebooks(input: { favoritesOnly: boolean }): Promise<Notebook[]> {
  let query = getSupabase()
    .from('notebooks')
    .select(notebookColumns)
    .order('updated_at', { ascending: false });

  if (input.favoritesOnly) {
    query = query.eq('is_favorite', true);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data.map(toNotebook);
}

export async function createNotebook(input: { title: string }): Promise<Notebook> {
  const title = input.title.trim();
  if (!title) {
    throw new Error('Informe o título do caderno.');
  }
  const userId = await currentUserId();
  const { data, error } = await getSupabase()
    .from('notebooks')
    .insert({ title, user_id: userId })
    .select(notebookColumns)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return toNotebook(data);
}

export async function setNotebookFavorite(input: {
  id: string;
  isFavorite: boolean;
}): Promise<Notebook> {
  const { data, error } = await getSupabase()
    .from('notebooks')
    .update({ is_favorite: input.isFavorite })
    .eq('id', input.id)
    .select(notebookColumns)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return toNotebook(data);
}

export async function updateNotebook(input: { id: string; title: string }): Promise<Notebook> {
  const title = input.title.trim();
  if (!title) {
    throw new Error('Informe o título do caderno.');
  }
  const { data, error } = await getSupabase()
    .from('notebooks')
    .update({ title })
    .eq('id', input.id)
    .select(notebookColumns)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return toNotebook(data);
}

export async function deleteNotebook(input: { id: string }): Promise<void> {
  const { error } = await getSupabase().from('notebooks').delete().eq('id', input.id);

  if (error) {
    throw new Error(error.message);
  }
}
