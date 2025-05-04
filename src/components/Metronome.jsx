import React, { useState, useRef, useEffect, useCallback } from 'react';

// Constants
const MIN_BPM = 40;
const MAX_BPM = 200;
const KNOB_SIZE = 160;
const CENTER = KNOB_SIZE / 2;
const KNOB_RADIUS = 70;
const INDICATOR_RADIUS = 60;
const BPM_STEP = 1;
const SCHEDULER_INTERVAL = 25;
const NOTE_DURATION = 0.1;
const SCHEDULE_AHEAD_TIME = 0.1;
const OSCILLATOR_FREQUENCY = 900;

// Utility functions
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const angleToBpm = (angle) => {
  return Math.round(((angle % 360) / 360) * (MAX_BPM - MIN_BPM) + MIN_BPM);
};

const bpmToAngle = (bpm) => {
  return ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 360;
};

const Metronome = ({ tempo = 120 }) => {
  // State
  const [bpm, setBpm] = useState(clamp(tempo, MIN_BPM, MAX_BPM));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBpm, setTempBpm] = useState(bpm);

  // Refs
  const knobRef = useRef(null);
  const draggingRef = useRef(false);
  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const schedulerTimerRef = useRef(null);
  const beatCountRef = useRef(0);

  // --- Knob Drag Logic ---
  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    setBpm(angleToBpm(angle));
  }, []);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback((e) => {
    if (!isEditing) {
      draggingRef.current = true;
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
  }, [isEditing, handlePointerMove, handlePointerUp]);

  // --- Audio scheduling ---
  const scheduleNote = useCallback((time) => {
    if (!audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    osc.frequency.value = OSCILLATOR_FREQUENCY;
    gain.gain.value = beatCountRef.current === 0 ? 1 : 0.8; // Accent first beat
    osc.start(time);
    osc.stop(time + NOTE_DURATION);
    beatCountRef.current = (beatCountRef.current + 1) % 4;
    setCurrentBeat(beatCountRef.current);
  }, []);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + SCHEDULE_AHEAD_TIME) {
      scheduleNote(nextNoteTimeRef.current);
      nextNoteTimeRef.current += 60.0 / bpm;
    }
    schedulerTimerRef.current = setTimeout(scheduler, SCHEDULER_INTERVAL);
  }, [bpm, scheduleNote]);

  // --- Keyboard handling ---
  const handleKeyDown = useCallback((e) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        const newBpm = clamp(parseInt(tempBpm, 10) || bpm, MIN_BPM, MAX_BPM);
        setBpm(newBpm);
        setIsEditing(false);
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        setTempBpm(bpm);
      }
      return;
    }
    // Keyboard controls when not editing
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        setBpm(prev => clamp(prev + BPM_STEP, MIN_BPM, MAX_BPM));
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        setBpm(prev => clamp(prev - BPM_STEP, MIN_BPM, MAX_BPM));
        e.preventDefault();
        break;
      default:
        break;
    }
  }, [isEditing, tempBpm, bpm]);

  // --- Input handlers ---
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    setIsEditing(true);
    setTempBpm(bpm);
  }, [bpm]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    setTempBpm(value);
  }, []);

  const handleInputBlur = useCallback(() => {
    const newBpm = clamp(parseInt(tempBpm, 10) || bpm, MIN_BPM, MAX_BPM);
    setBpm(newBpm);
    setIsEditing(false);
  }, [tempBpm, bpm]);

  // --- Metronome start/stop ---
  const toggleMetronome = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    if (!isPlaying) {
      beatCountRef.current = 0;
      setCurrentBeat(0);
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      scheduler();
      setIsPlaying(true);
    } else {
      clearTimeout(schedulerTimerRef.current);
      setIsPlaying(false);
      setCurrentBeat(0);
      beatCountRef.current = 0;
    }
  }, [isPlaying, scheduler]);

  // --- Effects ---
  useEffect(() => {
    setBpm(clamp(tempo, MIN_BPM, MAX_BPM));
  }, [tempo]);

  useEffect(() => {
    if (isPlaying) {
      clearTimeout(schedulerTimerRef.current);
      scheduler();
    }
  }, [bpm, isPlaying, scheduler]);

  useEffect(() => {
    if (!isEditing) setTempBpm(bpm);
  }, [bpm, isEditing]);

  useEffect(() => {
    return () => {
      clearTimeout(schedulerTimerRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // --- Knob position ---
  const angle = bpmToAngle(bpm);
  const knobX = CENTER + INDICATOR_RADIUS * Math.sin(angle * (Math.PI / 180));
  const knobY = CENTER - INDICATOR_RADIUS * Math.cos(angle * (Math.PI / 180));

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={knobRef}
        width={KNOB_SIZE}
        height={KNOB_SIZE}
        className="touch-none select-none cursor-pointer bg-gray-900 rounded-xl"
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="BPM Control"
        aria-valuemin={MIN_BPM}
        aria-valuemax={MAX_BPM}
        aria-valuenow={bpm}
        tabIndex={0}
      >
        {/* Background circle */}
        <circle 
          cx={CENTER} 
          cy={CENTER} 
          r={KNOB_RADIUS} 
          fill="#f3f4f6" 
          stroke="#bbb" 
          strokeWidth={4} 
        />
        
        {/* BPM display */}
        {isEditing ? (
          <foreignObject x={30} y={60} width={100} height={40}>
            <div className="flex items-center justify-center w-full h-full">
              <input
                type="number"
                value={tempBpm}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="w-full text-center text-[32px] font-bold bg-transparent focus:outline-none text-[#1f2937] appearance-none"
                min={MIN_BPM}
                max={MAX_BPM}
                autoFocus
                style={{ border: 'none' }}
              />
            </div>
          </foreignObject>
        ) : (
          <text 
            x={CENTER} 
            y={90} 
            textAnchor="middle" 
            fontSize="32" 
            fill="#1f2937" 
            fontWeight="bold"
          >
            {bpm}
          </text>
        )}
        
        {/* BPM label */}
        <text 
          x={CENTER} 
          y={120} 
          textAnchor="middle" 
          fontSize="16" 
          fill="#6b7280"
        >
          BPM
        </text>
        
        {/* Indicator line */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={knobX}
          y2={knobY}
          stroke="#2563eb"
          strokeWidth={8}
          strokeLinecap="round"
        />

        {/* Beat indicator dots */}
        {[0, 1, 2, 3].map((beat) => (
          <circle
            key={beat}
            cx={CENTER + (KNOB_RADIUS - 15) * Math.cos((beat * 90 - 90) * (Math.PI / 180))}
            cy={CENTER + (KNOB_RADIUS - 15) * Math.sin((beat * 90 - 90) * (Math.PI / 180))}
            r={4}
            fill={beat === currentBeat ? '#2563eb' : '#cbd5e1'}
          />
        ))}
      </svg>

      <div className="w-full max-w-sm mx-auto px-4">
        <h1 className="text-xs text-center">
          Double click to edit BPM directly
          <br />
          Use arrow keys to adjust or drag the knob
        </h1>
      </div>

      <button
        onClick={toggleMetronome}
        className={`px-8 py-2 text-lg rounded-lg font-bold text-white transition-colors ${
          isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

export default Metronome;