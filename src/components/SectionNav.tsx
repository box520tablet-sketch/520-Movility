import React from 'react';
import { useMobility } from '../context/MobilityContext';
import { Dumbbell, Activity } from 'lucide-react';

export const SectionNav: React.FC = () => {
  const { activeSection, setActiveSection, tabs, exercises } = useMobility();

  const generalTabsCount = tabs.filter((t) => t.section === 'general').length;
  const movementTabsCount = tabs.filter((t) => t.section === 'movement').length;

  const generalExercisesCount = exercises.filter((e) => e.section === 'general').length;
  const movementExercisesCount = exercises.filter((e) => e.section === 'movement').length;

  return (
    <div className="w-full bg-zinc-100/70 dark:bg-[#101014] border-b border-zinc-200 dark:border-[#22222a] py-3 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main sections side by side as required */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-zinc-200/80 dark:bg-[#0a0a0d] p-1.5 rounded-2xl border border-zinc-300 dark:border-[#23232c] max-w-xl w-full">
            <button
              onClick={() => setActiveSection('general')}
              className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display uppercase tracking-wide text-sm sm:text-base transition-all select-none ${
                activeSection === 'general'
                  ? 'bg-[#FFEE00] text-black font-extrabold shadow-md shadow-[#FFEE00]/25 border border-black/10'
                  : 'text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-white/70 dark:hover:bg-zinc-800/60 font-bold'
              }`}
            >
              <Activity className={`w-4 h-4 ${activeSection === 'general' ? 'text-black' : 'text-zinc-900 dark:text-[#FFEE00]'}`} />
              <span className="truncate">Movilidad General</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md font-sans font-bold tabular-nums ml-1 ${
                  activeSection === 'general'
                    ? 'bg-black/20 text-black'
                    : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300'
                }`}
              >
                {generalTabsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('movement')}
              className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display uppercase tracking-wide text-sm sm:text-base transition-all select-none ${
                activeSection === 'movement'
                  ? 'bg-[#FFEE00] text-black font-extrabold shadow-md shadow-[#FFEE00]/25 border border-black/10'
                  : 'text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-white/70 dark:hover:bg-zinc-800/60 font-bold'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${activeSection === 'movement' ? 'text-black' : 'text-zinc-900 dark:text-[#FFEE00]'}`} />
              <span className="truncate">Por Movimiento</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md font-sans font-bold tabular-nums ml-1 ${
                  activeSection === 'movement'
                    ? 'bg-black/20 text-black'
                    : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300'
                }`}
              >
                {movementTabsCount}
              </span>
            </button>
          </div>

          {/* Quick info caption */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFEE00] border border-black/20" />
              <span>
                {activeSection === 'general'
                  ? `${generalExercisesCount} ejercicios articulares activos`
                  : `${movementExercisesCount} preparaciones de halterofilia y gimnásticos`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
