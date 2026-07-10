import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';
import { ToastProvider } from 'services/toastService';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ToastProvider>
        <NavigationScroll>
          <RouterProvider router={router} />
        </NavigationScroll>
      </ToastProvider>
    </ThemeCustomization>
  );
}
