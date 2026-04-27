import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { announcementApi } from '@/api/announcement.api';
import { academicApi } from '@/api/academic.api';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnnouncementCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { targetType: 'ALL', publishNow: false },
  });

  const targetType = watch('targetType');

  useEffect(() => {
    academicApi.listGrades().then((res) => setGrades(res.data.data)).catch(console.error);
    academicApi.listAllSections().then((res) => setSections(res.data.data)).catch(console.error);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await announcementApi.create({
        ...data,
        targetId: data.targetId || undefined,
        publishNow: data.publishNow === 'true' || data.publishNow === true,
      });
      toast.success('Announcement created');
      navigate('/announcements');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="New Announcement" />
      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input {...register('title')} placeholder="Announcement title" className="mt-1" />
          </div>
          <div>
            <Label>Message *</Label>
            <textarea {...register('body')} rows={5} placeholder="Write your announcement..."
              className="mt-1 w-full border rounded-md p-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target *</Label>
              <select {...register('targetType')} className="mt-1 w-full border rounded-md p-2">
                <option value="ALL">Entire School</option>
                <option value="GRADE">Specific Grade</option>
                <option value="SECTION">Specific Section</option>
              </select>
            </div>
            {targetType === 'GRADE' && (
              <div>
                <Label>Select Grade</Label>
                <select {...register('targetId')} className="mt-1 w-full border rounded-md p-2">
                  <option value="">Choose...</option>
                  {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            )}
            {targetType === 'SECTION' && (
              <div>
                <Label>Select Section</Label>
                <select {...register('targetId')} className="mt-1 w-full border rounded-md p-2">
                  <option value="">Choose...</option>
                  {sections.map((s) => <option key={s.id} value={s.id}>{s.gradeName} - {s.name}</option>)}
                </select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('publishNow')} id="publishNow" />
            <Label htmlFor="publishNow">Publish immediately (sends push notification)</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Announcement'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/announcements')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}