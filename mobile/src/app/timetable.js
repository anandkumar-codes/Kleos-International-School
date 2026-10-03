import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { Screen } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { TimetableView } from '@/screens/portal';

export default function Timetable() {
  const student = useMyStudent('parent');
  const t = roleTheme.parent;
  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="Timetable" subtitle={`${student.name} · ${student.class}-${student.section}`} />}>
      <TimetableView student={student} accent={t.accent} />
    </Screen>
  );
}
