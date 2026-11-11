import { EmptyState } from '@/components/ui/EmptyState';

export function NotebooksPage() {
  return (
    <section>
      <h1 className="text-xl font-semibold">Cadernos</h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        A lista ainda é uma casca. Criar, renomear, apagar, favoritar e filtrar só favoritos entra com o
        service e os hooks.
      </p>
      <div className="mt-6">
        <EmptyState
          title="Nenhum caderno ainda"
          description="Quando a lista ler o Supabase, um caderno criado aparece aqui."
        />
      </div>
    </section>
  );
}
