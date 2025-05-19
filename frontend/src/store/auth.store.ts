import { create } from 'zustand';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import * as userService from '@/app/services/user.service';

interface AuthState {
  token: string | null;
  role: string | null;
  username: string | null;

  login: (email: string, password: string) => Promise<void>;
  createCommonUser: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  createUserByAdmin: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<void>;

  createFirstAdminUser: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;

  logout: () => void;
  loadToken: () => void;
  getRole: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  username: null,
  login: async (email, password) => {
    const data = await userService.login({
      email,
      password,
    });

    Cookies.set('token', data.token, { expires: 1 }); // 1 dia
    const decoded = jwt.decode(data.token) as { role: string; name: string };

    set({ token: data.token, role: decoded.role, username: decoded.name });
  },

  createCommonUser: async (email, password, name) => {
    const data = await userService.registerCommon({
      email,
      password,
      name,
    });

    Cookies.set('token', data.token, { expires: 1 });
    const decoded = jwt.decode(data.token) as { role: string };

    set({ token: data.token });
    set({ role: decoded.role });
  },

  createUserByAdmin: async (email, password, name, role) => {
    await userService.registerAdmin({
      email,
      password,
      name,
      role,
    });
  },

  createFirstAdminUser: async (email, password, name) => {
    await userService.registerFirstAdmin({
      email,
      password,
      name,
      role: 'admin',
    });
  },

  logout: () => {
    Cookies.remove('token');
    set({ token: null });
  },

  loadToken: () => {
    const token = Cookies.get('token') || null;
    set({ token });
  },

  getRole: async () => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = jwt.decode(token) as { role: string; name: string };

      set({ role: decoded.role, username: decoded.name });
      return decoded.role;
    }
    return null;
  },
}));
