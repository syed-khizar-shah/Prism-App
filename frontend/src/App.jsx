import './App.css'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import ColorPage from './pages/Colors/ColorPage';
import CoatingPage from './pages/Coatings/CoatingPage';
import Dashboard from './pages/Dashboard';
import AgeGroupPage from './pages/AgeGroups/AgeGroupPage';
import ExtrasList from './pages/Extras/ExtrasList';
import ExtrasForm from './pages/Extras/ExtrasForm';
import RecommendedLensList from './pages/RecommendedLens/RecommendedLensList';
import RecommendedLensForm from './pages/RecommendedLens/RecommendedLensForm';
import LensList from './pages/Lens/LensList';
import LensForm from './pages/Lens/LensForm';
import DesignsList from './pages/Designs/DesignsList';
import DesignForm from './pages/Designs/DesignsForm';
import Guide from './pages/Guide';
// import LensConfigurator from './LensConfigurator/components/LensConfigurator';
import LensConfigurator from './Configurator/LensConfigurator';
import LensConfig from './TestConfig/LensConfig';
import FrameSummaryManager from './pages/FrameSummary/FrameSummaryManager';
import PromoManagement from './pages/Promos/PromoManagement';
import Navbar from './components/Navbar';
import { OrdersList, OrderDetail } from './pages/Orders';
import ProtectedRoute from './components/auth/protected-route';
import { AuthProvider } from '../context/AuthContext';
import GuestRoute from './components/auth/guest-route';

import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import ErrorPage from "./pages/error-page"
import SightTestPage from './pages/SightTest/SightTestPage';



const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Navbar currentPath={location.pathname} />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/promo-manager',
        element: (
          <ProtectedRoute>
            <PromoManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/frame-summary-manager',
        element: (
          <ProtectedRoute>
            <FrameSummaryManager />
          </ProtectedRoute>

        ),
      },
      {
        path: '/guide',
        element: (
          <ProtectedRoute>
            <Guide />
          </ProtectedRoute>

        ),
      },
      {
        path: '/test-flow',
        element: (
          <ProtectedRoute>
            <LensConfig />
          </ProtectedRoute>
        ),
      },
      {
        path: '/flow',
        element: (
          <ProtectedRoute>
            <LensConfigurator />
          </ProtectedRoute>
        ),
      },
      {
        path: '/colors',
        element: (
          <ProtectedRoute>
            <ColorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coatings',
        element: (
          <ProtectedRoute>
            <CoatingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/extras',
        element: (
          <ProtectedRoute>
            <ExtrasList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/extras/edit/:id',
        element: (
          <ProtectedRoute>
            <ExtrasForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/extras/create',
        element: (
          <ProtectedRoute>
            <ExtrasForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/recommended-lenses',
        element: (
          <ProtectedRoute>
            <RecommendedLensList />
          </ProtectedRoute>

        ),
      },
      {
        path: '/recommended-lenses/edit/:id',
        element: (
          <ProtectedRoute>
            <RecommendedLensForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/recommended-lenses/create',
        element: (
          <ProtectedRoute>
            <RecommendedLensForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/lenses',
        element: (
          <ProtectedRoute>
            <LensList />
          </ProtectedRoute>

        ),
      },
      {
        path: '/lenses/edit/:id',
        element: (
          <ProtectedRoute>
            <LensForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/lenses/create',
        element: (
          <ProtectedRoute>
            <LensForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/designs',
        element: (
          <ProtectedRoute>
            <DesignsList />
          </ProtectedRoute>

        ),
      },
      {
        path: '/designs/edit/:id',
        element: (
          <ProtectedRoute>
            <DesignForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/designs/create',
        element: (
          <ProtectedRoute>
            <DesignForm />
          </ProtectedRoute>

        ),
      },
      {
        path: '/age-groups',
        element: (
          <ProtectedRoute>
            <AgeGroupPage />
          </ProtectedRoute>

        )
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute>
            <OrdersList />
          </ProtectedRoute>

        )
      },
      {
        path: '/orders/:id',
        element: (
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>

        )
      },
      {
        path: '/sight-tests',
        element: (
          <ProtectedRoute>
            <SightTestPage />
          </ProtectedRoute>

        )
      },
    ],
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  // {
  //   path: '/register',
  //   element: (
  //     <GuestRoute>
  //       <Register />
  //     </GuestRoute>
  //   ),
  // },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
