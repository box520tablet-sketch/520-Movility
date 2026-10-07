import React, { useState, useEffect } from 'react';
import { Exercise, SectionType } from '../types';
import { useMobility } from '../context/MobilityContext';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';
import { X, Youtube, Clock, Dumbbell, AlertCircle, Check } from 'lucide-react';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExercise?: Exercise | null;
  defaultSection?: SectionType;
  defaultTabId?: string;
}

const COMMON_EQUIPMENT = [
  'Sin material',
  'Pica / PVC',
  'Banda elástica',
  'Foam Roller',
  'Cajón / Banco',
  'Barra olímpica en rack',
  'Kettlebell',
  'Pelota Lacrosse',
];

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  initialExercise,
  defaultSection = 'general',
  defaultTabId,
}) => {
  const { tabs, addExercise, editExercise } = useMobility();

  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [section, setSection] = useState<SectionType>(defaultSection);
  const [tabId, setTabId] = useState<string>(defaultTabId || '');
  const [durationSeconds, setDurationSeconds] = useState<number>(90);
  const [hasSides, setHasSides] = useState<boolean>(true);
  const [equipment, setEquipment] = useState('Sin material');
  const [customEquipment, setCustomEquipment] = useState('');
  const [difficulty, setDifficulty] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>('Intermedio');
  const [targetFocus, setTargetFocus] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Available tabs for the selected section
  const sectionTabs = tabs.filter((t) => t.section === section);

  // Load initial data if editing
  useEffect(() => {
    if (initialExercise) {
      setTitle(initialExercise.title);
      setYoutubeUrl(initialExercise.youtubeUrl);
      setSection(initialExercise.section);
      setTabId(initialExercise.tabId);
      setDurationSeconds(initialExercise.durationSeconds);
      setHasSides(initialExercise.hasSides);
      if (COMMON_EQUIPMENT.includes(initialExercise.equipment)) {
        setEquipment(initialExercise.equipment);
        setCustomEquipment('');
      } else {
        setEquipment('Otro');
        setCustomEquipment(initialExercise.equipment);
      }
      setDifficulty(initialExercise.difficulty);
      setTargetFocus(initialExercise.targetFocus);
      setDescription(initialExercise.description);
    } else {
      // Defaults for new exercise
      setTitle('');
      setYoutubeUrl('');
      setSection(defaultSection);
      const defaultTab = sectionTabs.find((t) => t.id === defaultTabId) || sectionTabs[0];
      setTabId(defaultTab ? defaultTab.id : '');
      setDurationSeconds(90);
      setHasSides(true);
      setEquipment('Sin material');
      setCustomEquipment('');
      setDifficulty('Intermedio');
      setTargetFocus('');
      setDescription('');
    }
    setError(null);
  }, [initialExercise, isOpen, defaultSection, defaultTabId]);

  // Update tabId if section changes and tabId is no longer valid
  useEffect(() => {
    const valid = sectionTabs.some((t) => t.id === tabId);
    if (!valid && sectionTabs.length > 0) {
      setTabId(sectionTabs[0].id);
    }
  }, [section, sectionTabs, tabId]);

  if (!isOpen) return null;

  const videoId = extractYouTubeId(youtubeUrl);
  const isValidYouTube = !!videoId;
  const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(youtubeUrl, 'hq') : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanUrl = youtubeUrl.trim();

    if (!cleanTitle) {
      setError('Por favor introduce el nombre del ejercicio');
      return;
    }

    if (!cleanUrl || !isValidYouTube) {
      setError('Por favor introduce un enlace o link válido de YouTube (ej. https://www.youtube.com/watch?v=... o https://youtu.be/...)');
      return;
    }

    if (!tabId) {
      setError('Selecciona la pestaña donde quieres ubicar este ejercicio');
      return;
    }

    const finalEquipment = equipment === 'Otro' ? (customEquipment.trim() || 'Sin material') : equipment;

    if (initialExercise) {
      editExercise(initialExercise.id, {
        title: cleanTitle,
        youtubeUrl: cleanUrl,
        section,
        tabId,
        durationSeconds: Number(durationSeconds) || 90,
        hasSides,
        equipment: finalEquipment,
        difficulty,
        targetFocus: targetFocus.trim() || 'Movilidad articular',
        description: description.trim() || 'Sin instrucciones adicionales.',
      });
    } else {
      addExercise({
        title: cleanTitle,
        youtubeUrl: cleanUrl,
        section,
        tabId,
        durationSeconds: Number(durationSeconds) || 90,
        hasSides,
        equipment: finalEquipment,
        difficulty,
        targetFocus: targetFocus.trim() || 'Movilidad articular',
        description: description.trim() || 'Sin instrucciones adicionales.',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Accent strip */}
        <div className="h-1.5 w-full bg-[#FFEE00]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-[#202028] bg-zinc-50 dark:bg-[#0c0c0e]">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
              {initialExercise ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Agrega tu video de YouTube para que se incruste dentro de 520 Movility
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-800 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Exercise Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nombre del ejercicio *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Dislocaciones de Hombro con Pica"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          {/* YouTube URL input & Live Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-red-600" />
                Link de YouTube * (Se incrustará en la app)
              </span>
              {isValidYouTube && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono font-bold">
                  <Check className="w-3 h-3" /> ID: {videoId}
                </span>
              )}
            </label>
            <input
              type="text"
              required
              placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] focus:ring-1 focus:ring-[#FFEE00] rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors font-mono"
            />

            {/* Instant Video Thumbnail Preview */}
            {isValidYouTube && thumbnailUrl && (
              <div className="mt-3 p-3 bg-zinc-100 dark:bg-[#0a0a0d] border border-zinc-200 dark:border-[#252530] rounded-2xl flex items-center gap-3">
                <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-300 dark:border-zinc-800">
                  <img src={thumbnailUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-[9px] font-bold text-[#FFEE00] rounded">
                    OK
                  </span>
                </div>
                <div className="text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="font-bold text-zinc-900 dark:text-[#FFEE00] block">Video de YouTube detectado</span>
                  <span className="text-zinc-500 text-[11px] line-clamp-1">{youtubeUrl}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section & Destination Tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Categoría principal *
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as SectionType)}
                className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white outline-none"
              >
                <option value="general">Movilidad General</option>
                <option value="movement">Movilidad por Movimiento</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Pestaña de destino *
              </label>
              <select
                value={tabId}
                onChange={(e) => setTabId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white outline-none"
              >
                {sectionTabs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration & Sides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-[#FFEE00]" />
                Duración (segundos)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="15"
                  max="600"
                  step="15"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-white outline-none font-mono"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0 font-medium">
                  ({Math.floor(durationSeconds / 60)}m {durationSeconds % 60}s)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                ¿Requiere estiramiento bilateral?
              </label>
              <label className="flex items-center gap-2.5 bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] rounded-xl p-2.5 cursor-pointer hover:border-zinc-500 transition-colors">
                <input
                  type="checkbox"
                  checked={hasSides}
                  onChange={(e) => setHasSides(e.target.checked)}
                  className="w-4 h-4 accent-[#FFEE00] rounded"
                />
                <span className="text-xs text-zinc-800 dark:text-zinc-300 font-medium">
                  {hasSides ? 'Sí (Lado Izquierdo + Lado Derecho)' : 'No (Estiramiento continuo / Ambos lados)'}
                </span>
              </label>
            </div>
          </div>

          {/* Equipment & Focus Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-amber-500 dark:text-[#FFEE00]" />
                Material necesario
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white outline-none mb-2"
              >
                {COMMON_EQUIPMENT.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
                <option value="Otro">Otro material...</option>
              </select>
              {equipment === 'Otro' && (
                <input
                  type="text"
                  placeholder="Especificar material"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-white outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Enfoque o zona objetivo
              </label>
              <input
                type="text"
                placeholder="Ej. Cápsula anterior, Dorsiflexión"
                value={targetFocus}
                onChange={(e) => setTargetFocus(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
              />
            </div>
          </div>

          {/* Instructions / Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Instrucciones y puntos de técnica
            </label>
            <textarea
              rows={3}
              placeholder="Explica la postura correcta, respiración y qué sensación debe buscar el atleta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#0a0a0d] border border-zinc-300 dark:border-[#262630] focus:border-[#FFEE00] rounded-xl p-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-zinc-200 dark:border-[#22222a] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FFEE00]/25 active:scale-95 border border-black/10"
            >
              {initialExercise ? 'Guardar Cambios' : 'Publicar Ejercicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
