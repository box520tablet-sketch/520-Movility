/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobilityProvider, useMobility } from './context/MobilityContext';
import { Header } from './components/Header';
import { SectionNav } from './components/SectionNav';
import { CategoryTabs } from './components/CategoryTabs';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseModal } from './components/ExerciseModal';
import { TabModal } from './components/TabModal';
import { TimerModal } from './components/TimerModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { Exercise, SectionType } from './types';
import {
  Search,
  Filter,
  Plus,
  Star,
  Dumbbell,
  Clock,
  Sparkles,
  Flame,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const {
    tabs,
    exercises,
    activeSection,
    activeTabId,
    searchQuery,
    setSearchQuery,
    filterEquipment,
    setFilterEquipment,
  } = useMobility();

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isTabModalOpen, setIsTabModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [activeTimerExercise, setActiveTimerExercise] = useState<Exercise | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Current active tab object
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Must match active section
      if (ex.section !== activeSection) return false;

      // Must match active tab
      if (ex.tabId !== activeTabId) return false;

      // Favorites filter
      if (showOnlyFavorites) {
        if (!currentUser?.favoriteIds?.includes(ex.id)) return false;
      }

      // Equipment filter
      if (filterEquipment !== 'all') {
        if (ex.equipment.toLowerCase() !== filterEquipment.toLowerCase()) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ex.title.toLowerCase().includes(query);
        const matchesEquip = ex.equipment.toLowerCase().includes(query);
        const matchesFocus = ex.targetFocus.toLowerCase().includes(query);
        const matchesDesc = ex.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesEquip && !matchesFocus && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [exercises, activeSection, activeTabId, showOnlyFavorites, filterEquipment, searchQuery, currentUser]);

  // Handlers
  const handleOpenNewExercise = () => {
    setEditingExercise(null);
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleOpenNewTab = () => {
    setEditingTabId(null);
    setIsTabModalOpen(true);
  };

  const handleEditTab = (tabId: string) => {
    setEditingTabId(tabId);
    setIsTabModalOpen(true);
  };

  const handleStartTimer = (exercise: Exercise) => {
    setActiveTimerExercise(exercise);
  };

  // Distinct equipment list for quick filter bar
  const equipmentOptions = useMemo(() => {
    const set = new Set<string>();
    exercises
      .filter((e) => e.section === activeSection && e.tabId === activeTabId)
      .forEach((e) => set.add(e.equipment));
    return Array.from(set);
  }, [exercises, activeSection, activeTabId]);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col selection:bg-[#FFEE00] selection:text-black">
      {/* Top Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenNewExercise={handleOpenNewExercise}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* Hero / Brand Banner */}
      <section className="bg-gradient-to-b from-[#141419] via-[#0f0f13] to-[#0c0c0e] border-b border-[#202028] py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle athletic yellow ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFEE00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-[#FFEE00] text-black">
                  Movilidad CrossFit
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  Rango Articular & Preparación de WOD
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
                PREPARA TUS ARTICULACIONES.{' '}
                <span className="text-[#FFEE00] block sm:inline">DOMINA EL MOVIMIENTO.</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                Selecciona tu enfoque de movilidad diaria o prepara tu cuerpo específicamente para el movimiento del WOD con videos guiados paso a paso y temporizador de intervalos integrado.
              </p>
            </div>

            {/* Quick user welcome or promo badge */}
            <div className="flex items-center gap-3 bg-[#17171e]/90 p-3 sm:p-4 rounded-2xl border border-[#272733] shrink-0 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FFEE00]/10 border border-[#FFEE00]/40 flex items-center justify-center text-[#FFEE00]">
                <Flame className="w-5 h-5 text-[#FFEE00]" />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block font-medium">
                  {currentUser ? `Atleta: ${currentUser.name}` : 'Sesión rápida'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  {currentUser?.role === 'admin' ? (
                    <span className="text-[#FFEE00]">Modo Administrador Activo</span>
                  ) : (
                    <span>
                      {currentUser ? `${currentUser.routinesCompleted} rutinas realizadas` : 'Regístrate para guardar tu racha'}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Navigation (Movilidad General vs Movilidad por Movimiento) */}
      <SectionNav />

      {/* Sub-tabs horizontal bar (Hombro, Torácica, Muñeca, Cadera, Snatch, Squat Clean, etc.) */}
      <CategoryTabs
        onOpenNewTabModal={handleOpenNewTab}
        onEditTab={handleEditTab}
      />

      {/* Filters & Search Toolbar */}
      <section className="bg-[#0f0f13] border-b border-[#1f1f26] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Active Tab Heading */}
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <span className="text-[#FFEE00]">{currentTab?.name || 'Movilidad'}</span>
              <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-[#1c1c24] text-zinc-400 border border-[#2b2b36]">
                {filteredExercises.length} {filteredExercises.length === 1 ? 'ejercicio' : 'ejercicios'}
              </span>
            </h2>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar ejercicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141419] border border-[#272733] focus:border-[#FFEE00] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>

            {/* Equipment Filter Dropdown */}
            {equipmentOptions.length > 0 && (
              <select
                value={filterEquipment}
                onChange={(e) => setFilterEquipment(e.target.value)}
                className="bg-[#141419] border border-[#272733] focus:border-[#FFEE00] text-xs font-medium text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="all">Todo el material</option>
                {equipmentOptions.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            )}

            {/* Favorites filter toggle */}
            {currentUser && (
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  showOnlyFavorites
                    ? 'bg-[#FFEE00]/15 border-[#FFEE00] text-[#FFEE00]'
                    : 'bg-[#141419] border-[#272733] text-zinc-400 hover:text-white'
                }`}
                title="Mostrar solo favoritos"
              >
                <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-[#FFEE00]' : ''}`} />
                <span className="hidden sm:inline">Favoritos</span>
              </button>
            )}

            {/* Admin Add Exercise Shortcut */}
            {isAdmin && (
              <button
                onClick={handleOpenNewExercise}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-[#FFEE00]/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Añadir</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Exercise Content Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onStartTimer={handleStartTimer}
                onEdit={handleEditExercise}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#141419] border border-[#252530] flex items-center justify-center text-zinc-600">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold uppercase text-white">
                No hay ejercicios en esta pestaña
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {searchQuery || filterEquipment !== 'all' || showOnlyFavorites
                  ? 'Prueba a cambiar o limpiar los filtros de búsqueda.'
                  : 'Aún no se han añadido videos a esta categoría de movilidad.'}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={handleOpenNewExercise}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase text-xs tracking-wider transition-all shadow-md shadow-[#FFEE00]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Subir primer ejercicio con YouTube</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* Athletic Footer */}
      <footer className="mt-auto border-t border-[#1f1f26] bg-[#09090b] py-6 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-black text-white">
              520 <span className="text-[#FFEE00]">MOVILITY</span>
            </span>
            <span>· App de movilidad articular para atletas de CrossFit</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Color temático: #FFEE00 & Negro</span>
            {isAdmin ? (
              <span className="text-[#FFEE00] font-bold">Sesión Admin (admin520)</span>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-zinc-400 hover:text-[#FFEE00] underline transition-colors"
              >
                Acceso Administrador (admin520)
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        initialExercise={editingExercise}
        defaultSection={activeSection}
        defaultTabId={activeTabId}
      />

      <TabModal
        isOpen={isTabModalOpen}
        onClose={() => setIsTabModalOpen(false)}
        defaultSection={activeSection}
        editingTabId={editingTabId}
      />

      <TimerModal
        exercise={activeTimerExercise}
        onClose={() => setActiveTimerExercise(null)}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onOpenNewExercise={handleOpenNewExercise}
        onOpenNewTab={handleOpenNewTab}
        onEditExercise={handleEditExercise}
        onEditTab={handleEditTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MobilityProvider>
        <MainAppContent />
      </MobilityProvider>
    </AuthProvider>
  );
}
