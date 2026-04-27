import { Badge } from '@/components/ui/badge';

const variants = {
  PRESENT:  'bg-green-100 text-green-800 hover:bg-green-100',
  ABSENT:   'bg-red-100 text-red-800 hover:bg-red-100',
  LATE:     'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  LEAVE:    'bg-blue-100 text-blue-800 hover:bg-blue-100',
  HOLIDAY:  'bg-gray-100 text-gray-800 hover:bg-gray-100',
  PENDING:  'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  PARTIAL:  'bg-orange-100 text-orange-800 hover:bg-orange-100',
  PAID:     'bg-green-100 text-green-800 hover:bg-green-100',
  WAIVED:   'bg-gray-100 text-gray-800 hover:bg-gray-100',
  ACTIVE:   'bg-green-100 text-green-800 hover:bg-green-100',
  INACTIVE: 'bg-red-100 text-red-800 hover:bg-red-100',
  DRAFT:    'bg-gray-100 text-gray-800 hover:bg-gray-100',
  PUBLISHED:'bg-blue-100 text-blue-800 hover:bg-blue-100',
};

export default function StatusBadge({ status }) {
  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'} variant="outline">
      {status}
    </Badge>
  );
}