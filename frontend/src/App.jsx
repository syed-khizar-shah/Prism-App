import { useState } from 'react'
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
          <Dashboard />
        ),
      },
      {
        path: '/promo-manager',
        element: (
          <PromoManagement />
        ),
      },
      {
        path: '/frame-summary-manager',
        element: (
          <FrameSummaryManager />
        ),
      },
      {
        path: '/guide',
        element: (
          <Guide />
        ),
      },
      {
        path: '/test-flow',
        element: (
          <LensConfig />
        ),
      },
      {
        path: '/flow',
        element: (
          <LensConfigurator />
        ),
      },
      {
        path: '/colors',
        element: (
          <ColorPage />
        ),
      },
      {
        path: '/coatings',
        element: (
          <CoatingPage />
        ),
      },
      {
        path: '/extras',
        element: (
          <ExtrasList />
        ),
      },
      {
        path: '/extras/edit/:id',
        element: (
          <ExtrasForm />
        ),
      },
      {
        path: '/extras/create',
        element: (
          <ExtrasForm />
        ),
      },
      {
        path: '/recommended-lenses',
        element: (
          <RecommendedLensList />
        ),
      },
      {
        path: '/recommended-lenses/edit/:id',
        element: (
          <RecommendedLensForm />
        ),
      },
      {
        path: '/recommended-lenses/create',
        element: (
          <RecommendedLensForm />
        ),
      },
      {
        path: '/lenses',
        element: (
          <LensList />
        ),
      },
      {
        path: '/lenses/edit/:id',
        element: (
          <LensForm />
        ),
      },
      {
        path: '/lenses/create',
        element: (
          <LensForm />
        ),
      },
            {
        path: '/designs',
        element: (
          <DesignsList />
        ),
      },
      {
        path: '/designs/edit/:id',
        element: (
          <DesignForm />
        ),
      },
      {
        path: '/designs/create',
        element: (
          <DesignForm />
        ),
      },
      {
        path: '/age-groups',
        element: (
          <AgeGroupPage />
        )
      },
      {
        path: '/orders',
        element: (
          <OrdersList />
        )
      },
      {
        path: '/orders/:id',
        element: (
          <OrderDetail />
        )
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
