import { NavLink, Outlet } from 'react-router-dom';
import { Home, Scissors, LayoutTemplate, FolderDown, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/clipper', label: 'Clipper', icon: Scissors },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/exports', label: 'Exports', icon: FolderDown },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Desktop: side rail. Mobile: bottom tab bar. */}
      <nav className="order-2 flex border-t border-line bg-panel safe-bottom md:order-1 md:w-52 md:flex-col md:border-r md:border-t-0 md:p-3 md:pt-6">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] md:flex-none md:flex-row md:justify-start md:gap-3 md:rounded-xl md:px-3 md:py-3 md:text-sm ${
                isActive ? 'text-amber md:bg-raise' : 'text-mute'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="order-1 min-w-0 flex-1 overflow-y-auto safe-top md:order-2">
        <Outlet />
      </main>
    </div>
  );
}
