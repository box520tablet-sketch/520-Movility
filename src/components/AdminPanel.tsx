import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMobility } from '../context/MobilityContext';
import { Exercise } from '../types';
import {
  X,
  Shield,
  Layers,
  Dumbbell,
  Users,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RotateCcw,
  Search,
  Phone
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewExercise: () => void;
  onOpenNewTab: () => void;
  onEditExercise: (ex: Exercise) => void;
  onEditTab: (tabId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onOpenNewExercise,
  onOpenNewTab,
  onEditExercise,
  onEditTab,
}) => {
  const { users, deleteUser } = useAuth();
  const { tabs, exercises, deleteTab, deleteExercise, resetToDefaults } = useMobility();

  const [activeTab, setActiveTab] = useState<'exercises' | 'tabs' | 'users' | 'settings'>('exercises');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  if (!isOpen) return null;

  const filteredExercises = exercises.filter((ex) =>
    ex.title.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.equipment.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.targetFocus.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-[#262632] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Top yellow banner */}
        <div className="h-1.5 w-full bg-[#FFEE00]" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-[#22222a] bg-zinc-50 dark:bg-[#0c0c0e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-[#FFEE00]/10 border border-amber-300 dark:border-[#FFEE00]/40 text-black dark:text-[#FFEE00]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                  Panel de Control 520
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFEE00] text-black uppercase border border-black/10">
                  Admin
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Gestiona pestañas de movilidad, videos de YouTube y atletas registrados
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top stats summary */}
        <div className="grid grid-cols-3 bg-zinc-100/70 dark:bg-[#0a0a0d] border-b border-zinc-200 dark:border-[#202028] text-center text-xs py-3 px-4">
          <div>
            <span className="text-zinc-600 dark:text-zinc-500 block">Pestañas activas</span>
            <span className="font-display text-xl font-bold text-zinc-900 dark:text-white tabular-nums">{tabs.length}</span>
          </div>
          <div className="border-x border-zinc-200 dark:border-[#202028]">
            <span className="text-zinc-600 dark:text-zinc-500 block">Ejercicios con video</span>
            <span className="font-display text-xl font-bold text-amber-600 dark:text-[#FFEE00] tabular-nums">{exercises.length}</span>
          </div>
          <div>
            <span className="text-zinc-600 dark:text-zinc-500 block">Usuarios registrados</span>
            <span className="font-display text-xl font-bold text-zinc-900 dark:text-white tabular-nums">{users.length}</span>
          </div>
        </div>

        {/* Admin Navigation Sub-tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-200 dark:border-[#202028] bg-zinc-50 dark:bg-[#0e0e12] overflow-x-auto">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'exercises'
                ? 'bg-[#FFEE00] text-black shadow border border-black/10'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Ejercicios ({exercises.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tabs')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'tabs'
                ? 'bg-[#FFEE00] text-black shadow border border-black/10'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pestañas ({tabs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'users'
                ? 'bg-[#FFEE00] text-black shadow border border-black/10'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Usuarios Atletas ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'settings'
                ? 'bg-[#FFEE00] text-black shadow border border-black/10'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ajustes & Reset</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-zinc-50/50 dark:bg-[#121216]">
          {/* 1. EXERCISES MANAGEMENT */}
          {activeTab === 'exercises' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar ejercicio por nombre, material o enfoque..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="w-full bg-white dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#252530] focus:border-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
                  />
                </div>

                <button
                  onClick={onOpenNewExercise}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FFEE00]/20 border border-black/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Ejercicio</span>
                </button>
              </div>

              {/* Exercises Table */}
              <div className="border border-zinc-200 dark:border-[#22222a] rounded-2xl overflow-hidden bg-white dark:bg-[#0c0c0e] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
                    <thead className="bg-zinc-50 dark:bg-[#141419] text-zinc-600 dark:text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200 dark:border-[#22222a]">
                      <tr>
                        <th className="py-3 px-4">Ejercicio</th>
                        <th className="py-3 px-4">Categoría / Pestaña</th>
                        <th className="py-3 px-4">Duración</th>
                        <th className="py-3 px-4">Material</th>
                        <th className="py-3 px-4">YouTube</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-[#1e1e26]">
                      {filteredExercises.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-zinc-500">
                            No se encontraron ejercicios con ese criterio.
                          </td>
                        </tr>
                      ) : (
                        filteredExercises.map((ex) => {
                          const tabObj = tabs.find((t) => t.id === ex.tabId);
                          return (
                            <tr key={ex.id} className="hover:bg-zinc-50 dark:hover:bg-[#15151c] transition-colors">
                              <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                                {ex.title}
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-zinc-900 dark:text-[#FFEE00] font-semibold">
                                  {tabObj ? tabObj.name : ex.tabId}
                                </span>
                                <span className="text-zinc-500 block text-[10px]">
                                  {ex.section === 'general' ? 'Movilidad General' : 'Por Movimiento'}
                                </span>
                              </td>
                              <td className="py-3 px-4 tabular-nums">
                                {Math.floor(ex.durationSeconds / 60)}:
                                {(ex.durationSeconds % 60).toString().padStart(2, '0')}
                                {ex.hasSides && ' / lado'}
                              </td>
                              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{ex.equipment}</td>
                              <td className="py-3 px-4">
                                <a
                                  href={ex.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                >
                                  Ver <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onEditExercise(ex)}
                                    className="p-1.5 hover:text-black dark:hover:text-[#FFEE00] hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                                    title="Editar"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`¿Eliminar "${ex.title}"?`)) {
                                        deleteExercise(ex.id);
                                      }
                                    }}
                                    className="p-1.5 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. TABS MANAGEMENT */}
          {activeTab === 'tabs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Pestañas de navegación para organizar las rutinas en Movilidad General y Por Movimiento
                </p>
                <button
                  onClick={onOpenNewTab}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FFEE00]/20 border border-black/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Nueva Pestaña</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* General Tabs Column */}
                <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-[#22222a] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-[#202028] mb-3">
                    <span className="font-display text-base font-bold uppercase text-zinc-900 dark:text-white">
                      Movilidad General
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
                      {tabs.filter((t) => t.section === 'general').length} pestañas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tabs
                      .filter((t) => t.section === 'general')
                      .map((tab) => {
                        const count = exercises.filter((e) => e.tabId === tab.id).length;
                        return (
                          <div
                            key={tab.id}
                            className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-[#141419] rounded-xl border border-zinc-200 dark:border-[#202028]"
                          >
                            <div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-white block">{tab.name}</span>
                              <span className="text-[10px] text-zinc-500">{count} ejercicios</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onEditTab(tab.id)}
                                className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-[#FFEE00] rounded-lg transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`¿Eliminar la pestaña "${tab.name}"?`)) {
                                    deleteTab(tab.id);
                                  }
                                }}
                                className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Movement Tabs Column */}
                <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-[#22222a] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-[#202028] mb-3">
                    <span className="font-display text-base font-bold uppercase text-zinc-900 dark:text-white">
                      Movilidad por Movimiento
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
                      {tabs.filter((t) => t.section === 'movement').length} pestañas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tabs
                      .filter((t) => t.section === 'movement')
                      .map((tab) => {
                        const count = exercises.filter((e) => e.tabId === tab.id).length;
                        return (
                          <div
                            key={tab.id}
                            className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-[#141419] rounded-xl border border-zinc-200 dark:border-[#202028]"
                          >
                            <div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-white block">{tab.name}</span>
                              <span className="text-[10px] text-zinc-500">{count} ejercicios</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onEditTab(tab.id)}
                                className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-[#FFEE00] rounded-lg transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`¿Eliminar la pestaña "${tab.name}"?`)) {
                                    deleteTab(tab.id);
                                  }
                                }}
                                className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar atleta por nombre o teléfono..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-white dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#252530] focus:border-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
                  />
                </div>
              </div>

              <div className="border border-zinc-200 dark:border-[#22222a] rounded-2xl overflow-hidden bg-white dark:bg-[#0c0c0e] shadow-sm">
                <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
                  <thead className="bg-zinc-50 dark:bg-[#141419] text-zinc-600 dark:text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200 dark:border-[#22222a]">
                    <tr>
                      <th className="py-3 px-4">Atleta</th>
                      <th className="py-3 px-4">Teléfono</th>
                      <th className="py-3 px-4">Fecha Registro</th>
                      <th className="py-3 px-4">Rutinas Hechas</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-[#1e1e26]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-500">
                          No hay usuarios registrados que coincidan.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-[#15151c] transition-colors">
                          <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs text-black dark:text-[#FFEE00] font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            {u.name}
                          </td>
                          <td className="py-3 px-4 font-mono text-zinc-800 dark:text-zinc-300">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-500 dark:text-[#FFEE00]" />
                              {u.phone}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 tabular-nums">
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-[#FFEE00]/15 text-zinc-900 dark:text-[#FFEE00] font-bold border border-amber-300 dark:border-[#FFEE00]/30">
                              {u.routinesCompleted} rutinas
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar la cuenta del usuario ${u.name}?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. SETTINGS & RESET */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              <div className="p-5 bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#23232c] rounded-2xl space-y-3 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase text-zinc-900 dark:text-white">
                  Restaurar Datos de Demostración
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Si deseas volver a cargar todas las pestañas de CrossFit iniciales (Hombro, Torácica, Muñeca, Cadera, Snatch, Squat Clean, Overhead Squat, HSPU) y sus videos de YouTube de demostración, pulsa el botón a continuación.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('¿Deseas restaurar todos los ejercicios y pestañas a los valores originales predeterminados?')) {
                      resetToDefaults();
                      alert('Datos restaurados con éxito.');
                    }
                  }}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-[#FFEE00] font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restaurar contenido predeterminado</span>
                </button>
              </div>

              <div className="p-5 bg-amber-50 dark:bg-[#1a1910] border border-amber-300 dark:border-[#FFEE00]/30 rounded-2xl space-y-2 text-xs text-zinc-800 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-[#FFEE00] block uppercase tracking-wide">
                  Seguridad de Administrador:
                </span>
                <p className="text-zinc-600 dark:text-zinc-400">
                  El rol de administrador te otorga permisos exclusivos para insertar videos de YouTube, crear y eliminar pestañas tanto en Movilidad General como Por Movimiento, y consultar el listado de atletas registrados.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
