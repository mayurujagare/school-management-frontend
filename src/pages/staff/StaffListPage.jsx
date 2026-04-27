import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffApi } from '@/api/staff.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';

export default function StaffListPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { loadStaff(); }, [debouncedSearch, page]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await staffApi.search({ search: debouncedSearch || undefined, page, size: 20 });
      setStaff(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const columns = [
    { header: 'Employee Code', accessorKey: 'employeeCode' },
    { header: 'Name', accessorKey: 'fullName' },
    { header: 'Role', cell: ({ row }) => row.original.roles?.join(', ') },
    { header: 'Designation', accessorKey: 'designation', cell: ({ row }) => row.original.designation || '-' },
    { header: 'Department', accessorKey: 'department', cell: ({ row }) => row.original.department || '-' },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/staff/${row.original.id}`)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Staff" action={
        <Button onClick={() => navigate('/staff/create')}><Plus className="h-4 w-4 mr-2" /> Add Staff</Button>
      } />
      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search staff..." />
      </div>
      <DataTable columns={columns} data={staff} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}