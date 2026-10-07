import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAdmin: boolean;
  loginUser: (phone: string, password: string) => { success: boolean; message?: string };
  loginAdmin: (username: string, password: string) => { success: boolean; message?: string };
  registerUser: (name: string, phone: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  toggleFavorite: (exerciseId: string) => void;
  recordCompletedWorkout: () => void;
  deleteUser: (userId: string) => void;
}

const STORAGE_USERS_KEY = '520_movility_users';
const STORAGE_CURRENT_USER_KEY = '520_movility_session';

const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Carlos Mendoza',
    phone: '612345678',
    password: '123',
    role: 'user',
    createdAt: '2026-02-14T09:00:00Z',
    routinesCompleted: 14,
    favoriteIds: ['ex-hombro-1', 'ex-cadera-1'],
  },
  {
    id: 'u-2',
    name: 'Lucía Fernández',
    phone: '698765432',
    password: '123',
    role: 'user',
    createdAt: '2026-03-01T15:20:00Z',
    routinesCompleted: 7,
    favoriteIds: ['ex-toracica-1'],
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default to the first registered user for instant preview, or null
    return INITIAL_DEMO_USERS[0];
  });

  // Save users to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  // Save session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const registerUser = (name: string, phone: string, password: string): { success: boolean; message?: string } => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanName = name.trim();
    const cleanPass = password.trim();

    if (!cleanName) {
      return { success: false, message: 'Por favor, introduce tu nombre' };
    }
    if (!cleanPhone || cleanPhone.length < 6) {
      return { success: false, message: 'Por favor, introduce un número de teléfono válido' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Introduce una contraseña simple' };
    }

    // Check if phone already registered
    const exists = users.some((u) => u.phone === cleanPhone);
    if (exists) {
      return { success: false, message: 'Este número de teléfono ya está registrado' };
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      password: cleanPass,
      role: 'user',
      createdAt: new Date().toISOString(),
      routinesCompleted: 0,
      favoriteIds: [],
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const loginUser = (phone: string, password: string): { success: boolean; message?: string } => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanPass = password.trim();

    // Check if matching phone
    const user = users.find((u) => u.phone === cleanPhone);
    if (!user) {
      return { success: false, message: 'No encontramos ninguna cuenta con este número de teléfono' };
    }

    if (user.password && user.password !== cleanPass) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const loginAdmin = (username: string, password: string): { success: boolean; message?: string } => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // Strict requirements from prompt: usuario "admin520", contraseña "1995"
    if (cleanUser === 'admin520' && cleanPass === '1995') {
      const adminUser: User = {
        id: 'admin-520',
        name: 'Administrador 520',
        phone: 'admin520',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z',
        routinesCompleted: 0,
        favoriteIds: [],
      };
      setCurrentUser(adminUser);
      return { success: true };
    }

    return { success: false, message: 'Credenciales de administrador incorrectas (Usuario: admin520 / Clave: 1995)' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleFavorite = (exerciseId: string) => {
    if (!currentUser) return;
    const exists = currentUser.favoriteIds?.includes(exerciseId);
    const updatedFavs = exists
      ? currentUser.favoriteIds.filter((id) => id !== exerciseId)
      : [...(currentUser.favoriteIds || []), exerciseId];

    const updatedUser = { ...currentUser, favoriteIds: updatedFavs };
    setCurrentUser(updatedUser);

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, favoriteIds: updatedFavs } : u))
    );
  };

  const recordCompletedWorkout = () => {
    if (!currentUser || currentUser.role === 'admin') return;
    const newCount = (currentUser.routinesCompleted || 0) + 1;
    const updatedUser = { ...currentUser, routinesCompleted: newCount };
    setCurrentUser(updatedUser);

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, routinesCompleted: newCount } : u))
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        loginUser,
        loginAdmin,
        registerUser,
        logout,
        toggleFavorite,
        recordCompletedWorkout,
        deleteUser,
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
