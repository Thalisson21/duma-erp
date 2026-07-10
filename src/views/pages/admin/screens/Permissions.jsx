import { getProfiles } from 'api/admin';
import AdminResourcePage from '../components/AdminResourcePage';

const columns = [
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Nome' },
  { field: 'permissions.length', label: 'Permissões' }
];

export default function PermissionsScreen() {
  return <AdminResourcePage title="Permissões" description="Controle permissões e escopos de acesso do sistema." columns={columns} getData={getProfiles} paginated={false} />;
}
