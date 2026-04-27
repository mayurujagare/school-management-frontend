import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROLES } from './lib/constants';

import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './pages/auth/LoginPage';
import OtpLoginPage from './pages/auth/OtpLoginPage';

import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import SchoolDashboard from './pages/dashboard/SchoolDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';

import SchoolListPage from './pages/schools/SchoolListPage';
import SchoolCreatePage from './pages/schools/SchoolCreatePage';
import SchoolDetailPage from './pages/schools/SchoolDetailPage';

import GradeListPage from './pages/academic/GradeListPage';
import SubjectListPage from './pages/academic/SubjectListPage';

import StudentListPage from './pages/students/StudentListPage';
import StudentEnrollPage from './pages/students/StudentEnrollPage';
import StudentDetailPage from './pages/students/StudentDetailPage';

import StaffListPage from './pages/staff/StaffListPage';
import StaffCreatePage from './pages/staff/StaffCreatePage';

import MarkAttendancePage from './pages/attendance/MarkAttendancePage';
import AttendanceReportPage from './pages/attendance/AttendanceReportPage';

import FeeStructurePage from './pages/fees/FeeStructurePage';
import RecordPaymentPage from './pages/fees/RecordPaymentPage';

import EnterMarksPage from './pages/exams/EnterMarksPage';

import AnnouncementListPage from './pages/announcements/AnnouncementListPage';
import AnnouncementCreatePage from './pages/announcements/AnnouncementCreatePage';

function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.roles?.[0];

  switch (role) {
    case ROLES.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    case ROLES.PARENT:
      return <ParentDashboard />;
    default:
      return <SchoolDashboard />;
  }
}

const SA = [ROLES.SUPER_ADMIN];
const ADMIN = [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL];
const STAFF = [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLERK];
const ADMIN_CLERK = [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK];
const TEACHERS = [ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/parent-login" element={<OtpLoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardRouter />} />

              {/* Super Admin */}
              <Route path="/schools" element={<RoleGuard roles={SA}><SchoolListPage /></RoleGuard>} />
              <Route path="/schools/create" element={<RoleGuard roles={SA}><SchoolCreatePage /></RoleGuard>} />
              <Route path="/schools/:schoolId" element={<RoleGuard roles={SA}><SchoolDetailPage /></RoleGuard>} />

              {/* Academic */}
              <Route path="/academic" element={<RoleGuard roles={ADMIN}><GradeListPage /></RoleGuard>} />
              <Route path="/academic/subjects" element={<RoleGuard roles={ADMIN}><SubjectListPage /></RoleGuard>} />

              {/* Students */}
              <Route path="/students" element={<RoleGuard roles={STAFF}><StudentListPage /></RoleGuard>} />
              <Route path="/students/enroll" element={<RoleGuard roles={ADMIN_CLERK}><StudentEnrollPage /></RoleGuard>} />
              <Route path="/students/:studentId" element={<RoleGuard roles={STAFF}><StudentDetailPage /></RoleGuard>} />

              {/* Staff */}
              <Route path="/staff" element={<RoleGuard roles={ADMIN}><StaffListPage /></RoleGuard>} />
              <Route path="/staff/create" element={<RoleGuard roles={ADMIN}><StaffCreatePage /></RoleGuard>} />

              {/* Attendance */}
              <Route path="/attendance" element={<RoleGuard roles={STAFF}><MarkAttendancePage /></RoleGuard>} />
              <Route path="/attendance/report" element={<RoleGuard roles={STAFF}><AttendanceReportPage /></RoleGuard>} />

              {/* Fees */}
              <Route path="/fees" element={<RoleGuard roles={ADMIN_CLERK}><FeeStructurePage /></RoleGuard>} />
              <Route path="/fees/payment" element={<RoleGuard roles={ADMIN_CLERK}><RecordPaymentPage /></RoleGuard>} />

              {/* Exams */}
              <Route path="/exams" element={<RoleGuard roles={TEACHERS}><EnterMarksPage /></RoleGuard>} />

              {/* Announcements */}
              <Route path="/announcements" element={<RoleGuard roles={TEACHERS}><AnnouncementListPage /></RoleGuard>} />
              <Route path="/announcements/create" element={<RoleGuard roles={TEACHERS}><AnnouncementCreatePage /></RoleGuard>} />

              {/* Parent */}
              <Route path="/my-children" element={<RoleGuard roles={[ROLES.PARENT]}><ParentDashboard /></RoleGuard>} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;