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
import toast from 'react-hot-toast';

export default function GradeListPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', displayOrder: '' });
  const { execute, loading: saving } = useApi();

  useEffect(() => { loadGrades(); }, []);

  const loadGrades = async () => {
    setLoading(true);
    try {
      const res = await academicApi.listGrades({ includeInactive: true });
      setGrades(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    await execute(
      () => academicApi.createGrade({
        name: form.name,
        displayOrder: parseInt(form.displayOrder),
      }),
      {
        successMessage: 'Grade created',
        onSuccess: () => { setShowModal(false); setForm({ name: '', displayOrder: '' }); loadGrades(); },
      }
    );
  };

  const columns = [
    { header: 'Order', accessorKey: 'displayOrder' },
    { header: 'Grade Name', accessorKey: 'name' },
    { header: 'Status', cell: ({ row }) => row.original.isActive ? 'Active' : 'Inactive' },
  ];

  return (
    <div>
      <PageHeader title="Grades" action={
        <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Grade</Button>
      } />
      <DataTable columns={columns} data={grades} loading={loading} />

      <FormModal open={showModal} onClose={() => setShowModal(false)} title="Add Grade">
        <div className="space-y-4">
          <div>
            <Label>Grade Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grade 1" className="mt-1" />
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} placeholder="1" className="mt-1" />
          </div>
          <Button onClick={handleCreate} disabled={saving} className="w-full">
            {saving ? 'Creating...' : 'Create Grade'}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}