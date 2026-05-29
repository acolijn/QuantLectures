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

  async function signUp({ name, email, password, role, signupToken }) {
    const normalizedRole = role === 'teacher' ? 'teacher' : role === 'pending' ? 'pending' : 'student';

    await pb.collection('users').create({
      name: name?.trim() || '',
      email: email.trim().toLowerCase(),
      password,
      passwordConfirm: password,
      role: normalizedRole,
      signup_token: signupToken?.trim() || '',
    });

    // Clear sensitive token-like field after successful registration.
    if (normalizedRole === 'teacher' || signupToken) {
      try {
        const auth = await pb.collection('users').authWithPassword(email.trim().toLowerCase(), password);
        await pb.collection('users').update(auth.record.id, { signup_token: '' });
        pb.authStore.clear();
      } catch {
        // Ignore best-effort cleanup errors.
      }
    }
  }

  async function requestPasswordReset(email) {
    return pb.collection('users').requestPasswordReset(email.trim().toLowerCase());
  }

  async function confirmPasswordReset(token, newPassword) {
    return pb.collection('users').confirmPasswordReset(token, newPassword, newPassword);
  }

  async function changePassword(oldPassword, newPassword) {
    if (!pb.authStore.model?.id) throw new Error('Niet ingelogd.');
    return pb.collection('users').update(pb.authStore.model.id, {
      oldPassword,
      password: newPassword,
      passwordConfirm: newPassword,
    });
  }

  async function requestEmailVerification(email) {
    return pb.collection('users').requestVerification(email.trim().toLowerCase());
  }

  function signOut() {
    pb.authStore.clear();
  }

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isTeacher,
        isAdmin,
        signIn,
        signUp,
        signOut,
        requestPasswordReset,
        confirmPasswordReset,
        changePassword,
        requestEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

