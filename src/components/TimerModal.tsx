import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { useAuth } from '../context/AuthContext';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import { soundEffects } from '../utils/audio';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Minus,
  CheckCircle2,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight
} from 'lucide-react';

interface TimerModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

type Phase = 'stretch-left' | 'rest-switch' | 'stretch-right' | 'stretch-both' | 'finished';

export const TimerModal: React.FC<TimerModalProps> = ({ exercise, onClose }) => {
  const { recordCompletedWorkout } = useAuth();

  const [phase, setPhase] = useState<Phase>('stretch-left');
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);

  // Sound ref to prevent repeating tick within same second
  const lastSecondRef = useRef<number>(-1);

  // Initialize phase & timer when exercise opens
  useEffect(() => {
    if (!exercise) return;
    const baseTime = exercise.durationSeconds || 90;
    if (exercise.hasSides) {
      setPhase('stretch-left');
    } else {
      setPhase('stretch-both');
    }
    setTimeLeft(baseTime);
    setIsRunning(true);
    setTotalSecondsElapsed(0);
    lastSecondRef.current = -1;
  }, [exercise]);

  // Main timer tick
  useEffect(() => {
    if (!exercise || !isRunning || phase === 'finished') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition phase
          handlePhaseTransition();
          return 0;
        }

        // Audio ticks for last 3 seconds
        if (!isMuted && prev <= 4 && prev > 1 && lastSecondRef.current !== prev) {
          lastSecondRef.current = prev;
          soundEffects.playTick();
        }

        return prev - 1;
      });

      setTotalSecondsElapsed((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, exercise, isMuted]);

  if (!exercise) return null;

  const baseDuration = exercise.durationSeconds || 90;

  const handlePhaseTransition = () => {
    if (!exercise) return;

    if (phase === 'stretch-left') {
      // 10s switch rest
      if (!isMuted) soundEffects.playGo();
      setPhase('rest-switch');
      setTimeLeft(10);
    } else if (phase === 'rest-switch') {
      // Start right side
      if (!isMuted) soundEffects.playGo();
      setPhase('stretch-right');
      setTimeLeft(baseDuration);
    } else if (phase === 'stretch-right' || phase === 'stretch-both') {
      // Workout complete!
      if (!isMuted) soundEffects.playComplete();
      setPhase('finished');
      setIsRunning(false);
      recordCompletedWorkout();
    }
  };

  const handleSkipNext = () => {
    handlePhaseTransition();
  };

  const handleResetCurrent = () => {
    setIsRunning(false);
    if (phase === 'rest-switch') {
      setTimeLeft(10);
    } else {
      setTimeLeft(baseDuration);
    }
  };

  const adjustTime = (delta: number) => {
    setTimeLeft((prev) => Math.max(5, prev + delta));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const embedUrl = getYouTubeEmbedUrl(exercise.youtubeUrl, false);

  // Progress percentage
  const currentMax = phase === 'rest-switch' ? 10 : baseDuration;
  const progressPercent = Math.min(100, Math.max(0, ((currentMax - timeLeft) / currentMax) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#111115] border border-[#262630] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#22222a] bg-[#0c0c0e]">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#FFEE00] animate-pulse" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFEE00]">
                Protocolo Guiado 520 Movility
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide text-white truncate max-w-sm sm:max-w-lg">
                {exercise.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar beeps'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-[#FFEE00]" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Embedded Video & Coaching Tips */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#22222a] bg-[#0e0e12]">
            <div>
              {/* Embedded Video */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#23232c] shadow-lg mb-4">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={exercise.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    No se pudo cargar el video
                  </div>
                )}
              </div>

              {/* Coaching Tips */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <span className="text-[#FFEE00] font-bold">MATERIAL:</span>
                  <span>{exercise.equipment}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-[#FFEE00] font-bold">ZONA:</span>
                  <span>{exercise.targetFocus}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#14141a] p-3 rounded-xl border border-[#22222a]">
                  {exercise.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1d1d24] flex items-center justify-between text-xs text-zinc-500">
              <span>Tiempo total acumulado: {formatTime(totalSecondsElapsed)}</span>
              <span className="text-[#FFEE00] font-medium">Inspirado en metodología GOWOD</span>
            </div>
          </div>

          {/* Right Column: Athletic Timer Console */}
          <div className="lg:col-span-5 p-6 flex flex-col items-center justify-center bg-[#131317]">
            {phase === 'finished' ? (
              // Workout Finished Celebration
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFEE00]/15 border-2 border-[#FFEE00] flex items-center justify-center text-[#FFEE00] shadow-[0_0_25px_rgba(255,238,0,0.3)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-display text-3xl font-black uppercase text-white tracking-tight">
                    ¡EJERCICIO COMPLETADO!
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Excelente trabajo de rango articular. Tu articulación está preparada para el WOD.
                  </p>
                </div>
                <div className="p-3 bg-[#191920] rounded-xl border border-[#272732] inline-flex items-center gap-2 text-xs text-zinc-300">
                  <Flame className="w-4 h-4 text-[#FFEE00]" />
                  <span>Rutina registrada en tu perfil de atleta</span>
                </div>
                <div>
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#FFEE00] hover:bg-[#fff233] text-black font-extrabold uppercase tracking-wide text-sm transition-all shadow-md shadow-[#FFEE00]/25"
                  >
                    Volver a la Lista
                  </button>
                </div>
              </div>
            ) : (
              // Active Timer View
              <div className="w-full flex flex-col items-center justify-between h-full space-y-6">
                {/* Phase Indicator Badge */}
                <div className="text-center">
                  {phase === 'stretch-left' && (
                    <span className="px-4 py-1.5 rounded-full bg-[#FFEE00]/15 border border-[#FFEE00]/50 text-[#FFEE00] font-display text-sm sm:text-base font-bold uppercase tracking-wider">
                      Lado Izquierdo
                    </span>
                  )}
                  {phase === 'rest-switch' && (
                    <span className="px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/50 text-orange-400 font-display text-sm sm:text-base font-bold uppercase tracking-wider animate-pulse">
                      ¡Cambio de Lado! Prepara posición
                    </span>
                  )}
                  {phase === 'stretch-right' && (
                    <span className="px-4 py-1.5 rounded-full bg-[#FFEE00]/15 border border-[#FFEE00]/50 text-[#FFEE00] font-display text-sm sm:text-base font-bold uppercase tracking-wider">
                      Lado Derecho
                    </span>
                  )}
                  {phase === 'stretch-both' && (
                    <span className="px-4 py-1.5 rounded-full bg-[#FFEE00]/15 border border-[#FFEE00]/50 text-[#FFEE00] font-display text-sm sm:text-base font-bold uppercase tracking-wider">
                      Ambos Lados (Continuo)
                    </span>
                  )}
                </div>

                {/* Giant Digital Stopwatch Display */}
                <div className="relative flex flex-col items-center justify-center my-4">
                  <div className="font-display text-6xl sm:text-7xl font-black text-white tracking-tight tabular-nums select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {formatTime(timeLeft)}
                  </div>

                  {/* Circular / Linear Progress Bar */}
                  <div className="w-48 sm:w-56 h-2 bg-[#202028] rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-[#FFEE00] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Add / Subtract Time Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustTime(-15)}
                    className="px-3 py-1.5 rounded-lg bg-[#1c1c24] hover:bg-[#252530] text-zinc-300 text-xs font-bold border border-[#292934] flex items-center gap-1 transition-colors"
                  >
                    <Minus className="w-3 h-3" /> 15s
                  </button>
                  <button
                    onClick={() => adjustTime(15)}
                    className="px-3 py-1.5 rounded-lg bg-[#1c1c24] hover:bg-[#252530] text-zinc-300 text-xs font-bold border border-[#292934] flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> 15s
                  </button>
                </div>

                {/* Main Player Controls */}
                <div className="w-full flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetCurrent}
                    className="p-3.5 rounded-xl bg-[#1c1c24] hover:bg-[#272733] text-zinc-300 border border-[#2a2a38] transition-colors"
                    title="Reiniciar este intervalo"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`py-3.5 px-8 rounded-2xl font-display uppercase tracking-wider text-lg font-black flex items-center justify-center gap-2 transition-all shadow-lg select-none ${
                      isRunning
                        ? 'bg-[#FFEE00] text-black hover:bg-[#fff233] shadow-[#FFEE00]/20'
                        : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5 fill-black" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                        <span>Continuar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSkipNext}
                    className="p-3.5 rounded-xl bg-[#1c1c24] hover:bg-[#272733] text-zinc-300 border border-[#2a2a38] transition-colors"
                    title="Siguiente lado o completar"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Direct complete button */}
                <button
                  onClick={() => {
                    if (window.confirm('¿Marcar este ejercicio como terminado ahora?')) {
                      handlePhaseTransition();
                      if (phase !== 'stretch-right' && phase !== 'stretch-both') {
                        setPhase('finished');
                        setIsRunning(false);
                        recordCompletedWorkout();
                      }
                    }
                  }}
                  className="text-xs text-zinc-500 hover:text-[#FFEE00] underline transition-colors pt-2"
                >
                  Terminar ejercicio directamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
