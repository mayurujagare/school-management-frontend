import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementApi } from '@/api/announcement.api';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatDateTime, truncate } from '@/lib/utils';

export default function AnnouncementListPage() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { loadAnnouncements(); }, [page]);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementApi.listAll({ page, size: 20 });
      setAnnouncements(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const columns = [
    { header: 'Title', cell: ({ row }) => truncate(row.original.title, 40) },
    { header: 'Target', cell: ({ row }) => row.original.targetName || row.original.targetType },
    { header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.isDraft ? 'DRAFT' : 'PUBLISHED'} /> },
    { header: 'Published', cell: ({ row }) => row.original.publishedAt ? formatDateTime(row.original.publishedAt) : '-' },
    { header: 'Created By', cell: ({ row }) => row.original.createdByName || '-' },
  ];

  return (
    <div>
      <PageHeader title="Announcements" action={
        <Button onClick={() => navigate('/announcements/create')}><Plus className="h-4 w-4 mr-2" /> New Announcement</Button>
      } />
      <DataTable columns={columns} data={announcements} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}