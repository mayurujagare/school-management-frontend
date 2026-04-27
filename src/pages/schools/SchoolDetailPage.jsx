import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { schoolApi } from '@/api/school.api';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SchoolDetailPage() {
  const { schoolId } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getSchoolById(schoolId)
      .then((res) => setSchool(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [schoolId]);

  const toggleStatus = async () => {
    try {
      const res = await schoolApi.toggleStatus(schoolId);
      setSchool(res.data.data);
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!school) return <div>School not found</div>;

  return (
    <div>
      <PageHeader
        title={school.name}
        action={
          <Button variant={school.isActive ? 'destructive' : 'default'} onClick={toggleStatus}>
            {school.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        }
      />
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div><span className="text-muted-foreground text-sm">Status</span><div><StatusBadge status={school.isActive ? 'ACTIVE' : 'INACTIVE'} /></div></div>
          <div><span className="text-muted-foreground text-sm">Plan</span><div className="font-medium">{school.subscriptionPlan}</div></div>
          <div><span className="text-muted-foreground text-sm">City</span><div className="font-medium">{school.city || '-'}</div></div>
          <div><span className="text-muted-foreground text-sm">State</span><div className="font-medium">{school.state || '-'}</div></div>
          <div><span className="text-muted-foreground text-sm">Phone</span><div className="font-medium">{school.phone || '-'}</div></div>
          <div><span className="text-muted-foreground text-sm">Email</span><div className="font-medium">{school.email || '-'}</div></div>
          <div><span className="text-muted-foreground text-sm">Subscription Start</span><div className="font-medium">{formatDate(school.subscriptionStart)}</div></div>
          <div><span className="text-muted-foreground text-sm">Subscription Expiry</span><div className="font-medium">{formatDate(school.subscriptionExpiry)}</div></div>
        </div>
      </Card>
    </div>
  );
}