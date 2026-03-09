import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { AgencySettingsPage } from './pages/app/AgencySettingsPage';
import { HomePage } from './pages/app/HomePage';
import { ProfilePage } from './pages/app/ProfilePage';
import { UserFormPage } from './pages/app/UserFormPage';
import { UsersListPage } from './pages/app/UsersListPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path='perfil' element={<ProfilePage />} />
        <Route
          path='configuracoes/agencia'
          element={
            <ProtectedRoute roles={['ADMIN', 'DIRETOR']}>
              <AgencySettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='configuracoes/usuarios'
          element={
            <ProtectedRoute roles={['ADMIN', 'DIRETOR']}>
              <UsersListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='configuracoes/usuarios/:id'
          element={
            <ProtectedRoute roles={['ADMIN', 'DIRETOR']}>
              <UserFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='configuracoes/usuarios/novo'
          element={
            <ProtectedRoute roles={['ADMIN', 'DIRETOR']}>
              <UserFormPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;


