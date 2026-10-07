import React, { useState, useEffect } from 'react';
import { SectionType } from '../types';
import { useMobility } from '../context/MobilityContext';
import { X, Layers, AlertCircle } from 'lucide-react';

interface TabModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSection?: SectionType;
  editingTabId?: string | null;
}

export const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  onClose,
  defaultSection = 'general',
  editingTabId,
}) => {
  const { tabs, addTab, editTab } = useMobility();

  const [name, setName] = useState('');
  const [section, setSection] = useState<SectionType>(defaultSection);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingTabId) {
      const existing = tabs.find((t) => t.id === editingTabId);
      if (existing) {
        setName(existing.name);
        setSection(existing.section);
        setDescription(existing.description || '');
      }
    } else {
      setName('');
      setSection(defaultSection);
      setDescription('');
    }
    setError(null);
  }, [editingTabId, defaultSection, isOpen, tabs]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Por favor indica el nombre de la pestaña');
      return;
    }

    if (editingTabId) {
      editTab(editingTabId, {
        name: cleanName,
        section,
        description: description.trim(),
      });
    } else {
      addTab(cleanName, section, description.trim());
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131317] border border-[#2a2a34] rounded-3xl shadow-2xl overflow-hidden">
        {/* Yellow header strip */}
        <div className="h-1.5 w-full bg-[#FFEE00]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FFEE00]" />
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
              {editingTabId ? 'Editar Pestaña' : 'Nueva Pestaña'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mb-2 p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 pt-2 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Categoría Principal
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#0a0a0d] p-1 rounded-xl border border-[#222228]">
              <button
                type="button"
                onClick={() => setSection('general')}
                className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                  section === 'general'
                    ? 'bg-[#FFEE00] text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Movilidad General
              </button>
              <button
                type="button"
                onClick={() => setSection('movement')}
                className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                  section === 'movement'
                    ? 'bg-[#FFEE00] text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Por Movimiento
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Nombre de la pestaña *
            </label>
            <input
              type="text"
              required
              placeholder={
                section === 'general'
                  ? 'Ej. Movilidad de Tobillo, Isquiotibiales...'
                  : 'Ej. Movilidad para Thrusters, Pistols, Muscle-Up...'
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0d] border border-[#262630] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Descripción u objetivo (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Mejora de rotación, rango articular o transferencia al levantamiento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0a0d] border border-[#262630] focus:border-[#FFEE00] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FFEE00]/25"
            >
              {editingTabId ? 'Guardar Cambios' : 'Crear Pestaña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
