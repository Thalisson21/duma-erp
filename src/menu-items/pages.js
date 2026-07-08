// assets
import { IconKey, IconAddressBook, IconUsers } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconAddressBook,
  IconUsers
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Páginas',
  caption: 'Páginas Operacionais',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          url: '/pages/login',
          target: true
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          url: '/pages/register',
          target: true
        }
      ]
    },
    {
      id: 'registers',
      title: 'Cadastros',
      type: 'collapse',
      icon: icons.IconAddressBook,
      children: [
        {
          id: 'clients',
          title: 'Clientes',
          type: 'item',
          icon: icons.IconUsers,
          url: '/pages/register/clients'
        }
      ]
    }
  ]
};

export default pages;
