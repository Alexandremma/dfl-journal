import { getSupabase } from '@/lib/supabase';

// Um só lugar. Os services de caderno, nota e tarefa importam daqui
// e mandam user_id no insert. A página não envia esse id.
export async function currentUserId(): Promise<string> {
  const { data, error } = await getSupabase().auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error('Sessão ausente.');
  }
  return data.user.id;
}
