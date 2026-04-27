import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schoolApi } from '@/api/school.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SchoolListPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    loadSchools();
  }, [debouncedSearch, page]);

  const loadSchools = async () => {
    setLoading(true);
    try {
      const res = await schoolApi.listSchools({
        search: debouncedSearch || undefined,
        page,
        size: 20,
      });
      setSchools(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'School Name', accessorKey: 'name' },
    { header: 'City', accessorKey: 'city' },
    { header: 'Plan', accessorKey: 'subscriptionPlan' },
    {
      header: 'Expiry',
      accessorKey: 'subscriptionExpiry',
      cell: ({ row }) => formatDate(row.original.subscriptionExpiry),
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.isActive ? 'ACTIVE' : 'INACTIVE'} />
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/schools/${row.original.id}`)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Schools"
        description="All schools on the platform"
        action={
          <Button onClick={() => navigate('/schools/create')}>
            <Plus className="h-4 w-4 mr-2" /> Onboard School
          </Button>
        }
      />
      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search schools..." />
      </div>
      <DataTable columns={columns} data={schools} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}