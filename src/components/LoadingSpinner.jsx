import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LoadingSpinner({ fullScreen = false, className }) {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}