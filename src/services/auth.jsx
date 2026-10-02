import { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Demo authentication. Replace `login` with a call to the real auth endpoint.
export const DEMO_ACCOUNTS = {
  parent: { username: 'parent@kleos', password: 'kleos123', name: 'Srinivas Reddy', title: 'Parent' },
  student: { username: 'KIS-sahithi', password: 'kleos123', name: 'Sahithi Naidu', title: 'Student · IX-A' },
  admin: { username: 'admin@kleos', password: 'admin123', name: 'Lakshmi Prasanna', title: 'Principal · Administrator' },
};

const AuthContext = createContext(null);
const KEY = 'kleos:session';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(KEY)) || null;
    } catch {
      return null;
    }
  });

  const login = (role, username, password) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const acc = DEMO_ACCOUNTS[role];
        if (acc && username.trim().toLowerCase() === acc.username.toLowerCase() && password === acc.password) {
          const s = { role, name: acc.name, title: acc.title };
          setSession(s);
          try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
          resolve(s);
        } else reject(new Error('Incorrect username or password. Use the demo credentials shown below.'));
      }, 700);
    });

  const logout = () => {
    setSession(null);
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  };

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function RequireRole({ role, children }) {
  const { session } = useAuth();
  const loc = useLocation();
  if (!session || session.role !== role) return <Navigate to={`/login?role=${role}&next=${encodeURIComponent(loc.pathname)}`} replace />;
  return children;
}
