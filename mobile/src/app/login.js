import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Feather from '@expo/vector-icons/Feather';
import { useAuth, DEMO_ACCOUNTS } from '@/lib/auth';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Button, Field, Segmented, T, tap } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { SCHOOL } from '@shared/data/school';

const LABEL = { parent: 'Parent', student: 'Student', staff: 'Staff' };

export default function Login() {
  const params = useLocalSearchParams();
  const { login } = useAuth();
  const [role, setRole] = useState(LABEL[params.role] ? params.role : 'parent');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const accent = roleTheme[role].accent;

  const submit = async () => {
    const e = {};
    if (!username.trim()) e.username = role === 'student' ? 'Student ID is required' : 'Email or mobile is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    setError('');
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await login(role, username, password);
      router.replace(`/${role}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fill = () => {
    setUsername(DEMO_ACCOUNTS[role].username);
    setPassword(DEMO_ACCOUNTS[role].password);
    setErrors({});
    setError('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.cream }}>
      <BackHeader title="" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/images/logo.png')} style={{ width: 56, height: 56 }} />
        <T v="h1" style={{ fontSize: 32, lineHeight: 36, marginTop: 18 }}>Welcome back</T>
        <T style={{ marginTop: 6 }}>Sign in to the Kleos {role === 'staff' ? 'staff app' : `${LABEL[role].toLowerCase()} app`}.</T>

        <View style={{ marginTop: 24 }}>
          <Segmented accent={accent} value={role} onChange={(r) => { setRole(r); setErrors({}); setError(''); setUsername(''); setPassword(''); }} options={Object.entries(LABEL).map(([value, label]) => ({ value, label }))} />
        </View>

        {error ? (
          <View style={{ flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#F6C9CC', marginTop: 18 }}>
            <Feather name="alert-circle" size={18} color={colors.red600} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, color: colors.red600, fontSize: 14 }}>Sign-in failed</Text>
              <Text style={{ fontFamily: fonts.regular, color: colors.red600, fontSize: 13 }}>{error}</Text>
            </View>
          </View>
        ) : null}

        <View style={{ gap: 16, marginTop: 20 }}>
          <Field
            label={role === 'student' ? 'Student ID' : 'Email or mobile'}
            value={username}
            onChangeText={(v) => { setUsername(v); if (errors.username) setErrors((x) => ({ ...x, username: '' })); }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={role === 'student' ? 'default' : 'email-address'}
            placeholder={role === 'student' ? 'e.g. KIS-sahithi' : 'you@example.com'}
            error={errors.username}
            textContentType="username"
            returnKeyType="next"
          />
          <View>
            <Field label="Password" value={password} onChangeText={(v) => { setPassword(v); if (errors.password) setErrors((x) => ({ ...x, password: '' })); }} secureTextEntry={!show} placeholder="Your password" error={errors.password} textContentType="password" onSubmitEditing={submit} returnKeyType="go" />
            <Pressable accessibilityLabel={show ? 'Hide password' : 'Show password'} onPress={() => { tap(); setShow((s) => !s); }} hitSlop={10} style={{ position: 'absolute', right: 14, top: 40 }}>
              <Feather name={show ? 'eye-off' : 'eye'} size={19} color={colors.ink400} />
            </Pressable>
          </View>
        </View>

        <Button title={loading ? 'Signing in…' : 'Sign in'} icon="log-in" size="lg" loading={loading} onPress={submit} color={accent} style={{ marginTop: 24 }} />

        <Pressable onPress={() => { tap(); fill(); }} style={{ marginTop: 18, padding: 14, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.green200, backgroundColor: colors.green50, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Feather name="key" size={18} color={colors.green700} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.green800 }}>Use demo account</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.green700 }}>{DEMO_ACCOUNTS[role].username} · {DEMO_ACCOUNTS[role].password}</Text>
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.green800 }}>Fill</Text>
        </Pressable>

        <T v="small" style={{ textAlign: 'center', marginTop: 24 }}>Forgot your password? Call the school office at {SCHOOL.phone}</T>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
