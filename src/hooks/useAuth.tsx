'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { UserProfile } from '@/types/note';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  uid: 'demo_user_001',
  email: 'demo@brainlibrary.app',
  displayName: 'Hamza (Bilingual Scholar)',
  locale: 'en',
  theme: 'dark',
  photoURL: ''
};

export function formatAuthError(err: unknown): string {
  if (!err) return 'Authentication failed. Please try again.';
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';
  const message = err instanceof Error ? err.message : String(err);

  if (code.includes('auth/popup-closed-by-user') || code.includes('auth/cancelled-popup-request')) {
    return 'Google Sign-In popup was closed before completion. Please try again.';
  }
  if (code.includes('auth/unauthorized-domain')) {
    return 'This domain is not authorized for OAuth in Firebase Console. Please add this domain under Authentication > Authorized domains.';
  }
  if (
    code.includes('auth/invalid-credential') ||
    code.includes('auth/user-not-found') ||
    code.includes('auth/wrong-password')
  ) {
    return 'Invalid email or password. Please double-check your credentials.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  return message || 'An unexpected error occurred during authentication.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const savedDemo = localStorage.getItem('brain_demo_session');
    if (savedDemo === 'true') {
      setUser(DEMO_USER);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const savedLocalSession = localStorage.getItem('brain_local_session');
    if (savedLocalSession) {
      try {
        const localUser = JSON.parse(savedLocalSession);
        setUser(localUser);
        setIsDemo(false);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('brain_local_session');
      }
    }

    if (auth && isFirebaseConfigured) {
      try {
        const unsubscribe = onAuthStateChanged(
          auth,
          (fbUser: FirebaseUser | null) => {
            if (!isMounted) return;
            if (fbUser) {
              setUser({
                uid: fbUser.uid,
                email: fbUser.email || 'user@brainlibrary.app',
                displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
                locale: 'en',
                theme: 'dark',
                photoURL: fbUser.photoURL || undefined
              });
              setIsDemo(false);
            } else {
              setUser(null);
              setIsDemo(false);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('onAuthStateChanged warning:', error);
            if (isMounted) setLoading(false);
          }
        );
        return () => {
          isMounted = false;
          try {
            unsubscribe();
          } catch {
            // Ignore unsubscribe assertion race during hot reload
          }
        };
      } catch (err) {
        console.warn('Firebase auth listener init warning:', err);
        if (isMounted) setLoading(false);
      }
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const signInWithEmail = async (e: string, p: string) => {
    localStorage.removeItem('brain_demo_session');
    localStorage.removeItem('brain_local_session');
    
    if (!isFirebaseConfigured) {
      const accountsStr = localStorage.getItem('brain_local_accounts') || '[]';
      const accounts = JSON.parse(accountsStr);
      const matched = accounts.find(
        (acc: any) => acc.email.toLowerCase() === e.toLowerCase() && acc.password === p
      );
      if (!matched) {
        throw { code: 'auth/invalid-credential', message: 'Invalid credentials.' };
      }
      const profile: UserProfile = {
        uid: matched.uid,
        email: matched.email,
        displayName: matched.displayName || matched.email.split('@')[0],
        locale: 'en',
        theme: 'dark'
      };
      localStorage.setItem('brain_local_session', JSON.stringify(profile));
      setUser(profile);
      setIsDemo(false);
      return;
    }

    if (!auth) {
      throw new Error('Firebase authentication is not configured.');
    }
    await signInWithEmailAndPassword(auth, e, p);
  };

  const signUpWithEmail = async (e: string, p: string, name?: string) => {
    localStorage.removeItem('brain_demo_session');
    localStorage.removeItem('brain_local_session');

    if (!isFirebaseConfigured) {
      const accountsStr = localStorage.getItem('brain_local_accounts') || '[]';
      const accounts = JSON.parse(accountsStr);
      const exists = accounts.some(
        (acc: any) => acc.email.toLowerCase() === e.toLowerCase()
      );
      if (exists) {
        throw { code: 'auth/email-already-in-use', message: 'Email already in use.' };
      }
      if (p.length < 6) {
        throw { code: 'auth/weak-password', message: 'Weak password.' };
      }
      const newUid = `local_user_${Date.now()}`;
      const newAccount = {
        uid: newUid,
        email: e,
        password: p,
        displayName: name || e.split('@')[0]
      };
      accounts.push(newAccount);
      localStorage.setItem('brain_local_accounts', JSON.stringify(accounts));

      const profile: UserProfile = {
        uid: newUid,
        email: e,
        displayName: name || e.split('@')[0],
        locale: 'en',
        theme: 'dark'
      };
      localStorage.setItem('brain_local_session', JSON.stringify(profile));
      setUser(profile);
      setIsDemo(false);
      return;
    }

    if (!auth) {
      throw new Error('Firebase authentication is not configured.');
    }
    const cred = await createUserWithEmailAndPassword(auth, e, p);
    setUser({
      uid: cred.user.uid,
      email: e,
      displayName: name || e.split('@')[0],
      locale: 'en',
      theme: 'dark'
    });
  };

  const signInWithGoogle = async () => {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase authentication is not configured.');
    }
    localStorage.removeItem('brain_demo_session');
    localStorage.removeItem('brain_local_session');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInAsDemo = async () => {
    localStorage.setItem('brain_demo_session', 'true');
    localStorage.removeItem('brain_local_session');
    setUser(DEMO_USER);
    setIsDemo(true);
  };

  const logout = async () => {
    localStorage.removeItem('brain_demo_session');
    localStorage.removeItem('brain_local_session');
    if (auth && isFirebaseConfigured) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
