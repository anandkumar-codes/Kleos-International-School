import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui';
import { ADMISSION_STAGES, classLabel } from '@shared/data/records';

export const nextStage = (s) => ADMISSION_STAGES[ADMISSION_STAGES.indexOf(s) + 1];

export function useMoveAdmission() {
  const store = useStore();
  const toast = useToast();
  return (a, stage) => {
    if (!a || !stage || a.stage === stage) return;
    store.patch('admissions', a.id, { stage });
    store.log('admission', `${a.studentName} moved to ${stage}`);
    if (stage === 'Confirmed') store.notify('admission', 'Admission confirmed', `${a.studentName} — ${classLabel(a.class)} for 2027–28.`);
    toast(`Moved to ${stage}`, { text: a.studentName, tone: stage === 'Rejected' ? 'info' : 'success' });
  };
}
