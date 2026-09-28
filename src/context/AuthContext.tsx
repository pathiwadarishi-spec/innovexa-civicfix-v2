import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signInWithCustomToken, signInAnonymously, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  role: 'citizen' | 'admin' | 'supervisor' | 'worker';
  anonymousPublicId: string;
  municipalityId: number | null;
  phone: string | null;
  isAdmin: boolean;
}

export interface SetupStatus {
  isConfigured: boolean;
  adminCount: number;
  projectId?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setupStatus: SetupStatus | null;
  checkingSetup: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: (defaultRole?: string) => void;
  closeLoginModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithInnovexa: (email: string, role?: string, displayName?: string) => Promise<void>;
  loginAsAnonymousCitizen: () => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
  refreshSetupStatus: () => Promise<void>;
  completeInitialSetup: (emails: string[]) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [innovexaToken, setInnovexaToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('innovexa_token');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalDefaultRole, setModalDefaultRole] = useState<string | undefined>(undefined);

  const openLoginModal = (defaultRole?: string) => {
    setModalDefaultRole(defaultRole);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setModalDefaultRole(undefined);
  };

  // Check system setup status
  const refreshSetupStatus = async () => {
    try {
      setCheckingSetup(true);
      const res = await fetch('/api/system/setup-status');
      if (res.ok) {
        const data = await res.json();
        setSetupStatus(data);
      }
    } catch (err) {
      console.error('Failed to check setup status:', err);
    } finally {
      setCheckingSetup(false);
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (innovexaToken) return innovexaToken;
    if (auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken();
      } catch (err) {
        console.error('Failed to get auth token:', err);
      }
    }
    return null;
  };

  const refreshProfile = async (overrideToken?: string) => {
    const token = overrideToken || (await getAuthToken());
    if (!token) {
      setProfile(null);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        if (!user && data.user) {
          setUser(data.user as any);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  useEffect(() => {
    refreshSetupStatus();

    // Check saved INNOVEXA session
    const savedToken = localStorage.getItem('innovexa_token');
    const savedUser = localStorage.getItem('innovexa_user');
    if (savedToken && savedUser) {
      try {
        setInnovexaToken(savedToken);
        setUser(JSON.parse(savedUser));
        refreshProfile(savedToken);
      } catch {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // If we don't already have an INNOVEXA token active, track Firebase User
      if (!localStorage.getItem('innovexa_token')) {
        setUser(currentUser);
        if (currentUser) {
          await refreshProfile();
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Clear manual token if logging into Google
      localStorage.removeItem('innovexa_token');
      localStorage.removeItem('innovexa_user');
      setInnovexaToken(null);
      await signInWithPopup(auth, googleAuthProvider);
      await refreshProfile();
      closeLoginModal();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  const loginWithInnovexa = async (email: string, role = 'citizen', displayName?: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/innovexa-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, displayName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'INNOVEXA authentication failed');
      }

      setInnovexaToken(data.token);
      localStorage.setItem('innovexa_token', data.token);
      localStorage.setItem('innovexa_user', JSON.stringify(data.user));
      setUser(data.user as any);
      setProfile(data.profile);
      await refreshProfile(data.token);
      closeLoginModal();
    } catch (err: any) {
      console.error('INNOVEXA Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsAnonymousCitizen = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
      await refreshProfile();
      closeLoginModal();
    } catch (err: any) {
      console.error('Anonymous login error:', err);
      // Fallback: use guest profile
      await loginWithInnovexa(`guest_${Math.floor(1000 + Math.random() * 9000)}@innovexa.local`, 'citizen', 'Guest Citizen');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('innovexa_token');
      localStorage.removeItem('innovexa_user');
      setInnovexaToken(null);
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const completeInitialSetup = async (emails: string[]) => {
    try {
      const res = await fetch('/api/system/initial-admin-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to configure administrators' };
      }
      await refreshSetupStatus();
      if (auth.currentUser) {
        await refreshProfile();
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network request failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        setupStatus,
        checkingSetup,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginWithGoogle,
        loginWithInnovexa,
        loginAsAnonymousCitizen,
        logout,
        getAuthToken,
        refreshProfile,
        refreshSetupStatus,
        completeInitialSetup,
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
