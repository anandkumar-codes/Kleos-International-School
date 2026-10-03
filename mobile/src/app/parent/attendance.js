import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { LargeHeader, Screen } from '@/components/ui';
import { AttendanceView } from '@/screens/portal';

export default function ParentAttendance() {
  const student = useMyStudent('parent');
  const t = roleTheme.parent;
  return (
    <Screen canvas={t.canvas} header={<LargeHeader canvas={t.canvas} title="Attendance" subtitle={`${student.name} · ${student.attendance}% this term`} />}>
      <AttendanceView student={student} accent={t.accent} />
    </Screen>
  );
}
