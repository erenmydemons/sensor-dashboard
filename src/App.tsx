import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RouteCatchError from './components/CatchError/RouteCatchError';
import { ROUTER_PATHS } from './lib/constants/general';

const AdminLayout = lazy(() => import('./features/Admin/Layout'));
const BuilderFeature = lazy(() => import('./features/Admin/BuilderFeature'));
const Home = lazy(() => import('./features/Home/Home'));

const Fallback = () => <div>Page loading...</div>;

function App() {
  const router = createBrowserRouter([
    {
      path: ROUTER_PATHS.HOME,
      element: <Home />,
      errorElement: <RouteCatchError />,
    },
    {
      path: ROUTER_PATHS.ADMIN,
      element: <AdminLayout />,
      children: [
        {
          path: ROUTER_PATHS.BUILDER,
          element: <BuilderFeature />,
          errorElement: <RouteCatchError />,
        },
      ],
    },
  ]);

  return (
    <Suspense fallback={<Fallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
