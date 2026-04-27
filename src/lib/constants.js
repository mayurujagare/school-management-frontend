export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  PRINCIPAL: 'PRINCIPAL',
  TEACHER: 'TEACHER',
  CLERK: 'CLERK',
  PARENT: 'PARENT',
};

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  SCHOOL_ADMIN: 'School Admin',
  PRINCIPAL: 'Principal',
  TEACHER: 'Teacher',
  CLERK: 'Clerk',
  PARENT: 'Parent',
};

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ATTENDANCE_STATUS = {
  PRESENT: { label: 'Present', color: 'bg-green-100 text-green-800' },
  ABSENT:  { label: 'Absent',  color: 'bg-red-100 text-red-800' },
  LATE:    { label: 'Late',    color: 'bg-yellow-100 text-yellow-800' },
  LEAVE:   { label: 'Leave',   color: 'bg-blue-100 text-blue-800' },
  HOLIDAY: { label: 'Holiday', color: 'bg-gray-100 text-gray-800' },
};

export const FEE_STATUS = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  PARTIAL: { label: 'Partial', color: 'bg-orange-100 text-orange-800' },
  PAID:    { label: 'Paid',    color: 'bg-green-100 text-green-800' },
  WAIVED:  { label: 'Waived',  color: 'bg-gray-100 text-gray-800' },
};

export const PAYMENT_MODES = ['CASH', 'CHEQUE', 'UPI', 'BANK_TRANSFER', 'DD'];
