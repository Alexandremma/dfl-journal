import { Navigate, Route, Routes } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { LoginPage } from '@/pages/LoginPage';
import { NotePage } from '@/pages/NotePage';
import { NotebookNotesPage } from '@/pages/NotebookNotesPage';
import { NotebooksPage } from '@/pages/NotebooksPage';
import { SettingsPage } from '@/pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={routes.login} element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path={routes.home} element={<NotebooksPage />} />
          <Route path={routes.notebookDetail} element={<NotebookNotesPage />} />
          <Route path={routes.noteDetail} element={<NotePage />} />
          <Route path={routes.settings} element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={routes.home} replace />} />
    </Routes>
  );
}
