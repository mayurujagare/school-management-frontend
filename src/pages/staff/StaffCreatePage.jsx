import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { staffApi } from '@/api/staff.api';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().optional(),
  mobile: z.string().optional(),
  role: z.string().min(1, 'Required'),
  designation: z.string().optional(),
  department: z.string().optional(),
  dateOfJoining: z.string().optional(),
});

export default function StaffCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'TEACHER' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await staffApi.create({ ...data, dateOfJoining: data.dateOfJoining || undefined });
      toast.success('Staff member created. Default password: Welcome@123');
      navigate('/staff');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add Staff Member" />
      <Card className="max-w-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
              <Input {...register('firstName')} className="mt-1" />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input {...register('lastName')} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register('email')} className="mt-1" />
            </div>
            <div>
              <Label>Mobile</Label>
              <Input {...register('mobile')} className="mt-1" />
            </div>
            <div>
              <Label>Role *</Label>
              <select {...register('role')} className="mt-1 w-full border rounded-md p-2">
                <option value="TEACHER">Teacher</option>
                <option value="CLERK">Clerk</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="SCHOOL_ADMIN">School Admin</option>
              </select>
            </div>
            <div>
              <Label>Designation</Label>
              <Input {...register('designation')} className="mt-1" />
            </div>
            <div>
              <Label>Department</Label>
              <Input {...register('department')} className="mt-1" />
            </div>
            <div>
              <Label>Date of Joining</Label>
              <Input type="date" {...register('dateOfJoining')} className="mt-1" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Staff'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/staff')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}