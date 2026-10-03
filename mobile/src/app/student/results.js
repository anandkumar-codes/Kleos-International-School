import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { LargeHeader, Screen } from '@/components/ui';
import { ResultsView } from '@/screens/portal';

export default function StudentResults() {
  const student = useMyStudent('student');
  const t = roleTheme.student;
  return (
    <Screen canvas={t.canvas} header={<LargeHeader canvas={t.canvas} title="Results" subtitle="Term I · 2026–27" />}>
      <ResultsView student={student} accent={t.accent} />
    </Screen>
  );
}
