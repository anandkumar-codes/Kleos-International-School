import { useState } from 'react';
import { Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts } from '@/lib/theme';
import { Button, Card, Chips, Field, LargeHeader, Screen, T, useToast } from '@/components/ui';
import { CLASSES, classLabel, ANNUAL_FEE } from '@shared/data/records';
import { SCHOOL } from '@shared/data/school';
import { validate, required, email, phoneIN, minLen } from '@shared/utils/validate';
import { submitEnquiry } from '@shared/services/api';
import { formatINR } from '@shared/utils/format';

const STEPS = [
  ['Enquiry', 'Submit this form or visit the office'],
  ['Application', 'Fill the application with the registration fee'],
  ['Documents', 'Birth certificate, Aadhaar, report card, TC'],
  ['Interaction', 'Age-appropriate assessment and parent meeting'],
  ['Confirmation', 'Offer letter within 3 working days'],
  ['Fee payment', 'Pay the first installment to confirm the seat'],
];

const SCHEMA = {
  parentName: [required('Parent name'), minLen(3, 'Parent name')],
  studentName: [required('Student name')],
  phone: [required('Mobile number'), phoneIN],
  email: [required('Email'), email],
  class: [required('Class')],
};
const EMPTY = { parentName: '', studentName: '', phone: '', email: '', class: '', academicYear: SCHOOL.admissionYear, message: '' };

export default function GuestAdmissions() {
  const store = useStore();
  const toast = useToast();
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  const set = (k) => (val) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: validate({ ...v, [k]: val }, { [k]: SCHEMA[k] })[k] }));
  };

  const submit = async () => {
    const e = validate(v, SCHEMA);
    setErrors(e);
    if (Object.keys(e).length) return toast('Please check the form', { tone: 'error', text: `${Object.keys(e).length} field${Object.keys(e).length > 1 ? 's need' : ' needs'} attention` });
    setLoading(true);
    const rec = await submitEnquiry(store, v);
    setLoading(false);
    setDone(rec);
    setV(EMPTY);
    toast('Enquiry received', { text: `Reference ${rec.id}` });
  };

  return (
    <Screen header={<LargeHeader title="Admissions" subtitle={`Academic year ${SCHOOL.admissionYear}`} />}>
      <Card style={{ gap: 2 }}>
        {STEPS.map(([t, d], i) => (
          <View key={t} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: i === STEPS.length - 1 ? colors.gold500 : colors.green800, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: i === STEPS.length - 1 ? colors.green950 : '#fff' }}>{i + 1}</Text>
              </View>
              {i < STEPS.length - 1 ? <View style={{ width: 2, flex: 1, minHeight: 14, backgroundColor: colors.green200, marginVertical: 3 }} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: 12 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink900, marginTop: 5 }}>{t}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.ink500 }}>{d}</Text>
            </View>
          </View>
        ))}
      </Card>

      {done ? (
        <Card style={{ alignItems: 'center', gap: 8, paddingVertical: 28 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.green100, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="check" size={30} color={colors.green700} />
          </View>
          <T v="h2" style={{ textAlign: 'center' }}>Thank you — enquiry received!</T>
          <T style={{ textAlign: 'center' }}>Your reference number is <Text style={{ fontFamily: fonts.bold, color: colors.ink900 }}>{done.id}</Text>. Our counsellor will call you within one working day.</T>
          <Button title="Submit another enquiry" variant="outline" onPress={() => setDone(null)} style={{ marginTop: 8 }} />
        </Card>
      ) : (
        <Card style={{ gap: 16 }}>
          <View>
            <T v="h2">Admission enquiry</T>
            <T v="small" style={{ marginTop: 4 }}>Fields marked * are required.</T>
          </View>
          <Field label="Parent / guardian name" required value={v.parentName} onChangeText={set('parentName')} placeholder="e.g. Ravi Kumar" error={errors.parentName} autoComplete="name" />
          <Field label="Student name" required value={v.studentName} onChangeText={set('studentName')} placeholder="Child's full name" error={errors.studentName} />
          <Field label="Mobile number" required value={v.phone} onChangeText={set('phone')} placeholder="98765 43210" keyboardType="phone-pad" error={errors.phone} autoComplete="tel" />
          <Field label="Email" required value={v.email} onChangeText={set('email')} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} autoComplete="email" />
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink800 }}>Class applying for<Text style={{ color: colors.red500 }}> *</Text></Text>
            <Chips options={CLASSES.map((c) => ({ value: c, label: classLabel(c) }))} value={v.class} onChange={set('class')} />
            {errors.class ? <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.red600 }}>{errors.class}</Text> : null}
          </View>
          <Field label="Message (optional)" value={v.message} onChangeText={set('message')} placeholder="Transport needs, previous school, questions…" multiline />
          <Button title={loading ? 'Sending…' : 'Submit enquiry'} icon="send" size="lg" loading={loading} onPress={submit} />
        </Card>
      )}

      <Card style={{ gap: 4 }}>
        <T v="h3" style={{ marginBottom: 6 }}>Indicative annual tuition</T>
        {[['Pre-Primary', 'pre-primary'], ['Grades I – V', 'primary'], ['Grades VI – VIII', 'middle'], ['Grades IX – X', 'secondary'], ['Grades XI – XII', 'senior-secondary']].map(([l, key], i) => (
          <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: i ? 1 : 0, borderTopColor: '#EEF2F0', borderStyle: 'dashed' }}>
            <T>{l}</T>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 }}>{formatINR(ANNUAL_FEE[key])}</Text>
          </View>
        ))}
        <T v="small" style={{ marginTop: 6 }}>Payable in 4 installments. Transport, books and uniform are extra.</T>
      </Card>
    </Screen>
  );
}
