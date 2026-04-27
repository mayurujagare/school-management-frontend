import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { schoolApi } from '@/api/school.api';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'School name is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  adminFirstName: z.string().min(1, 'Admin first name is required'),
  adminLastName: z.string().min(1, 'Admin last name is required'),
  adminIdentifier: z.string().min(1, 'Admin email or mobile is required'),
  subscriptionPlan: z.string().min(1, 'Plan is required'),
  subscriptionExpiry: z.string().min(1, 'Expiry date is required'),
});

export default function SchoolCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { subscriptionPlan: 'DEMO' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await schoolApi.onboardSchool(data);
      toast.success('School onboarded successfully');
      navigate('/schools');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Onboard New School" description="Register a new school on the platform" />
      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">School Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>School Name *</Label>
                <Input {...register('name')} className="mt-1" />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register('email')} className="mt-1" />
              </div>
              <div>
                <Label>City</Label>
                <Input {...register('city')} className="mt-1" />
              </div>
              <div>
                <Label>State</Label>
                <Input {...register('state')} className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register('phone')} className="mt-1" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">School Admin Account</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input {...register('adminFirstName')} className="mt-1" />
                {errors.adminFirstName && <p className="text-sm text-red-500 mt-1">{errors.adminFirstName.message}</p>}
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input {...register('adminLastName')} className="mt-1" />
                {errors.adminLastName && <p className="text-sm text-red-500 mt-1">{errors.adminLastName.message}</p>}
              </div>
              <div className="col-span-2">
                <Label>Admin Email or Mobile *</Label>
                <Input {...register('adminIdentifier')} placeholder="admin@school.edu" className="mt-1" />
                {errors.adminIdentifier && <p className="text-sm text-red-500 mt-1">{errors.adminIdentifier.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Subscription</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plan *</Label>
                <select {...register('subscriptionPlan')} className="mt-1 w-full border rounded-md p-2">
                  <option value="DEMO">Demo</option>
                  <option value="BASIC">Basic</option>
                  <option value="STANDARD">Standard</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
              <div>
                <Label>Expiry Date *</Label>
                <Input type="date" {...register('subscriptionExpiry')} className="mt-1" />
                {errors.subscriptionExpiry && <p className="text-sm text-red-500 mt-1">{errors.subscriptionExpiry.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Onboard School'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/schools')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}