// assets
import { IconBuildingStore, IconFileText, IconForms, IconLayoutSidebar, IconUserDollar, IconUsersGroup } from '@tabler/icons-react';

// constant
const icons = {
  IconBuildingStore,
  IconFileText,
  IconForms,
  IconLayoutSidebar,
  IconUserDollar,
  IconUsersGroup
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Cadastros',
  caption: 'Cadastros Operacionais',
  icon: icons.IconLayoutSidebar,
  type: 'group',
  children: [
    {
      id: 'registers',
      title: 'Operações Cadastrais',
      type: 'collapse',
      icon: icons.IconForms,
      children: [
        {
          id: 'clients',
          title: 'Clientes',
          type: 'item',
          icon: icons.IconUsersGroup,
          url: '/pages/register/clients'
        },
          {
          id: 'brokers',
          title: 'Corretores',
          type: 'item',
          icon: icons.IconUserDollar,
          url: '/pages/register/brokers'
        },
          {
          id: 'operators',
          title: 'Operadoras',
          type: 'item',
          icon: icons.IconBuildingStore,
          url: '/pages/register/operators'
        },
          {
          id: 'proposals',
          title: 'Propostas',
          type: 'item',
          icon: icons.IconFileText,
          url: '/pages/register/proposals'
        },
      ]
    }
  ]
};

export default pages;
