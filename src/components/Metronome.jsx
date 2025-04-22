import React, { useState, useRef, useEffect } from 'react';

const MIN_BPM = 40;
const MAX_BPM = 200;

function angleToBpm(angle) {
  return Math.round(
    ((angle % 360) / 360) * (MAX_BPM - MIN_BPM) + MIN_BPM
  );
}

function bpmToAngle(bpm) {
  return ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 360;
}

const CircularBpmKnob = ({ bpm, setBpm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBpm, setTempBpm] = useState(bpm);
  const knobRef = useRef(null);

  const handlePointerDown = () => {
    if (!isEditing) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
  };

  const handlePointerUp = () => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const rect = knobRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI); // 0° at top
    if (angle < 0) angle += 360;
    setBpm(angleToBpm(angle));
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
    setTempBpm(bpm);
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = '';
    setTempBpm(value);
  };

  const handleInputBlur = () => {
    let newBpm = parseInt(tempBpm, 10);
    if (isNaN(newBpm)) newBpm = bpm;
    if (newBpm < MIN_BPM) newBpm = MIN_BPM;
    if (newBpm > MAX_BPM) newBpm = MAX_BPM;
    setBpm(newBpm);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (!isEditing) setTempBpm(bpm);
  }, [bpm, isEditing]);

  const angle = bpmToAngle(bpm);
  const radius = 60;
  const knobX = 80 + radius * Math.sin(angle * (Math.PI / 180));
  const knobY = 80 - radius * Math.cos(angle * (Math.PI / 180));

  return (
    <svg
      ref={knobRef}
      width={160}
      height={160}
      className="touch-none select-none cursor-pointer bg-gray-900 rounded-xl"
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    >
      <circle cx={80} cy={80} r={70} fill="#f3f4f6" stroke="#bbb" strokeWidth={4} />
      
      {/* BPM Display/Input */}
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
        <text x={80} y={90} textAnchor="middle" fontSize="32" fill="#1f2937" fontWeight="bold">
          {bpm}
        </text>
      )}
      
      {/* Always show "BPM" text */}
      <text x={80} y={120} textAnchor="middle" fontSize="16" fill="#6b7280">
        BPM
      </text>
      
      <line
        x1={80}
        y1={80}
        x2={knobX}
        y2={knobY}
        stroke="#2563eb"
        strokeWidth={8}
        strokeLinecap="round"
      />
    </svg>
  );
};

const Metronome = ({ tempo = 120 }) => {
  const [bpm, setBpm] = useState(tempo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const audioContextRef = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    setBpm(tempo);
  }, [tempo]);

  const playClick = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = currentBeat === 0 ? 1000 : 800;
    gain.gain.value = 1;
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    setCurrentBeat((b) => (b + 1) % 4);
  };

  const toggleMetronome = () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!isPlaying) {
      setCurrentBeat(0);
      playClick();
      intervalIdRef.current = setInterval(playClick, (60 / bpm) * 1000);
      setIsPlaying(true);
    }
    else {
      clearInterval(intervalIdRef.current);
      setIsPlaying(false);
      setCurrentBeat(0);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalIdRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      clearInterval(intervalIdRef.current);
      setCurrentBeat(0);
      intervalIdRef.current = setInterval(playClick, (60 / bpm) * 1000);
    }
  }, [bpm]);

  return (
    <div className="flex flex-col items-center gap-4">
      <CircularBpmKnob bpm={bpm} setBpm={setBpm} />
      <div className="w-full max-w-sm mx-auto px-4">
        <h1 className="text-xs text-center">
          (Double click metronome to change BPM
          <br />
          and turn off silent mode if you can't hear sound)
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