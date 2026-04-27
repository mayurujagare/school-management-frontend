import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../lib/constants';
import {
  LayoutDashboard, School, GraduationCap, Users, UserCheck,
  CalendarCheck, IndianRupee, ClipboardList, Megaphone, Settings,
  BookOpen, Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { label: 'Dashboard',     to: '/dashboard',      icon: LayoutDashboard, roles: 'all' },
  { label: 'Schools',       to: '/schools',         icon: School,          roles: [ROLES.SUPER_ADMIN] },
  { label: 'Academic',      to: '/academic',        icon: BookOpen,        roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL] },
  { label: 'Students',      to: '/students',        icon: GraduationCap,   roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLERK] },
  { label: 'Staff',         to: '/staff',           icon: Users,           roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL] },
  { label: 'Attendance',    to: '/attendance',       icon: CalendarCheck,   roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLERK] },
  { label: 'Fees',          to: '/fees',            icon: IndianRupee,     roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK] },
  { label: 'Exams',         to: '/exams',           icon: ClipboardList,   roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER] },
  { label: 'Announcements', to: '/announcements',   icon: Megaphone,       roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER] },
  { label: 'My Children',   to: '/my-children',     icon: UserCheck,       roles: [ROLES.PARENT] },
  { label: 'Settings',      to: '/settings',        icon: Settings,        roles: [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL] },
];

export default function Sidebar() {
  const { hasRole, user } = useAuth();

  const visibleItems = navItems.filter((item) => {
    if (item.roles === 'all') return true;
    return hasRole(item.roles);
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <GraduationCap className="h-8 w-8 text-primary mr-2" />
        <span className="text-lg font-bold">SchoolMS</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-muted-foreground">
          Logged in as
        </div>
        <div className="text-sm font-medium truncate">
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {user?.roles?.[0]}
        </div>
      </div>
    </aside>
  );
}