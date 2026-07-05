'use client';

import type { UserResponse } from '@registerkaro/shared';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { apiRequest } from './api-client';

const REFRESH_TOKEN_KEY = 'registerkaro_refresh_token';

interface AuthContextValue {
  user: UserResponse | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponsePayload {
  user: UserResponse;
  tokens: AuthTokens;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try to silently resume a session using a stored refresh
  // token. The access token itself is deliberately never persisted to
  // storage — only kept in memory — so a page reload always re-derives it
  // via /auth/refresh rather than trusting a stale token from localStorage.
  useEffect(() => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      setIsLoading(false);
      return;
    }

    apiRequest<{ tokens: AuthTokens }>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken: storedRefreshToken },
    })
      .then(async ({ tokens }) => {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        setAccessToken(tokens.accessToken);
        const me = await apiRequest<UserResponse>('/auth/me', {
          accessToken: tokens.accessToken,
        });
        setUser(me);
      })
      .catch(() => {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function applySession(payload: AuthResponsePayload): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.tokens.refreshToken);
    setAccessToken(payload.tokens.accessToken);
    setUser(payload.user);
  }

  async function login(email: string, password: string): Promise<void> {
    const payload = await apiRequest<AuthResponsePayload>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    applySession(payload);
  }

  async function register(email: string, password: string, name: string): Promise<void> {
    const payload = await apiRequest<AuthResponsePayload>('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
    applySession(payload);
  }

  function logout(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}