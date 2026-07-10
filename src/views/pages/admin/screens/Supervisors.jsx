import { getAdminSupervisors } from 'api/admin';
import AdminResourcePage from '../components/AdminResourcePage';

const columns = [
  { field: 'name', label: 'Nome' },
  { field: 'cpf', label: 'CPF' },
];

export default function SupervisorsScreen() {
  return <AdminResourcePage title="Supervisores" description="Gerencie supervisores, e suas comissões." columns={columns} getData={getAdminSupervisors} />;
}
