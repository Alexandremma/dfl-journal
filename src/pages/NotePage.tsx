import { Link, useParams } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotePage() {
  const { notebookId, noteId } = useParams();

  return (
    <section>
      <Link
        to={notebookId ? routes.notebook(notebookId) : routes.home}
        className="text-sm text-stone-500 dark:text-stone-400"
      >
        Voltar
      </Link>
      <h1 className="mt-3 text-xl font-semibold">Nota</h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Identificador: {noteId}</p>
      <div className="mt-6">
        <EmptyState
          title="Nenhuma tarefa ainda"
          description="Criar uma tarefa e marcar como feita entra aqui, quando o service e os hooks estiverem ligados."
        />
      </div>
    </section>
  );
}
