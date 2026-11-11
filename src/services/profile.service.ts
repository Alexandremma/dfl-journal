import { getSupabase } from '@/lib/supabase';
import type { Profile, Theme } from '@/types';
import { currentUserId } from './current-user';

type ProfileRow = {
  id: string;
  name: string;
  theme: string;
};

export function toProfile(row: ProfileRow): Profile {
  if (row.theme !== 'light' && row.theme !== 'dark') {
    throw new Error(`Tema inválido: ${row.theme}`);
  }
  return {
    id: row.id,
    name: row.name,
    theme: row.theme,
  };
}

export async function getProfile(): Promise<Profile> {
  const userId = await currentUserId();
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, name, theme')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Perfil não encontrado. Confira se o SQL do schema já rodou.');
  }
  return toProfile(data);
}

export async function updateProfile(input: { name: string; theme: Theme }): Promise<Profile> {
  const name = input.name.trim();
  if (!name) {
    throw new Error('Informe o nome.');
  }
  const userId = await currentUserId();
  const { data, error } = await getSupabase()
    .from('profiles')
    .update({ name, theme: input.theme })
    .eq('id', userId)
    .select('id, name, theme')
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return toProfile(data);
}
