import { useEffect, useState } from 'react';
import { feeApi } from '@/api/fee.api';
import { useApi } from '@/hooks/useApi';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import FormModal from '@/components/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function FeeStructurePage() {
  const [categories, setCategories] = useState([]);
  const [structures, setStructures] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const { execute } = useApi();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [catRes, strRes, disRes] = await Promise.all([
        feeApi.listCategories(),
        feeApi.listStructures(),
        feeApi.listDiscounts(),
      ]);
      setCategories(catRes.data.data);
      setStructures(strRes.data.data);
      setDiscounts(disRes.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreateCategory = async () => {
    await execute(() => feeApi.createCategory(catForm), {
      successMessage: 'Category created',
      onSuccess: () => { setShowCatModal(false); setCatForm({ name: '', description: '' }); loadAll(); },
    });
  };

  const catColumns = [
    { header: 'Category Name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description', cell: ({ row }) => row.original.description || '-' },
  ];

  const strColumns = [
    { header: 'Grade', accessorKey: 'gradeName' },
    { header: 'Category', accessorKey: 'feeCategoryName' },
    { header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
    { header: 'Frequency', accessorKey: 'frequency' },
    { header: 'Due Day', cell: ({ row }) => row.original.dueDay || '-' },
  ];

  const disColumns = [
    { header: 'Discount Name', accessorKey: 'name' },
    { header: 'Type', accessorKey: 'discountType' },
    { header: 'Value', cell: ({ row }) => row.original.discountType === 'PERCENT' ? `${row.original.value}%` : formatCurrency(row.original.value) },
  ];

  return (
    <div>
      <PageHeader title="Fee Configuration" />
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="structures">Structures</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowCatModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
          </div>
          <DataTable columns={catColumns} data={categories} loading={loading} />
        </TabsContent>

        <TabsContent value="structures" className="mt-4">
          <DataTable columns={strColumns} data={structures} loading={loading} />
        </TabsContent>

        <TabsContent value="discounts" className="mt-4">
          <DataTable columns={disColumns} data={discounts} loading={loading} />
        </TabsContent>
      </Tabs>

      <FormModal open={showCatModal} onClose={() => setShowCatModal(false)} title="Add Fee Category">
        <div className="space-y-4">
          <div>
            <Label>Category Name</Label>
            <Input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="mt-1" />
          </div>
          <Button onClick={handleCreateCategory} className="w-full">Create</Button>
        </div>
      </FormModal>
    </div>
  );
}