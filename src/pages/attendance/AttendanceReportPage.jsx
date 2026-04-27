import { useEffect, useState } from 'react';
import { attendanceApi } from '@/api/attendance.api';
import { studentApi } from '@/api/student.api';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AttendanceReportPage() {
  const [studentId, setStudentId] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await attendanceApi.getStudentSummary(studentId);
      setSummary(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Attendance Report" />
      <Card className="p-4 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label>Student ID</Label>
            <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Paste student UUID" className="mt-1" />
          </div>
          <button onClick={loadSummary} className="px-4 py-2 bg-primary text-white rounded-md">Load</button>
        </div>
      </Card>

      {loading && <LoadingSpinner />}

      {summary && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">{summary.studentName} ({summary.admissionNo})</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">{summary.totalWorkingDays}</div>
              <div className="text-sm text-muted-foreground">Working Days</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.presentDays}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.absentDays}</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{summary.lateDays}</div>
              <div className="text-sm text-muted-foreground">Late</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{summary.attendancePercentage}%</div>
              <div className="text-sm text-muted-foreground">Percentage</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}