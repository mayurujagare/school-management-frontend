import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { studentApi } from '@/api/student.api';
import { academicApi } from '@/api/academic.api';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const parentSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().optional(),
  mobile: z.string().optional(),
  relation: z.string().optional(),
  occupation: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  sectionId: z.string().optional(),
  rollNumber: z.string().optional(),
  parents: z.array(parentSchema).min(1, 'At least one parent is required').max(2),
});

export default function StudentEnrollPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      parents: [{ firstName: '', lastName: '', email: '', mobile: '', relation: 'FATHER', isPrimary: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'parents' });

  useEffect(() => {
    academicApi.listAllSections()
      .then((res) => setSections(res.data.data))
      .catch(console.error);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        sectionId: data.sectionId || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
      };
      await studentApi.enroll(payload);
      toast.success('Student enrolled successfully');
      navigate('/students');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Enroll New Student" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Student Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
              <Input {...register('firstName')} className="mt-1" />
              {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input {...register('lastName')} className="mt-1" />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" {...register('dateOfBirth')} className="mt-1" />
            </div>
            <div>
              <Label>Gender</Label>
              <select {...register('gender')} className="mt-1 w-full border rounded-md p-2">
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <Label>Blood Group</Label>
              <Input {...register('bloodGroup')} className="mt-1" />
            </div>
            <div>
              <Label>Section</Label>
              <select {...register('sectionId')} className="mt-1 w-full border rounded-md p-2">
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.gradeName} - {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Roll Number</Label>
              <Input {...register('rollNumber')} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <Input {...register('address')} className="mt-1" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Parents / Guardians</h3>
            {fields.length < 2 && (
              <Button type="button" variant="outline" size="sm"
                onClick={() => append({ firstName: '', lastName: '', email: '', mobile: '', relation: 'MOTHER', isPrimary: false })}>
                <Plus className="h-4 w-4 mr-1" /> Add Parent
              </Button>
            )}
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Parent {index + 1}</h4>
                {index > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input {...register(`parents.${index}.firstName`)} className="mt-1" />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input {...register(`parents.${index}.lastName`)} className="mt-1" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input {...register(`parents.${index}.email`)} className="mt-1" />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input {...register(`parents.${index}.mobile`)} className="mt-1" />
                </div>
                <div>
                  <Label>Relation</Label>
                  <select {...register(`parents.${index}.relation`)} className="mt-1 w-full border rounded-md p-2">
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="GUARDIAN">Guardian</option>
                  </select>
                </div>
                <div>
                  <Label>Occupation</Label>
                  <Input {...register(`parents.${index}.occupation`)} className="mt-1" />
                </div>
              </div>
            </div>
          ))}
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...</> : 'Enroll Student'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/students')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}