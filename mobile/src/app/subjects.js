import { Text, View } from 'react-native';
import { useStore, useMyStudent } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Card, Progress, Screen } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { SUBJECTS, stageOf, resultRow } from '@shared/data/records';

const TINTS = ['#177A5B', '#2D7DD2', '#D98A10', '#7F56C8', '#C8323C', '#0E7490', '#4D7C0F'];
const TEACHER = { English: 'Mrs. Swathi Kulkarni', Telugu: 'Mrs. Padmaja Reddy', Mathematics: 'Mr. Suresh Babu', Science: 'Mr. Ravi Shankar Varma', 'Social Science': 'Mrs. Anitha Murthy', AI: 'Ms. Sneha Iyer', Hindi: 'Mr. Arvind Sharma', Computers: 'Ms. Sneha Iyer' };

export default function Subjects() {
  const { state } = useStore();
  const student = useMyStudent('student');
  const t = roleTheme.student;
  const subjects = SUBJECTS[stageOf(student.class)];
  const hy = resultRow(student, 'hy', state.marks);
  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="My subjects" subtitle={`${subjects.length} subjects · Grade ${student.class}`} />}>
      {subjects.map((s, i) => {
        const p = Math.round((hy.marks[s] / 80) * 100);
        return (
          <Card key={s} style={{ gap: 10, borderLeftWidth: 4, borderLeftColor: TINTS[i % TINTS.length] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.ink900 }}>{s}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>{TEACHER[s] || 'Subject teacher'}</Text>
              </View>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 18, color: colors.ink900 }}>{p}%</Text>
            </View>
            <Progress value={p} height={6} color={TINTS[i % TINTS.length]} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink400 }}>Half-yearly · {hy.marks[s]} / 80</Text>
          </Card>
        );
      })}
    </Screen>
  );
}
