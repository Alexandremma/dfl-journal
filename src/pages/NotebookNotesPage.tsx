import { Link, useParams } from 'react-router-dom';
import { pageSize } from '@/consts/pagination';
import { routes } from '@/consts/routes';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotebookNotesPage() {
  const { notebookId } = useParams();

  return (
    <section>
      <Link to={routes.home} className="text-sm text-stone-500 dark:text-stone-400">
        Voltar
      </Link>
      <h1 className="mt-3 text-xl font-semibold">Notas</h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Caderno: {notebookId}</p>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        A lista ainda é uma casca. A página pronta mostra {pageSize} notas por vez, com busca por título.
      </p>
      <div className="mt-6">
        <EmptyState
          title="Nenhuma nota ainda"
          description="Quando a lista ler o Supabase, as notas deste caderno aparecem aqui."
        />
      </div>
    </section>
  );
}
