import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { tokenStore } from '../api/tokens';
import type { AccessMatrix, LoginPayload, User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  access: AccessMatrix | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  canAccessModule: (...keys: string[]) => boolean;
  canAccessPermission: (...keys: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/[\s/-]+/g, '_');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [access, setAccess] = useState<AccessMatrix | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const [me, accessMatrix] = await Promise.all([authApi.me(), authApi.access()]);
    setUser(me);
    setAccess(accessMatrix);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const hasToken = Boolean(tokenStore.getAccess() || tokenStore.getRefresh());
        if (hasToken) {
          await refreshSession();
        } else {
          setUser(null);
          setAccess(null);
        }
      } catch {
        setUser(null);
        setAccess(null);
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshSession]);

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);

      if (response.user) {
        setUser(response.user);
        const accessMatrix = await authApi.access();
        setAccess(accessMatrix);
        return;
      }

      await refreshSession();
    },
    [refreshSession],
  );

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setAccess(null);
  }, []);

  const canAccessModule = useCallback(
    (...keys: string[]) => {
      if (!access) return false;
      return keys.some((key) => access.modules?.[normalizeKey(key)] === true || access.modules?.[key] === true);
    },
    [access],
  );

  const canAccessPermission = useCallback(
    (...keys: string[]) => {
      if (!access) return false;
      return keys.some(
        (key) => access.permissions?.[normalizeKey(key)] === true || access.permissions?.[key] === true,
      );
    },
    [access],
  );

  const value = useMemo(
    () => ({
      user,
      access,
      loading,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
      refreshSession,
      setUser,
      canAccessModule,
      canAccessPermission,
    }),
    [access, canAccessModule, canAccessPermission, loading, refreshSession, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
