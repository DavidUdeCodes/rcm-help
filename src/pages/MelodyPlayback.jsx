import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import sampleMap from "../data/soundSampleMap.js";
import { RCM10_MELODIES } from "../data/melodyPlaybackData.js";

// Helper: note name to MIDI number
function noteNameToMidi(note) {
  const regex = /^([A-Ga-g])([#b]?)(\d)$/;
  const match = note.match(regex);
  if (!match) return null;
  const [ , letter, accidental, octave ] = match;
  const base = {C:0, D:2, E:4, F:5, G:7, A:9, B:11}[letter.toUpperCase()];
  let midi = 12 * (parseInt(octave) + 1) + base;
  if (accidental === "#") midi += 1;
  if (accidental === "b") midi -= 1;
  return midi;
}

// Helper: MIDI number to note name
function midiToNoteName(midi) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = notes[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MELODIES = [
    
]

const PRESETS = [
  {
    label: "RCM Level 10",
    melodies: RCM10_MELODIES,
  }
];

const DEFAULT_TEMPO = 100; // bpm

export default function MelodyPlayback() {
  const samplerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Setup states
  const [showSetup, setShowSetup] = useState(true);
  const [preset, setPreset] = useState(PRESETS[0].label);

  // Test states
  const [currentMelody, setCurrentMelody] = useState(null);
  const [playCount, setPlayCount] = useState(0); // 0 = not played yet, max 3
  const [isPlaying, setIsPlaying] = useState(false);

  // Load sampler
  useEffect(() => {
    const sampler = new Tone.Sampler(sampleMap, {
      onload: () => setLoaded(true),
    }).toDestination();
    samplerRef.current = sampler;
    return () => sampler.dispose();
  }, []);

  // Play tonic chord and melody when currentMelody changes (first play, automatic)
  useEffect(() => {
    if (!showSetup && currentMelody) {
      handlePlayMelody(true);
    }
    // eslint-disable-next-line
  }, [currentMelody, showSetup]);

  // Start test
  const startTest = () => {
    const presetObj = PRESETS.find(p => p.label === preset);
    const melody = getRandomFromArray(presetObj.melodies);
    setCurrentMelody(melody);
    setShowSetup(false);
    setPlayCount(0);
  };

  // Play tonic chord and melody
  const handlePlayMelody = async (isAuto = false) => {
    if (!loaded || !currentMelody || isPlaying) return;
    setIsPlaying(true);

    // Only increment playCount if not the automatic first play
    if (!isAuto) setPlayCount(count => count + 1);

    await Tone.start();
    const sampler = samplerRef.current;

    // Play tonic chord only on the first (automatic) play
    if (isAuto) {
      // Support tonicMidi as note or midi
      const tonicMidi = typeof currentMelody.tonicMidi === "string"
        ? noteNameToMidi(currentMelody.tonicMidi)
        : currentMelody.tonicMidi;
        const root = tonicMidi;
        const isMinor = currentMelody.tonicQuality === "minor";
        const third = root + (isMinor ? 3 : 4); // minor third if minor, major third if major
        const fifth = root + 7;
        sampler.triggerAttackRelease(
        [midiToNoteName(root), midiToNoteName(third), midiToNoteName(fifth)],
        2 // chord duration in seconds
    );

      // Wait for chord to finish before playing melody
      setTimeout(() => {
        playMelodyNotes(sampler, currentMelody, () => setIsPlaying(false));
      }, 2100); // 2s chord + 0.1s buffer
    } else {
      // On replays, play only the melody
      playMelodyNotes(sampler, currentMelody, () => setIsPlaying(false));
    }
  };

  // Helper to play melody notes in sequence
  function playMelodyNotes(sampler, melodyObj, onDone) {
    // Use melody's tempo or default
    const tempo = melodyObj.tempo || DEFAULT_TEMPO;
    const beatDurationMs = 60000 / tempo; // ms per quarter note

    let time = 0;
    melodyObj.melody.forEach((noteObj, idx) => {
      // Support both midi and note
      const midi = noteObj.midi !== undefined ? noteObj.midi : noteNameToMidi(noteObj.note);
      setTimeout(() => {
        sampler.triggerAttackRelease(midiToNoteName(midi), beatDurationMs * noteObj.duration * 0.9 / 1000); // 90% of note duration
      }, time);
      time += beatDurationMs * noteObj.duration;
    });
    // Call onDone after melody finishes
    setTimeout(onDone, time + 100);
  }

  // --- RENDER ---

  if (showSetup) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-main-background">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Melody Playback Test Setup</h1>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">RCM Level:</label>
            <select
              className="w-full p-2 rounded border"
              value={preset}
              onChange={e => setPreset(e.target.value)}
            >
              {PRESETS.map(p => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={startTest}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 transition"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  // --- TEST PAGE ---

  return (
    <div className='pt-16'>
      <div className="main-font h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-main-background text-center lg:px-80">
        <div className="flex w-full justify-end pr-8">
          <button
            onClick={() => setShowSetup(true)}
            className="mb-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Edit
          </button>
        </div>
        <h1 className="text-6xl font-medium text-gray-800 mb-8">RCM Melody Playback Test</h1>
        {currentMelody && (
          <>
            <div className="text-lg text-gray-700 mb-2">
              Key: <span className="font-bold">{currentMelody.key}</span>
            </div>
            <div className="text-lg text-gray-700 mb-2">
              Time Signature: <span className="font-bold">{currentMelody.timeSignature}</span>
            </div>
            <div className="text-lg text-gray-700 mb-8">
              Tempo: <span className="font-bold">{currentMelody.tempo || DEFAULT_TEMPO} bpm</span>
            </div>
          </>
        )}
        <button
          onClick={() => handlePlayMelody(false)}
          disabled={!loaded || isPlaying || playCount >= 2}
          className={`bg-blue-400 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow
            transition duration-300 ease-in-out transform scale-110 hover:bg-blue-500 hover:scale-115 mb-4
            ${(!loaded || isPlaying || playCount >= 2) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loaded ? (isPlaying ? "Playing..." : "Play Melody") : "Loading Piano..."}
        </button>
        <div className="text-md text-gray-700 mb-8">
          Plays left: <span className="font-bold">{2 - playCount}</span> / 2
        </div>
        {/* You can add answer/guess logic here if needed */}
      </div>
    </div>
  );
}