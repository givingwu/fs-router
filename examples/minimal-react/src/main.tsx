import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

const router = createBrowserRouter(routes.map(route => ({ ...route, hydrateFallbackElement: <p role="status">Loading route data…</p> })));
createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
