import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { LargeHeader, Screen } from '@/components/ui';
import { HomeworkView } from '@/screens/portal';

export default function StudentAssignments() {
  const student = useMyStudent('student');
  const t = roleTheme.student;
  return (
    <Screen canvas={t.canvas} header={<LargeHeader canvas={t.canvas} title="Assignments" subtitle="Homework and projects" />}>
      <HomeworkView student={student} role="student" accent={t.accent} />
    </Screen>
  );
}
