import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { useCreateNotebook, useGetNotebooks, useToggleNotebookFavorite } from '@/hooks';
import type { Notebook } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';

const favoritesParam = 'favoritos';

function notesLabel(count: number) {
  return count === 1 ? '1 nota' : `${count} notas`;
}

export function NotebooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const favoritesOnly = searchParams.get(favoritesParam) === '1';
  const notebooks = useGetNotebooks(favoritesOnly);
  const create = useCreateNotebook();
  const toggleFavorite = useToggleNotebookFavorite();
  const [title, setTitle] = useState('');
  const trimmedTitle = title.trim();

  function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!trimmedTitle) return;
    create.reset();
    create.mutate({ title: trimmedTitle }, { onSuccess: () => setTitle('') });
  }

  function onToggleFavorite(notebook: Notebook) {
    toggleFavorite.reset();
    toggleFavorite.mutate({ id: notebook.id, isFavorite: !notebook.isFavorite });
  }

  function onToggleFilter() {
    const next = new URLSearchParams(searchParams);
    if (favoritesOnly) {
      next.delete(favoritesParam);
    } else {
      next.set(favoritesParam, '1');
    }
    setSearchParams(next);
  }

  function renderList() {
    if (notebooks.isPending) return <Spinner label="Carregando cadernos…" />;
    if (notebooks.isError) {
      return <ErrorState message={notebooks.error.message} onRetry={() => notebooks.refetch()} />;
    }
    if (notebooks.data.length === 0) {
      return favoritesOnly ? (
        <EmptyState
          title="Nenhum caderno favorito"
          description="Favorite um caderno ou desligue o filtro para ver todos."
        />
      ) : (
        <EmptyState
          title="Nenhum caderno ainda"
          description="Crie o primeiro caderno no campo acima."
        />
      );
    }
    return (
      <ul className="grid gap-3 sm:grid-cols-2">
        {notebooks.data.map((notebook) => {
          const isSaving =
            toggleFavorite.isPending && toggleFavorite.variables?.id === notebook.id;
          return (
            <li
              key={notebook.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 p-4 dark:border-stone-800"
            >
              <Link to={routes.notebook(notebook.id)} className="min-w-0 flex-1">
                <h2 className="truncate font-medium">{notebook.title}</h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {notesLabel(notebook.notesCount)}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => onToggleFavorite(notebook)}
                disabled={toggleFavorite.isPending}
                aria-pressed={notebook.isFavorite}
                className="shrink-0 rounded-md border border-stone-300 px-2 py-1 text-sm disabled:opacity-60 dark:border-stone-700"
              >
                {isSaving ? 'Salvando…' : notebook.isFavorite ? '★ Favorito' : '☆ Favoritar'}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Cadernos</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={favoritesOnly} onChange={onToggleFilter} />
          Só favoritos
        </label>
      </div>

      <form className="mt-6 flex gap-2" onSubmit={onCreate}>
        <label className="sr-only" htmlFor="notebook-title">
          Título do caderno
        </label>
        <input
          id="notebook-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Novo caderno"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
        />
        <button
          type="submit"
          disabled={create.isPending || !trimmedTitle}
          className="shrink-0 rounded-md bg-stone-900 px-3 py-2 text-sm text-white disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900"
        >
          {create.isPending ? 'Salvando…' : 'Criar'}
        </button>
      </form>
      {create.isError && <p className="mt-2 text-sm text-red-700">{create.error.message}</p>}
      {toggleFavorite.isError && (
        <p className="mt-2 text-sm text-red-700">{toggleFavorite.error.message}</p>
      )}

      <div className="mt-6">{renderList()}</div>
    </section>
  );
}
