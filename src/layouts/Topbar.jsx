import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { LogOut } from 'lucide-react';
import { getInitials } from '../lib/utils';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            {getInitials(`${user?.firstName} ${user?.lastName}`)}
          </div>
          <span className="text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}