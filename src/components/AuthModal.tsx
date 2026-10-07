import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Shield,
  Phone,
  Lock,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  UserCheck,
  CheckSquare,
  Square
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'user' | 'admin';
  startInRegisterBox?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'user',
  startInRegisterBox = false,
}) => {
  const { registerUser, loginUser, loginAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState<'user' | 'admin'>(initialRole);

  // User Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Bottom Registration Casilla state & fields
  const [isRegisterBoxActive, setIsRegisterBoxActive] = useState<boolean>(startInRegisterBox);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

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
      }, 900);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#131317] border border-zinc-200 dark:border-[#2a2a33] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors">
        {/* Top yellow banner accent */}
        <div className="h-1.5 w-full bg-[#FFEE00]" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 bg-zinc-50 dark:bg-[#0c0c0e] border-b border-zinc-200 dark:border-[#22222a]">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
              520 <span className="text-amber-500 dark:text-[#FFEE00]">MOVILITY</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {activeSection === 'user'
                ? 'Apartado de Usuario & Casilla de Registro'
                : 'Apartado de Administrador'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 pestañas arriba: Apartado de Usuario vs Apartado de Administrador */}
        <div className="grid grid-cols-2 p-1.5 mx-5 mt-3 bg-zinc-100 dark:bg-[#0a0a0d] rounded-xl border border-zinc-200 dark:border-[#222228] text-xs font-semibold">
          <button
            onClick={() => {
              setActiveSection('user');
              setError(null);
            }}
            className={`py-2 px-3 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider ${
              activeSection === 'user'
                ? 'bg-[#FFEE00] text-black font-extrabold shadow border border-black/10'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 font-bold'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Apartado Usuario</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('admin');
              setError(null);
            }}
            className={`py-2 px-3 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider ${
              activeSection === 'admin'
                ? 'bg-[#FFEE00] text-black font-extrabold shadow border border-black/10'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 font-bold'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Apartado Admin</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-5 mt-3 p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800/60 rounded-xl flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-5 mt-3 p-3 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* APARTADO DE USUARIO */}
          {activeSection === 'user' && (
            <div className="space-y-4">
              {/* Formulario Principal de Inicio de Sesión de Usuario */}
              {!isRegisterBoxActive && (
                <form onSubmit={handleUserLogin} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-amber-500 dark:text-[#FFEE00]" />
                      Iniciar Sesión de Atleta
                    </span>
                    <span className="text-[11px] text-zinc-500">Acceso con teléfono</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Número de teléfono
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 612 345 678"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="Tu contraseña simple"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase tracking-wide rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#FFEE00]/25 active:scale-[0.99] border border-black/10"
                  >
                    Entrar a mi cuenta
                  </button>
                </form>
              )}

              {/* CASILLA DE REGISTRO ABAJO */}
              <div
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isRegisterBoxActive
                    ? 'bg-amber-50/60 dark:bg-[#18181f] border-2 border-amber-400 dark:border-[#FFEE00] shadow-md dark:shadow-lg dark:shadow-[#FFEE00]/10 p-4'
                    : 'bg-zinc-50 dark:bg-[#0f0f13] border border-zinc-200 dark:border-[#292934] hover:border-amber-400 dark:hover:border-zinc-500 p-3.5'
                }`}
              >
                {/* Header interactivo de la Casilla */}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterBoxActive(!isRegisterBoxActive);
                    setError(null);
                  }}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        isRegisterBoxActive
                          ? 'bg-[#FFEE00] text-black border border-black/20'
                          : 'border-2 border-zinc-400 group-hover:border-amber-500 dark:group-hover:border-[#FFEE00]'
                      }`}
                    >
                      {isRegisterBoxActive ? (
                        <CheckSquare className="w-4 h-4 text-black" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-transparent" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#FFEE00] transition-colors block">
                        Casilla de Registro de Usuario
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {isRegisterBoxActive
                          ? 'Completar datos de registro ligero'
                          : 'Pulsa aquí para marcar esta casilla y registrarte'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors ${
                      isRegisterBoxActive
                        ? 'bg-[#FFEE00] text-black border border-black/10'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 group-hover:bg-amber-100 dark:group-hover:text-white'
                    }`}
                  >
                    {isRegisterBoxActive ? 'Casilla Activa' : 'Abrir Casilla'}
                  </span>
                </button>

                {/* Formulario contenido dentro de la Casilla de Registro abajo */}
                {isRegisterBoxActive && (
                  <form onSubmit={handleRegister} className="mt-4 pt-3 border-t border-amber-200 dark:border-[#2a2a35] space-y-3 animate-in fade-in duration-200">
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      Registro ligero de atleta: solo necesitas tu nombre, teléfono y una clave simple.
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Tu nombre completo *
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Ej. Mateo Silva"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-white dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Número de teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="Ej. 612 345 678"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full bg-white dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Contraseña simple *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          placeholder="Clave fácil de recordar"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-white dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase tracking-wide rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#FFEE00]/25 active:scale-[0.99] border border-black/10"
                    >
                      Completar Registro en la Casilla
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setIsRegisterBoxActive(false)}
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white underline"
                      >
                        ¿Ya tienes cuenta? Volver a Iniciar Sesión arriba
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* APARTADO DE ADMINISTRADOR */}
          {activeSection === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Usuario Administrador
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Usuario de administrador"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#272730] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase tracking-wide rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#FFEE00]/25 active:scale-[0.99] border border-black/10"
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
