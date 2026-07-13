import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import ErrorBoundary from './ErrorBoundary';
import MainRoutes from './MainRoutes';
import ProtectedRoute from './ProtectedRoute';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      element: <ProtectedRoute />,
      errorElement: <ErrorBoundary />,
      children: [MainRoutes]
    },
    {
      ...AuthenticationRoutes,
      errorElement: <ErrorBoundary />
    }
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
