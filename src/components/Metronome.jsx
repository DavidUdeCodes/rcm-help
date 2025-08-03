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

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const angleToBpm = (angle) => {
  return Math.round(((angle % 360) / 360) * (MAX_BPM - MIN_BPM) + MIN_BPM);
};

const bpmToAngle = (bpm) => {
  return ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 360;
};

const Metronome = ({ tempo = 120 }) => {
  const [bpm, setBpm] = useState(clamp(tempo, MIN_BPM, MAX_BPM));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBpm, setTempBpm] = useState(bpm);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);

  const knobRef = useRef(null);
  const draggingRef = useRef(false);
  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const schedulerTimerRef = useRef(null);
  const beatCountRef = useRef(0);
  const metronomeBufferRef = useRef(null);

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
  if (!audioContextRef.current || !metronomeBufferRef.current) return;
  const source = audioContextRef.current.createBufferSource();
  source.buffer = metronomeBufferRef.current;

  const beat = beatCountRef.current;

  // Accent logic: louder and higher pitch for first beat
  const gain = audioContextRef.current.createGain();
    if (accentFirstBeat && beat === 0) {
      gain.gain.value = 2; // much louder
      source.playbackRate.value = 1.4; // slightly higher pitch
    } else {
      gain.gain.value = 0.4;
      source.playbackRate.value = 1.0;
    }

    source.connect(gain);
    gain.connect(audioContextRef.current.destination);

    source.start(time);

    beatCountRef.current = (beatCountRef.current + 1) % 4;
    setCurrentBeat(beat);
  }, [accentFirstBeat]);

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
    if (!metronomeBufferRef.current) {
      alert("metronome sound is still loading. Please wait a moment and try again.");
      return;
    }
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

  // --- Load metronome sample as soon as possible ---
  useEffect(() => {
    let isMounted = true;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    fetch('/metronomeSound.mp3')
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        if (isMounted) {
          metronomeBufferRef.current = audioBuffer;
          setIsSampleLoaded(true);
        }
        ctx.close();
      })
      .catch(() => {
        setIsSampleLoaded(false);
      });
    return () => { isMounted = false; };
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
        disabled={!isSampleLoaded}
        style={{ opacity: isSampleLoaded ? 1 : 0.5, cursor: isSampleLoaded ? 'pointer' : 'not-allowed' }}
      >
        {isSampleLoaded ? (isPlaying ? 'Stop' : 'Play') : 'Loading...'}
      </button>

      <button
        onClick={() => setAccentFirstBeat(a => !a)}
        className={`px-4 py-1 mt-2 rounded font-semibold border ${
          accentFirstBeat
            ? 'bg-blue-100 text-blue-700 border-blue-400'
            : 'bg-gray-100 text-gray-700 border-gray-300'
        }`}
      >
        {accentFirstBeat ? 'Accent First Beat: ON' : 'Accent First Beat: OFF'}
      </button>
    </div>
  );
};

export default Metronome;