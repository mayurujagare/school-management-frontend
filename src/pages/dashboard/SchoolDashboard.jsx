import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { schoolApi } from '../../api/school.api';
import { studentApi } from '../../api/student.api';
import { feeApi } from '../../api/fee.api';
import { announcementApi } from '../../api/announcement.api';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { GraduationCap, Users, IndianRupee, Megaphone, AlertTriangle } from 'lucide-react';

export default function SchoolDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [schoolRes, overdueRes, announcementRes] = await Promise.allSettled([
        schoolApi.getMySchool(),
        feeApi.getOverdue(),
        announcementApi.getStats(),
      ]);

      setStats({
        schoolName: schoolRes.status === 'fulfilled' ? schoolRes.value.data.data.name : '',
        overdueCount: overdueRes.status === 'fulfilled' ? overdueRes.value.data.data.length : 0,
        announcements: announcementRes.status === 'fulfilled' ? announcementRes.value.data.data : {},
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName}!`}
        description={stats.schoolName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overdue Fees"
          value={stats.overdueCount}
          icon={AlertTriangle}
          description="Students with pending fees"
        />
        <StatCard
          title="Announcements"
          value={stats.announcements?.published || 0}
          icon={Megaphone}
          description={`${stats.announcements?.drafts || 0} drafts`}
        />
      </div>
    </div>
  );
}