import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import MainCard from 'ui-component/cards/MainCard';
import ActivitiesScreen from './screens/Activities';
import BrokerTypesScreen from './screens/BrokerTypes';
import ComissionTypesScreen from './screens/ComissionTypes';
import PermissionsScreen from './screens/Permissions';
import TransactionsScreen from './screens/Transactions';
import UsersScreen from './screens/Users';
import SupervisorsScreen from './screens/Supervisors';

const adminTabs = [
  { label: 'Usuários', component: <UsersScreen /> },
  { label: 'Tipo de Corretor', component: <BrokerTypesScreen /> },
  { label: 'Grade de comissão', component: <ComissionTypesScreen /> },
  { label: 'Transações', component: <TransactionsScreen /> },
  { label: 'Atividades', component: <ActivitiesScreen /> },
  { label: 'Permissões', component: <PermissionsScreen /> },
  { label: 'Supervisores', component: <SupervisorsScreen /> }
];

export default function AdminPage() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const activeTab = adminTabs[currentTab];

  return (
    <MainCard title="Administração">
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Tabs
          value={currentTab}
          onChange={(event, value) => setCurrentTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Abas administrativas"
        >
          {adminTabs.map((tab) => (
            <Tab key={tab.label} label={tab.label} />
          ))}
        </Tabs>

        <Divider />

        <Box sx={{ p: 3, minHeight: 360 }}>{activeTab.component}</Box>
      </Paper>
    </MainCard>
  );
}
