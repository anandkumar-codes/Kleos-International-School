import { useState } from 'react';
import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { LargeHeader, Screen, Segmented } from '@/components/ui';
import { HomeworkView, ResultsView } from '@/screens/portal';

export default function ParentAcademics() {
  const student = useMyStudent('parent');
  const t = roleTheme.parent;
  const [tab, setTab] = useState('homework');
  return (
    <Screen canvas={t.canvas} header={<LargeHeader canvas={t.canvas} title="Academics" subtitle={`${student.name} · Grade ${student.class}-${student.section}`} />}>
      <Segmented accent={t.accent} value={tab} onChange={setTab} options={[{ value: 'homework', label: 'Homework' }, { value: 'results', label: 'Exam results' }]} />
      {tab === 'homework' ? <HomeworkView student={student} role="parent" accent={t.accent} /> : <ResultsView student={student} accent={t.accent} />}
    </Screen>
  );
}
