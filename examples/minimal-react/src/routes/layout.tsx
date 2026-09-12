import { Link, Outlet, useNavigation } from 'react-router-dom';

export default function Layout() {
  const navigation = useNavigation();
  return (
    <main>
      <nav aria-label="Main"><Link to="/">Home</Link></nav>
      {navigation.state !== 'idle' && <p role="status">Loading route data…</p>}
      <Outlet />
    </main>
  );
}
