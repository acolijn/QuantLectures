import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // PocketBase persists auth in localStorage automatically
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    // Listen for auth state changes (login / logout / token refresh)
    const unsub = pb.authStore.onChange((token, model) => {
      setUser(model);
    });
    return () => unsub();
  }, []);

  async function signIn(email, password) {
    return pb.collection('users').authWithPassword(email, password);
  }

  function signOut() {
    pb.authStore.clear();
  }

  const isTeacher = user?.role === 'teacher';

  return (
    <AuthContext.Provider value={{ user, isTeacher, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

