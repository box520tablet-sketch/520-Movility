import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, User as UserIcon, LogOut, Flame, Plus, Wrench, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenNewExercise: () => void;
  onOpenAdminPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenNewExercise,
  onOpenAdminPanel,
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-b border-zinc-200 dark:border-[#23232a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black border-2 border-[#FFEE00] flex items-center justify-center shadow-[0_0_15px_rgba(255,238,0,0.25)] shrink-0">
              <span className="font-display text-2xl sm:text-3xl font-black text-[#FFEE00] tracking-tighter">
                520
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                  520 <span className="text-[#eab308] dark:text-[#FFEE00]">MOVILITY</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFEE00]/25 text-zinc-900 dark:text-[#FFEE00] border border-[#FFEE00]/50 rounded">
                  CrossFit WOD Ready
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
                Tu protocolo de movilidad articular & preparación de movimiento
              </p>
            </div>
          </div>

          {/* User & Admin controls + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#18181f] dark:hover:bg-[#252530] text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-[#2c2c38] transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-[#FFEE00]" />
                  <span className="hidden md:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-zinc-900" />
                  <span className="hidden md:inline">Oscuro</span>
                </>
              )}
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={onOpenNewExercise}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold bg-[#FFEE00] text-black hover:bg-[#fff233] transition-all rounded-lg shadow-sm shadow-[#FFEE00]/20 active:scale-95 border border-black/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Ejercicio</span>
                </button>

                <button
                  onClick={onOpenAdminPanel}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1d1d23] dark:hover:bg-[#272730] text-zinc-900 dark:text-[#FFEE00] border border-zinc-300 dark:border-[#FFEE00]/40 rounded-lg transition-all"
                  title="Panel de Administración"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Panel Admin</span>
                </button>
              </>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-zinc-200 dark:border-[#272730]">
                {isAdmin ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFEE00]/20 dark:bg-[#FFEE00]/10 border border-[#FFEE00] dark:border-[#FFEE00]/50 rounded-lg text-xs font-black text-black dark:text-[#FFEE00]">
                    <Shield className="w-3.5 h-3.5 text-black dark:text-[#FFEE00]" />
                    <span className="hidden sm:inline">ADMIN 520</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[120px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-end gap-1">
                        <Flame className="w-3 h-3 text-[#eab308] dark:text-[#FFEE00]" />
                        {currentUser.routinesCompleted} completadas
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-800 dark:text-zinc-300">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}

                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold bg-[#FFEE00] text-black hover:bg-[#fff233] transition-all rounded-lg shadow-sm shadow-[#FFEE00]/20 border border-black/10"
              >
                <UserIcon className="w-4 h-4" />
                <span>Entrar / Registro</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
