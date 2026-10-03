import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Same demo accounts as the website. Replace `login` with a call to the school's auth API.
export const DEMO_ACCOUNTS = {
  parent: { username: 'parent@kleos', password: 'kleos123', name: 'Srinivas Reddy', title: 'Parent of Aarav' },
  student: { username: 'KIS-sahithi', password: 'kleos123', name: 'Sahithi Naidu', title: 'Student · IX-A' },
  staff: { username: 'admin@kleos', password: 'admin123', name: 'Lakshmi Prasanna', title: 'Principal' },
};

const KEY = 'kleos-app:session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still loading

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => setSession(v ? JSON.parse(v) : null))
      .catch(() => setSession(null));
  }, []);

  const login = (role, username, password) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const acc = DEMO_ACCOUNTS[role];
        if (acc && username.trim().toLowerCase() === acc.username.toLowerCase() && password === acc.password) {
          const s = { role, name: acc.name, title: acc.title };
          setSession(s);
          AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
          resolve(s);
        } else reject(new Error('Incorrect username or password.'));
      }, 650);
    });

  const logout = () => {
    setSession(null);
    AsyncStorage.removeItem(KEY).catch(() => {});
  };

  return <AuthContext.Provider value={{ session, ready: session !== undefined, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
