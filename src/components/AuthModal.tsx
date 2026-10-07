import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, LogIn, Shield, Phone, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'register' | 'user-login' | 'admin-login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'register',
}) => {
  const { registerUser, loginUser, loginAdmin } = useAuth();
  const [tab, setTab] = useState<'register' | 'user-login' | 'admin-login'>(initialTab);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // User Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Login fields
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = registerUser(regName, regPhone, regPassword);
    if (result.success) {
      setSuccess('¡Registro completado con éxito! Bienvenido a 520 Movility.');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1000);
    } else {
      setError(result.message || 'Error en el registro');
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = loginUser(loginPhone, loginPassword);
    if (result.success) {
      setSuccess('¡Bienvenido de nuevo!');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 800);
    } else {
      setError(result.message || 'Error al iniciar sesión');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = loginAdmin(adminUser, adminPassword);
    if (result.success) {
      setSuccess('¡Acceso concedido como Administrador 520!');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 800);
    } else {
      setError(result.message || 'Credenciales de administrador incorrectas');
    }
  };

  const fillAdminCredentials = () => {
    setAdminUser('admin520');
    setAdminPassword('1995');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131317] border border-[#2a2a33] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top bar with 520 accent */}
        <div className="h-1.5 w-full bg-[#FFEE00]" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase">
              520 <span className="text-[#FFEE00]">MOVILITY</span>
            </h2>
            <p className="text-xs text-zinc-400">Acceso a rutinas de movilidad y panel de control</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 p-1.5 mx-5 bg-[#0a0a0d] rounded-xl border border-[#222228] text-xs font-semibold">
          <button
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`py-2 px-1 text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
              tab === 'register'
                ? 'bg-[#FFEE00] text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registro</span>
          </button>
          <button
            onClick={() => {
              setTab('user-login');
              setError(null);
            }}
            className={`py-2 px-1 text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
              tab === 'user-login'
                ? 'bg-[#FFEE00] text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Atletas</span>
          </button>
          <button
            onClick={() => {
              setTab('admin-login');
              setError(null);
            }}
            className={`py-2 px-1 text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
              tab === 'admin-login'
                ? 'bg-[#FFEE00] text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-5 mt-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 pt-4">
          {/* TAB 1: REGISTRO LIGERO */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mateo Silva"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Número de teléfono
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 612 345 678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Usarás tu teléfono para iniciar sesión de forma rápida.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Contraseña simple
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Introduce una clave sencilla"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase tracking-wide rounded-xl text-sm transition-all shadow-md shadow-[#FFEE00]/20 active:scale-[0.99]"
              >
                Registrarme en 520 Movility
              </button>

              <p className="text-center text-xs text-zinc-500 pt-1">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setTab('user-login')}
                  className="text-[#FFEE00] hover:underline font-semibold"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </form>
          )}

          {/* TAB 2: LOGIN USUARIO */}
          {tab === 'user-login' && (
            <form onSubmit={handleUserLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Número de teléfono
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 612 345 678"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Tu contraseña"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase tracking-wide rounded-xl text-sm transition-all shadow-md shadow-[#FFEE00]/20 active:scale-[0.99]"
              >
                Entrar a mi cuenta
              </button>

              <div className="p-3 bg-[#0a0a0d] border border-[#222228] rounded-xl text-xs text-zinc-400">
                <span className="text-zinc-300 font-semibold">Usuario de prueba precreado:</span>
                <div className="flex items-center justify-between mt-1">
                  <span>Tel: 612345678 | Clave: 123</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPhone('612345678');
                      setLoginPassword('123');
                    }}
                    className="text-[#FFEE00] underline font-medium hover:text-[#fff233]"
                  >
                    Usar prueba
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-zinc-500 pt-1">
                ¿No estás registrado?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-[#FFEE00] hover:underline font-semibold"
                >
                  Crear cuenta gratis
                </button>
              </p>
            </form>
          )}

          {/* TAB 3: LOGIN ADMIN */}
          {tab === 'admin-login' && (
            <form onSubmit={handleAdminLogin} className="space-y-3.5">
              <div className="p-3 bg-[#1d1b10] border border-[#FFEE00]/30 rounded-xl text-xs text-[#FFEE00]">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Credenciales requeridas:
                  </span>
                  <button
                    type="button"
                    onClick={fillAdminCredentials}
                    className="px-2 py-0.5 bg-[#FFEE00] text-black font-bold text-[11px] rounded hover:bg-white transition-colors"
                  >
                    Autocompletar
                  </button>
                </div>
                <p className="mt-1 text-zinc-300">
                  Usuario: <span className="font-mono text-[#FFEE00] font-bold">admin520</span> | Contraseña:{' '}
                  <span className="font-mono text-[#FFEE00] font-bold">1995</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Usuario Administrador
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="admin520"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="1995"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase tracking-wide rounded-xl text-sm transition-all shadow-md shadow-[#FFEE00]/20 active:scale-[0.99]"
              >
                Acceder al Panel Admin
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
