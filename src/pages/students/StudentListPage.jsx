import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '@/api/student.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentListPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { loadStudents(); }, [debouncedSearch, page]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await studentApi.search({ search: debouncedSearch || undefined, page, size: 20 });
      setStudents(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const columns = [
    { header: 'Admission No', accessorKey: 'admissionNo' },
    { header: 'Name', cell: ({ row }) => row.original.fullName },
    { header: 'Grade', cell: ({ row }) => row.original.currentEnrollment?.gradeName || '-' },
    { header: 'Section', cell: ({ row }) => row.original.currentEnrollment?.sectionName || '-' },
    { header: 'Enrolled', cell: ({ row }) => formatDate(row.original.enrolledAt) },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${row.original.id}`)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Students" action={
        <Button onClick={() => navigate('/students/enroll')}><Plus className="h-4 w-4 mr-2" /> Enroll Student</Button>
      } />
      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or admission no..." />
      </div>
      <DataTable columns={columns} data={students} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}