import { useEffect, useState } from 'react';
import { examApi } from '@/api/exam.api';
import { studentApi } from '@/api/student.api';
import { academicApi } from '@/api/academic.api';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EnterMarksPage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [examDetail, setExamDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    examApi.listExams().then((res) => setExams(res.data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedExam) return;
    const exam = exams.find((e) => e.id === selectedExam);
    setExamDetail(exam);

    // Load existing results if any
    examApi.getResults(selectedExam)
      .then((res) => {
        const data = res.data.data;
        if (data.marks?.length > 0) {
          setStudents(data.marks.map((m) => ({ id: m.studentId, fullName: m.studentName, admissionNo: m.admissionNo })));
          const existing = {};
          data.marks.forEach((m) => {
            existing[m.studentId] = { marksObtained: m.marksObtained ?? '', isAbsent: m.isAbsent };
          });
          setMarks(existing);
        }
      })
      .catch(console.error);
  }, [selectedExam]);

  const updateMark = (studentId, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const records = Object.entries(marks).map(([studentId, data]) => ({
        studentId,
        marksObtained: data.isAbsent ? null : parseFloat(data.marksObtained) || null,
        isAbsent: data.isAbsent || false,
        remarks: null,
      }));
      await examApi.enterMarks({ examId: selectedExam, records });
      toast.success('Marks saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Enter Marks" />
      <Card className="p-4 mb-6">
        <Label>Select Exam</Label>
        <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="mt-1 w-full border rounded-md p-2">
          <option value="">Choose exam...</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.examTypeName} — {e.subjectName} — {e.gradeName} (Max: {e.maxMarks})
            </option>
          ))}
        </select>
      </Card>

      {students.length > 0 && (
        <>
          <Card className="divide-y">
            <div className="flex items-center p-3 bg-gray-50 font-medium text-sm">
              <span className="w-8">#</span>
              <span className="flex-1">Student</span>
              <span className="w-32 text-center">Marks (/{examDetail?.maxMarks})</span>
              <span className="w-24 text-center">Absent</span>
            </div>
            {students.map((student, idx) => (
              <div key={student.id} className="flex items-center p-3">
                <span className="w-8 text-muted-foreground">{idx + 1}</span>
                <span className="flex-1">{student.fullName}</span>
                <span className="w-32">
                  <Input
                    type="number"
                    step="0.5"
                    value={marks[student.id]?.marksObtained ?? ''}
                    onChange={(e) => updateMark(student.id, 'marksObtained', e.target.value)}
                    disabled={marks[student.id]?.isAbsent}
                    className="text-center"
                  />
                </span>
                <span className="w-24 text-center">
                  <input
                    type="checkbox"
                    checked={marks[student.id]?.isAbsent || false}
                    onChange={(e) => updateMark(student.id, 'isAbsent', e.target.checked)}
                    className="h-4 w-4"
                  />
                </span>
              </div>
            ))}
          </Card>
          <div className="mt-4">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Marks'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}