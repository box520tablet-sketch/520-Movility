import React from 'react';
import { useMobility } from '../context/MobilityContext';
import { SectionType } from '../types';
import { Dumbbell, Activity } from 'lucide-react';

export const SectionNav: React.FC = () => {
  const { activeSection, setActiveSection, tabs, exercises } = useMobility();

  const generalTabsCount = tabs.filter((t) => t.section === 'general').length;
  const movementTabsCount = tabs.filter((t) => t.section === 'movement').length;

  const generalExercisesCount = exercises.filter((e) => e.section === 'general').length;
  const movementExercisesCount = exercises.filter((e) => e.section === 'movement').length;

  return (
    <div className="w-full bg-[#101014] border-b border-[#22222a] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main sections side by side as required */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-[#0a0a0d] p-1.5 rounded-2xl border border-[#23232c] max-w-xl w-full">
            <button
              onClick={() => setActiveSection('general')}
              className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display uppercase tracking-wide text-sm sm:text-base transition-all select-none ${
                activeSection === 'general'
                  ? 'bg-[#FFEE00] text-black font-extrabold shadow-md shadow-[#FFEE00]/15'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-bold'
              }`}
            >
              <Activity className={`w-4 h-4 ${activeSection === 'general' ? 'text-black' : 'text-[#FFEE00]'}`} />
              <span className="truncate">Movilidad General</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md font-sans font-bold tabular-nums ml-1 ${
                  activeSection === 'general'
                    ? 'bg-black/20 text-black'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {generalTabsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('movement')}
              className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display uppercase tracking-wide text-sm sm:text-base transition-all select-none ${
                activeSection === 'movement'
                  ? 'bg-[#FFEE00] text-black font-extrabold shadow-md shadow-[#FFEE00]/15'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-bold'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${activeSection === 'movement' ? 'text-black' : 'text-[#FFEE00]'}`} />
              <span className="truncate">Por Movimiento</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md font-sans font-bold tabular-nums ml-1 ${
                  activeSection === 'movement'
                    ? 'bg-black/20 text-black'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {movementTabsCount}
              </span>
            </button>
          </div>

          {/* Quick info caption */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFEE00]" />
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
