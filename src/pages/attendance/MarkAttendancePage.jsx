import { useEffect, useState } from 'react';
import { academicApi } from '@/api/academic.api';
import { studentApi } from '@/api/student.api';
import { attendanceApi } from '@/api/attendance.api';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check, X, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarkAttendancePage() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    academicApi.listAllSections().then((res) => setSections(res.data.data)).catch(console.error);
  }, []);

  const loadStudents = async () => {
    if (!selectedSection) return;
    setLoading(true);
    try {
      const res = await studentApi.listBySection(selectedSection);
      setStudents(res.data.data);
      const defaultAttendance = {};
      res.data.data.forEach((s) => { defaultAttendance[s.id] = 'PRESENT'; });
      setAttendance(defaultAttendance);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (selectedSection) loadStudents(); }, [selectedSection]);

  const setStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
        remarks: null,
      }));
      await attendanceApi.markBulk({ sectionId: selectedSection, date, records });
      toast.success('Attendance marked successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSaving(false);
    }
  };

  const statusButtons = [
    { status: 'PRESENT', icon: Check, color: 'bg-green-500 hover:bg-green-600 text-white' },
    { status: 'ABSENT', icon: X, color: 'bg-red-500 hover:bg-red-600 text-white' },
    { status: 'LATE', icon: Clock, color: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
  ];

  return (
    <div>
      <PageHeader title="Mark Attendance" />

      <Card className="p-4 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label>Section</Label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="mt-1 w-full border rounded-md p-2"
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.gradeName} - {s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
          </div>
        </div>
      </Card>

      {loading && <LoadingSpinner />}

      {students.length > 0 && (
        <>
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => markAll('PRESENT')}>All Present</Button>
            <Button variant="outline" size="sm" onClick={() => markAll('ABSENT')}>All Absent</Button>
          </div>

          <Card className="divide-y">
            {students.map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between p-3">
                <div>
                  <span className="text-sm text-muted-foreground mr-3">{idx + 1}.</span>
                  <span className="font-medium">{student.fullName}</span>
                  <span className="text-sm text-muted-foreground ml-2">{student.admissionNo}</span>
                </div>
                <div className="flex gap-1">
                  {statusButtons.map(({ status, icon: Icon, color }) => (
                    <button
                      key={status}
                      onClick={() => setStatus(student.id, status)}
                      className={`p-2 rounded-md transition-all ${
                        attendance[student.id] === status ? color : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          <div className="mt-4">
            <Button onClick={handleSubmit} disabled={saving} className="w-full sm:w-auto">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Attendance'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}