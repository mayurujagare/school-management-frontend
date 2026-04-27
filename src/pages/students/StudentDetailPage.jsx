import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentApi } from '@/api/student.api';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export default function StudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getById(studentId)
      .then((res) => setStudent(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!student) return <div>Student not found</div>;

  return (
    <div>
      <PageHeader title={student.fullName} description={`Admission No: ${student.admissionNo || 'N/A'}`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Student Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span><span>{formatDate(student.dateOfBirth)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span>{student.gender || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Blood Group</span><span>{student.bloodGroup || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{student.address || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Enrolled</span><span>{formatDate(student.enrolledAt)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={student.isActive ? 'ACTIVE' : 'INACTIVE'} /></div>
          </div>
        </Card>

        {student.currentEnrollment && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Enrollment</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Grade</span><span>{student.currentEnrollment.gradeName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Section</span><span>{student.currentEnrollment.sectionName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Roll Number</span><span>{student.currentEnrollment.rollNumber || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Academic Year</span><span>{student.currentEnrollment.academicYearLabel}</span></div>
            </div>
          </Card>
        )}

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Parents / Guardians</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.parents?.map((parent) => (
              <div key={parent.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{parent.fullName}</span>
                  {parent.isPrimary && <StatusBadge status="ACTIVE" />}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-muted-foreground">Relation: {parent.relation}</div>
                  {parent.email && <div className="text-muted-foreground">Email: {parent.email}</div>}
                  {parent.mobile && <div className="text-muted-foreground">Mobile: {parent.mobile}</div>}
                  {parent.occupation && <div className="text-muted-foreground">Occupation: {parent.occupation}</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}