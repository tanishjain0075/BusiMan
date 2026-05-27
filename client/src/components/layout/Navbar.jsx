import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const titleMap = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory',
  '/clients': 'Clients',
  '/vendors': 'Vendors',
  '/billing': 'Billing',
  '/billing/create': 'Create Invoice',
  '/reports': 'Reports',
};

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const title = Object.entries(titleMap).find(([path]) =>
    pathname === path || pathname.startsWith(path + '/')
  )?.[1] || 'BusiMan';

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-20">
      <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-200">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
