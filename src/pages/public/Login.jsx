import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Users, GraduationCap, ShieldCheck, LogIn, ArrowLeft, CalendarCheck, Wallet, BookOpen, MessageSquare, Eye, EyeOff, Copy } from 'lucide-react';
import { Logo, Input, Button, Alert, SmartImage, useForm } from '../../components/ui';
import { required } from '../../utils/validate';
import { useAuth, DEMO_ACCOUNTS } from '../../services/auth';
import { IMG } from '../../data/school';

const ROLES = [
  { id: 'parent', label: 'Parent', icon: Users, home: '/portal/parent', hint: 'Use your registered email or mobile number' },
  { id: 'student', label: 'Student', icon: GraduationCap, home: '/portal/student', hint: 'Use your Kleos student ID' },
  { id: 'admin', label: 'Staff', icon: ShieldCheck, home: '/admin', hint: 'School staff and administrators' },
];

export default function Login() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState(ROLES.some((r) => r.id === params.get('role')) ? params.get('role') : 'parent');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const cfg = ROLES.find((r) => r.id === role);
  const form = useForm({ username: '', password: '' }, { username: [required('Username')], password: [required('Password')] });

  const onSubmit = form.submit(async (v) => {
    setStatus('loading');
    setError('');
    try {
      await login(role, v.username, v.password);
      nav(params.get('next') || cfg.home, { replace: true });
    } catch (e) {
      setError(e.message);
      setStatus('idle');
    }
  });

  const fillDemo = () => {
    const d = DEMO_ACCOUNTS[role];
    form.setValues({ username: d.username, password: d.password });
  };

  return (
    <div className="auth">
      <div className="auth__art">
        <SmartImage src={IMG.students} alt="" eager />
        <Link to="/"><Logo light /></Link>
        <blockquote>Everything about your child&apos;s day at Kleos — <em>in one place.</em></blockquote>
        <div className="auth__feats">
          <div><CalendarCheck /> Daily attendance</div>
          <div><BookOpen /> Homework & results</div>
          <div><Wallet /> Fees & receipts</div>
          <div><MessageSquare /> Teacher messages</div>
        </div>
      </div>
      <div className="auth__panel">
        <Link to="/" className="text-link" style={{ color: 'var(--ink-500)', fontWeight: 600 }}><ArrowLeft /> Back to website</Link>
        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <h1>Welcome back</h1>
          <p>Sign in to the Kleos {cfg.label === 'Staff' ? 'staff dashboard' : `${cfg.label.toLowerCase()} portal`}.</p>
          <div className="role-switch" role="tablist">
            {ROLES.map((r) => (
              <button type="button" key={r.id} role="tab" aria-selected={role === r.id} className={role === r.id ? 'is-active' : ''} onClick={() => { setRole(r.id); setError(''); form.reset(); }}>
                <r.icon /> {r.label}
              </button>
            ))}
          </div>
          {error && <Alert tone="error" title="Sign-in failed" className="mb">{error}</Alert>}
          <div style={{ display: 'grid', gap: 16 }}>
            <Input label={role === 'student' ? 'Student ID' : 'Email or mobile'} hint={cfg.hint} autoComplete="username" {...form.bind('username')} />
            <div style={{ position: 'relative' }}>
              <Input label="Password" type={show ? 'text' : 'password'} autoComplete="current-password" {...form.bind('password')} />
              <button type="button" className="icon-btn" style={{ position: 'absolute', right: 4, top: 30 }} onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0 22px', fontSize: 14 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" defaultChecked /> Keep me signed in</label>
            <a href="#forgot" className="text-link" style={{ fontSize: 14 }} onClick={(e) => { e.preventDefault(); setError('Password reset links are sent by the school office. Please call +91 80085 59442.'); }}>Forgot password?</a>
          </div>
          <Button type="submit" size="lg" block loading={status === 'loading'} icon={LogIn}>{status === 'loading' ? 'Signing in…' : 'Sign in'}</Button>
          <div className="demo-creds">
            <span>Demo: <code>{DEMO_ACCOUNTS[role].username}</code> / <code>{DEMO_ACCOUNTS[role].password}</code></span>
            <Button variant="soft" size="xs" icon={Copy} onClick={fillDemo}>Fill</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
