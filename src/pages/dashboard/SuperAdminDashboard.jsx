import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schoolApi } from '@/api/school.api';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { School, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getPlatformStats()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        description="Manage all schools on the platform"
        action={
          <Button onClick={() => navigate('/schools/create')}>
            <Plus className="h-4 w-4 mr-2" /> Onboard School
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Schools" value={stats?.totalSchools || 0} icon={School} />
        <StatCard title="Active" value={stats?.activeSchools || 0} icon={CheckCircle} />
        <StatCard title="Inactive" value={stats?.inactiveSchools || 0} icon={XCircle} />
        <StatCard title="Expiring Soon" value={stats?.expiringThisMonth || 0} icon={Clock}
          description="Within 30 days" />
      </div>
    </div>
  );
}