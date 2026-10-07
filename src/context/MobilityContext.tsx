import React, { createContext, useContext, useState, useEffect } from 'react';
import { CategoryTab, Exercise, SectionType } from '../types';
import { INITIAL_TABS, INITIAL_EXERCISES } from '../data/initialData';

interface MobilityContextType {
  tabs: CategoryTab[];
  exercises: Exercise[];
  activeSection: SectionType;
  setActiveSection: (sec: SectionType) => void;
  activeTabId: string;
  setActiveTabId: (tabId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterEquipment: string;
  setFilterEquipment: (eq: string) => void;
  // Tab CRUD
  addTab: (name: string, section: SectionType, description?: string) => CategoryTab;
  editTab: (tabId: string, updates: Partial<CategoryTab>) => void;
  deleteTab: (tabId: string) => void;
  // Exercise CRUD
  addExercise: (data: Omit<Exercise, 'id' | 'createdAt'>) => Exercise;
  editExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_TABS_KEY = '520_movility_tabs_v2';
const STORAGE_EXERCISES_KEY = '520_movility_exercises_v2';

const MobilityContext = createContext<MobilityContextType | undefined>(undefined);

export const MobilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<CategoryTab[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_TABS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_TABS;
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_EXERCISES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_EXERCISES;
  });

  const [activeSection, setActiveSection] = useState<SectionType>('general');
  const [activeTabId, setActiveTabId] = useState<string>('hombro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterEquipment, setFilterEquipment] = useState<string>('all');

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TABS_KEY, JSON.stringify(tabs));
    } catch {
      // ignore
    }
  }, [tabs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXERCISES_KEY, JSON.stringify(exercises));
    } catch {
      // ignore
    }
  }, [exercises]);

  // When activeSection changes, if current activeTabId is not in activeSection, pick first tab of new section
  useEffect(() => {
    const tabsForSection = tabs.filter((t) => t.section === activeSection);
    const hasCurrent = tabsForSection.some((t) => t.id === activeTabId);
    if (!hasCurrent && tabsForSection.length > 0) {
      setActiveTabId(tabsForSection[0].id);
    }
  }, [activeSection, tabs, activeTabId]);

  const addTab = (name: string, section: SectionType, description?: string): CategoryTab => {
    const cleanName = name.trim();
    const id = `tab-${Date.now()}`;
    const sectionTabs = tabs.filter((t) => t.section === section);
    const newTab: CategoryTab = {
      id,
      name: cleanName,
      section,
      description: description?.trim() || '',
      order: sectionTabs.length + 1,
      isCustom: true,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveSection(section);
    setActiveTabId(id);
    return newTab;
  };

  const editTab = (tabId: string, updates: Partial<CategoryTab>) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab))
    );
  };

  const deleteTab = (tabId: string) => {
    // Delete tab
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    // Also remove or reassign exercises of this tab
    setExercises((prev) => prev.filter((e) => e.tabId !== tabId));
  };

  const addExercise = (data: Omit<Exercise, 'id' | 'createdAt'>): Exercise => {
    const newExercise: Exercise = {
      ...data,
      id: `ex-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setExercises((prev) => [newExercise, ...prev]);
    return newExercise;
  };

  const editExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex))
    );
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const resetToDefaults = () => {
    setTabs(INITIAL_TABS);
    setExercises(INITIAL_EXERCISES);
    setActiveSection('general');
    setActiveTabId('hombro');
    localStorage.removeItem(STORAGE_TABS_KEY);
    localStorage.removeItem(STORAGE_EXERCISES_KEY);
  };

  return (
    <MobilityContext.Provider
      value={{
        tabs,
        exercises,
        activeSection,
        setActiveSection,
        activeTabId,
        setActiveTabId,
        searchQuery,
        setSearchQuery,
        filterEquipment,
        setFilterEquipment,
        addTab,
        editTab,
        deleteTab,
        addExercise,
        editExercise,
        deleteExercise,
        resetToDefaults,
      }}
    >
      {children}
    </MobilityContext.Provider>
  );
};

export const useMobility = () => {
  const context = useContext(MobilityContext);
  if (!context) {
    throw new Error('useMobility must be used within a MobilityProvider');
  }
  return context;
};
