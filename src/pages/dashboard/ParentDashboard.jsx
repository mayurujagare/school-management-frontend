import { useEffect, useState } from 'react';
import { studentApi } from '@/api/student.api';
import { announcementApi } from '@/api/announcement.api';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { GraduationCap, Megaphone } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [parentData, setParentData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      studentApi.myChildren(),
      announcementApi.parentFeed({ page: 0, size: 5 }),
    ]).then(([childrenRes, announcementsRes]) => {
      if (childrenRes.status === 'fulfilled') setParentData(childrenRes.value.data.data);
      if (announcementsRes.status === 'fulfilled') setAnnouncements(announcementsRes.value.data.data.content || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.firstName}!`} description="Parent Dashboard" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">My Children</h3>
          </div>
          {parentData?.linkedStudents?.length > 0 ? (
            <div className="space-y-3">
              {parentData.linkedStudents.map((child) => (
                <div key={child.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{child.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {child.gradeName} - Section {child.sectionName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Admission: {child.admissionNo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No children linked to your account.</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Recent Announcements</h3>
          </div>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="border-l-4 border-primary pl-3 py-2">
                  <div className="font-medium text-sm">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(a.publishedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No announcements yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}