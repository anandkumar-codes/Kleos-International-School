import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { Screen } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { AttendanceView } from '@/screens/portal';

export default function MyAttendance() {
  const student = useMyStudent('student');
  const t = roleTheme.student;
  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="Attendance" subtitle={`${student.attendance}% this term`} />}>
      <AttendanceView student={student} accent={t.accent} />
    </Screen>
  );
}
