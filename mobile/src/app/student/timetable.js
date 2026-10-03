import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { LargeHeader, Screen } from '@/components/ui';
import { TimetableView } from '@/screens/portal';

export default function StudentTimetable() {
  const student = useMyStudent('student');
  const t = roleTheme.student;
  return (
    <Screen canvas={t.canvas} header={<LargeHeader canvas={t.canvas} title="Timetable" subtitle={`Grade ${student.class}-${student.section}`} />}>
      <TimetableView student={student} accent={t.accent} />
    </Screen>
  );
}
