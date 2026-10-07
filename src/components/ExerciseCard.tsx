import React, { useState } from 'react';
import { Exercise } from '../types';
import { useAuth } from '../context/AuthContext';
import { useMobility } from '../context/MobilityContext';
import { getYouTubeEmbedUrl, extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';
import { Play, Clock, Dumbbell, Star, Edit, Trash2 } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onStartTimer: (exercise: Exercise) => void;
  onEdit: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onStartTimer,
  onEdit,
}) => {
  const { currentUser, isAdmin, toggleFavorite } = useAuth();
  const { deleteExercise } = useMobility();
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  const isFavorite = currentUser?.favoriteIds?.includes(exercise.id);
  const embedUrl = getYouTubeEmbedUrl(exercise.youtubeUrl, true);
  const thumbnailUrl = getYouTubeThumbnailUrl(exercise.youtubeUrl, 'hq');
  const videoId = extractYouTubeId(exercise.youtubeUrl);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins} min`;
    return `${mins}:${secs < 10 ? '0' : ''}${secs} min`;
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar el ejercicio "${exercise.title}"?`)) {
      deleteExercise(exercise.id);
    }
  };

  return (
    <div className="bg-white dark:bg-[#131317] border border-zinc-200 dark:border-[#23232b] rounded-2xl overflow-hidden hover:border-zinc-400 dark:hover:border-[#383844] transition-all flex flex-col group shadow-md hover:shadow-xl dark:shadow-lg dark:shadow-black/40">
      {/* Video Container (Responsive 16:9) */}
      <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-zinc-200 dark:border-[#23232b]">
        {isPlayingInline && embedUrl ? (
          <iframe
            src={embedUrl}
            title={exercise.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="relative w-full h-full group/thumb cursor-pointer" onClick={() => setIsPlayingInline(true)}>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={exercise.title}
                className="w-full h-full object-cover brightness-95 group-hover/thumb:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-500">
                <Play className="w-12 h-12" />
              </div>
            )}

            {/* Dark overlay & play button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#FFEE00] text-black flex items-center justify-center shadow-xl shadow-[#FFEE00]/40 transform group-hover/thumb:scale-110 transition-transform border border-black/20">
                <Play className="w-6 h-6 fill-black ml-0.5" />
              </div>
            </div>

            {/* Duration & side badge */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-black/90 backdrop-blur-md text-[#FFEE00] font-sans font-bold text-xs flex items-center gap-1 border border-white/10 shadow-sm">
                <Clock className="w-3 h-3 text-[#FFEE00]" />
                {formatDuration(exercise.durationSeconds)}
                {exercise.hasSides && ' / lado'}
              </span>
            </div>

            {/* YouTube indicator */}
            <div className="absolute top-2.5 right-2.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-sm">
                YouTube
              </span>
            </div>
          </div>
        )}

        {/* Floating Quick Action overlay when video is playing */}
        {isPlayingInline && (
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <button
              onClick={() => setIsPlayingInline(false)}
              className="px-2.5 py-1 bg-black/85 hover:bg-black text-white text-[11px] font-bold rounded-md backdrop-blur border border-zinc-700"
            >
              Cerrar video
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Top meta tags */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-[#FFEE00]/15 text-zinc-900 dark:text-[#FFEE00] border border-amber-300 dark:border-[#FFEE00]/30 font-bold uppercase tracking-wider text-[10px]">
                {exercise.targetFocus || 'Movilidad'}
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-600 dark:text-zinc-400 text-[11px] flex items-center gap-1 font-medium">
                <Dumbbell className="w-3 h-3" />
                {exercise.equipment}
              </span>
            </div>

            {/* Favorite button */}
            {currentUser && (
              <button
                onClick={() => toggleFavorite(exercise.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isFavorite
                    ? 'text-amber-500 dark:text-[#FFEE00] hover:bg-amber-100 dark:hover:bg-[#FFEE00]/15'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#FFEE00]' : ''}`} />
              </button>
            )}
          </div>

          {/* Exercise Title */}
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight mb-2 uppercase group-hover:text-amber-600 dark:group-hover:text-[#FFEE00] transition-colors">
            {exercise.title}
          </h3>

          {/* Description / Instructions */}
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
            {exercise.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-zinc-200 dark:border-[#22222a] flex items-center justify-between gap-2">
          {/* Main Action: Start Guided Mobility Timer */}
          <button
            onClick={() => onStartTimer(exercise)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase text-xs sm:text-sm tracking-wider transition-all shadow-md shadow-[#FFEE00]/25 active:scale-[0.98] border border-black/10"
          >
            <Clock className="w-4 h-4 text-black" />
            <span>Iniciar Temporizador</span>
          </button>

          {/* Admin Management Buttons */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(exercise)}
                className="p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1b1b22] dark:hover:bg-[#262630] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-[#FFEE00] rounded-xl border border-zinc-300 dark:border-[#2a2a35] transition-colors"
                title="Editar ejercicio"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1b1b22] dark:hover:bg-[#262630] text-zinc-700 dark:text-zinc-300 hover:text-red-500 rounded-xl border border-zinc-300 dark:border-[#2a2a35] transition-colors"
                title="Eliminar ejercicio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
