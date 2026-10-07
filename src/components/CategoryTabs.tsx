import React, { useRef } from 'react';
import { useMobility } from '../context/MobilityContext';
import { useAuth } from '../context/AuthContext';
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';

interface CategoryTabsProps {
  onOpenNewTabModal: () => void;
  onEditTab: (tabId: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  onOpenNewTabModal,
  onEditTab,
}) => {
  const { tabs, activeSection, activeTabId, setActiveTabId, deleteTab, exercises } = useMobility();
  const { isAdmin } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter tabs for the active section
  const sectionTabs = tabs.filter((t) => t.section === activeSection);
  const activeTab = sectionTabs.find((t) => t.id === activeTabId) || sectionTabs[0];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleDeleteTab = (tabId: string, tabName: string) => {
    const exercisesInTab = exercises.filter((e) => e.tabId === tabId).length;
    const confirmMsg = exercisesInTab > 0
      ? `¿Estás seguro de eliminar "${tabName}"? También se eliminarán los ${exercisesInTab} ejercicios contenidos en esta pestaña.`
      : `¿Eliminar la pestaña "${tabName}"?`;

    if (window.confirm(confirmMsg)) {
      deleteTab(tabId);
    }
  };

  return (
    <div className="bg-[#0c0c0e] border-b border-[#22222a] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Scroll Left button */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex p-2 text-zinc-400 hover:text-white bg-[#141419] hover:bg-[#1f1f26] border border-[#262630] rounded-xl shrink-0 transition-colors"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Sub-tabs horizontal scroll container */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sectionTabs.map((tab) => {
              const isSelected = tab.id === activeTabId;
              const count = exercises.filter((e) => e.tabId === tab.id).length;

              return (
                <div key={tab.id} className="relative group shrink-0 flex items-center">
                  <button
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all select-none border ${
                      isSelected
                        ? 'bg-[#FFEE00] text-black border-[#FFEE00] shadow-md shadow-[#FFEE00]/20 font-extrabold'
                        : 'bg-[#141419] text-zinc-300 border-[#252530] hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <span
                      className={`text-[10px] font-sans px-1.5 py-0.5 rounded-md tabular-nums ${
                        isSelected
                          ? 'bg-black/20 text-black font-black'
                          : 'bg-[#202028] text-zinc-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>

                  {/* Admin inline quick actions */}
                  {isAdmin && (
                    <div className="hidden group-hover:flex items-center gap-1 ml-1 bg-[#1a1a22] border border-[#30303c] rounded-lg p-1 shadow-lg shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTab(tab.id);
                        }}
                        className="p-1 text-zinc-300 hover:text-[#FFEE00] hover:bg-zinc-800 rounded transition-colors"
                        title="Editar nombre de pestaña"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {sectionTabs.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTab(tab.id, tab.name);
                          }}
                          className="p-1 text-zinc-300 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                          title="Eliminar pestaña"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Admin Add Tab button right inside the tab bar! */}
            {isAdmin && (
              <button
                onClick={onOpenNewTabModal}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1c1b12] text-[#FFEE00] border border-dashed border-[#FFEE00]/50 hover:bg-[#FFEE00] hover:text-black hover:border-solid hover:border-[#FFEE00] transition-all"
                title="Crear nueva pestaña de movilidad"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nueva Pestaña</span>
              </button>
            )}
          </div>

          {/* Scroll Right button */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex p-2 text-zinc-400 hover:text-white bg-[#141419] hover:bg-[#1f1f26] border border-[#262630] rounded-xl shrink-0 transition-colors"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab description text if present */}
        {activeTab?.description && (
          <div className="mt-3 pt-2 border-t border-[#1d1d24] flex items-center justify-between text-xs text-zinc-400">
            <p className="line-clamp-1 italic text-zinc-400">
              <span className="text-[#FFEE00] font-semibold not-italic mr-1.5">Objetivo:</span>
              {activeTab.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
