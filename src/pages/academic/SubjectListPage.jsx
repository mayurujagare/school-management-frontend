import { useEffect, useState } from 'react';
import { academicApi } from '@/api/academic.api';
import { useApi } from '@/hooks/useApi';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import FormModal from '@/components/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

export default function SubjectListPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });
  const { execute, loading: saving } = useApi();

  useEffect(() => { loadSubjects(); }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const res = await academicApi.listSubjects({ includeInactive: true });
      setSubjects(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    await execute(
      () => academicApi.createSubject({ name: form.name, code: form.code || undefined }),
      {
        successMessage: 'Subject created',
        onSuccess: () => { setShowModal(false); setForm({ name: '', code: '' }); loadSubjects(); },
      }
    );
  };

  const columns = [
    { header: 'Subject Name', accessorKey: 'name' },
    { header: 'Code', accessorKey: 'code', cell: ({ row }) => row.original.code || '-' },
    { header: 'Status', cell: ({ row }) => row.original.isActive ? 'Active' : 'Inactive' },
  ];

  return (
    <div>
      <PageHeader title="Subjects" action={
        <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Subject</Button>
      } />
      <DataTable columns={columns} data={subjects} loading={loading} />

      <FormModal open={showModal} onClose={() => setShowModal(false)} title="Add Subject">
        <div className="space-y-4">
          <div>
            <Label>Subject Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" className="mt-1" />
          </div>
          <div>
            <Label>Code (Optional)</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. MATH" className="mt-1" />
          </div>
          <Button onClick={handleCreate} disabled={saving} className="w-full">
            {saving ? 'Creating...' : 'Create Subject'}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}