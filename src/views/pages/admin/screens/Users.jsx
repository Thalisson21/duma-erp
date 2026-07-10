import { getAdminUsers } from 'api/admin';
import AdminResourcePage from '../components/AdminResourcePage';

const columns = [
  { field: 'name', label: 'Nome' },
  { field: 'email', label: 'E-mail' },
  { field: 'role.role', label: 'Perfil' },
  { field: 'is_active', label: 'Ativo' }
];

export default function UsersScreen() {
  return <AdminResourcePage title="Usuários" description="Gerencie usuários, acessos e vínculos operacionais." columns={columns} getData={getAdminUsers} />;
}
