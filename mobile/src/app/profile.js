import { useLocalSearchParams } from 'expo-router';
import { useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { Screen } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { ProfileView } from '@/screens/portal';

export default function Profile() {
  const { role = 'parent' } = useLocalSearchParams();
  const student = useMyStudent(role === 'student' ? 'student' : 'parent');
  const t = roleTheme[role] || roleTheme.parent;
  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title={role === 'student' ? 'My profile' : 'Student profile'} />}>
      <ProfileView student={student} />
    </Screen>
  );
}
