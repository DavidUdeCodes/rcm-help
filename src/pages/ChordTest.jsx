import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { TRIADS,FOUR_NOTE_CHORDS,SEVENTHS,CHORDS,PRESETS } from "../data/chordTestData";
import sampleMap from "../data/soundSampleMap.js";

const PLAYBACK_MODES = [
  { label: "Block", value: "block" },
  { label: "Arpeggiated Up", value: "up" },
  { label: "Arpeggiated Down", value: "down" },
];

function midiToNoteName(midi) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = notes[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Only require the root to be in the sampleMap (Tone.js will pitch-shift)
function getRandomRoot(chord) {
  const minMidi = 48; // C3
  const maxMidi = 84; // C6
  const maxInterval = Math.max(...chord.intervals);
  const possibleRoots = [];
  for (let midi = minMidi; midi <= maxMidi - maxInterval; midi++) {
    if (sampleMap[midiToNoteName(midi)]) possibleRoots.push(midi);
  }
  if (possibleRoots.length === 0) {
    // Fallback: just use C4 (MIDI 60)
    return 60;
  }
  return getRandomFromArray(possibleRoots);
}

export default function ChordTest() {
  const samplerRef = useRef(null);
  const timeoutsRef = useRef([]);
  const [loaded, setLoaded] = useState(false);

  // Setup states
  const [showSetup, setShowSetup] = useState(true);
  const [selectedChords, setSelectedChords] = useState(["Major 4-note (Root)","Major 4-note (1st Inv)","Minor 4-note (Root)",
  "Minor 4-note (1st Inv)","Augmented (Root)","Dominant 7th (Root)","Diminished 7th (Root)",]);
  const [preset, setPreset] = useState(PRESETS[0].label);
  const [selectedPlaybackModes, setSelectedPlaybackModes] = useState(["block"]);

  // Test states
  const [currentChord, setCurrentChord] = useState(null);
  const [rootMidi, setRootMidi] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [playbackMode, setPlaybackMode] = useState("block");

  // Load sampler
  useEffect(() => {
    const sampler = new Tone.Sampler(sampleMap, {
      onload: () => setLoaded(true),
    }).toDestination();
    samplerRef.current = sampler;
    return () => {
      sampler.dispose();
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  // Auto-play chord when new chord/root/playbackMode is set (not in setup)
  useEffect(() => {
    if (!showSetup && currentChord && rootMidi !== null && playbackMode) {
      playChord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChord, rootMidi, playbackMode]);

  // Handle preset change
  const handlePresetChange = (e) => {
    const presetLabel = e.target.value;
    setPreset(presetLabel);
    const presetObj = PRESETS.find(p => p.label === presetLabel);
    setSelectedChords(presetObj.chords);

    // For any preset except Custom, only select "block"
    if (presetLabel !== "Custom") {
      setSelectedPlaybackModes(["block"]);
    }
    // For Custom, don't change playback modes
  };

  // Handle chord checkbox change
  const handleChordChange = (chordName) => {
    setSelectedChords(prev =>
      prev.includes(chordName)
        ? prev.filter(i => i !== chordName)
        : [...prev, chordName]
    );
    setPreset("Custom");
  };

  // Handle playback mode checkbox change
  const handlePlaybackModeChange = (modeValue) => {
    setSelectedPlaybackModes(prev =>
      prev.includes(modeValue)
        ? prev.filter(m => m !== modeValue)
        : [...prev, modeValue]
    );
    setPreset("Custom");
  };

  // Start test
  const startTest = () => {
    if (selectedChords.length === 0) {
      alert("Please select at least one chord.");
      return;
    }
    if (selectedPlaybackModes.length === 0) {
      alert("Please select at least one playback order.");
      return;
    }
    const availableChords = CHORDS.filter(i => selectedChords.includes(i.name));
    const chord = getRandomFromArray(availableChords);
    const root = getRandomRoot(chord);
    setCurrentChord(chord);
    setRootMidi(root);
    setPlaybackMode(getRandomFromArray(selectedPlaybackModes));
    setShowSetup(false);
    setScore({ correct: 0, total: 0 });
    setUserGuess('');
    setFeedback('');
    setShowAnswer(false);
  };

  // Guess logic
  const handleGuess = (guess) => {
    setUserGuess(guess);
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
    if (guess === currentChord.name) {
      setFeedback('Correct!');
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setShowAnswer(true);
    } else {
      setFeedback('Try again!');
    }
  };

  // Next chord
  const nextChord = () => {
    const availableChords = CHORDS.filter(i => selectedChords.includes(i.name));
    const newChord = getRandomFromArray(availableChords);
    const newRoot = getRandomRoot(newChord);
    setCurrentChord(newChord);
    setRootMidi(newRoot);
    setPlaybackMode(getRandomFromArray(selectedPlaybackModes));
    setUserGuess('');
    setFeedback('');
    setShowAnswer(false);
  };

  // Play chord (with timeout management)
  const playChord = async () => {
    await Tone.start();
    if (!loaded) return;
    const sampler = samplerRef.current;

    // Clear any previous timeouts
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    sampler.releaseAll();

    if (rootMidi === null || rootMidi === undefined) {
      alert("No valid root note for this chord.");
      return;
    }

    const notes = currentChord.intervals.map(i => midiToNoteName(rootMidi + i));
    if (notes.some(n => n.includes("NaN"))) {
      alert("Invalid note generated. Please try again.");
      return;
    }

    if (playbackMode === "block") {
      sampler.triggerAttackRelease(notes, 1.5);
    } else if (playbackMode === "up") {
      let t = 0;
      notes.forEach((note, idx) => {
        const timeout = setTimeout(() => {
          sampler.triggerAttackRelease(note, 1.1);
        }, t);
        timeoutsRef.current.push(timeout);
        t += 1000;
      });
    } else if (playbackMode === "down") {
      let t = 0;
      [...notes].reverse().forEach((note, idx) => {
        const timeout = setTimeout(() => {
          sampler.triggerAttackRelease(note, 1.1);
        }, t);
        timeoutsRef.current.push(timeout);
        t += 1000;
      });
    }
  };

  // --- RENDER ---

  // Group chords for setup form
  const groupedChords = {
    "Triads": TRIADS,
    "Four Note Chords": FOUR_NOTE_CHORDS,
    "Seventh Chords": SEVENTHS,
  };

  if (showSetup) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-main-background">
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Chord Test Setup</h1>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Preset:</label>
            <select
              className="w-full p-2 rounded border"
              value={preset}
              onChange={handlePresetChange}
            >
              {PRESETS.map(p => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Select Chords:</label>
            {Object.entries(groupedChords).map(([group, chords]) => (
              <div key={group} className="mb-2">
                <div className="font-bold mt-2 mb-1">{group}</div>
                <div className="grid grid-cols-2 gap-2">
                  {chords.map(chord => (
                    <label key={chord.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedChords.includes(chord.name)}
                        onChange={() => handleChordChange(chord.name)}
                      />
                      <span>{chord.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Select Playback Order(s):</label>
            <div className="flex gap-4">
              {PLAYBACK_MODES.map(mode => (
                <label key={mode.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPlaybackModes.includes(mode.value)}
                    onChange={() => handlePlaybackModeChange(mode.value)}
                  />
                  <span>{mode.label}</span>
                </label>
              ))}
            </div>
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
        <h1 className="text-6xl font-medium text-gray-800 mb-4">Chord Test</h1>
        <div className="text-lg text-gray-700 mb-6">
          Score: <span className="font-bold">{score.correct}</span> / {score.total}
        </div>
        <button
          onClick={playChord}
          disabled={!loaded}
          className={`bg-blue-400 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow
            transition duration-300 ease-in-out transform scale-110 hover:bg-blue-500 hover:scale-115 mb-8
            ${!loaded ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loaded ? "Play Chord" : "Loading Piano..."}
        </button>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {CHORDS.filter(i => selectedChords.includes(i.name)).map((chord) => (
            <button
              key={chord.name}
              onClick={() => handleGuess(chord.name)}
              className={`bg-blue-400 text-white text-lg font-bold py-2 px-6 rounded-2xl shadow
                transition duration-300 ease-in-out transform hover:bg-blue-500
                ${userGuess === chord.name ? 'ring-4 ring-blue-300' : ''}`}
              disabled={showAnswer}
            >
              {chord.name}
            </button>
          ))}
        </div>
        {feedback && (
          <div className={`text-2xl font-semibold mb-4 ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-500'}`}>
            {feedback}
          </div>
        )}
        {showAnswer && (
          <div>
            <div className="text-lg text-gray-700 mb-4">
              The chord was: <span className="font-bold">{currentChord.name}</span>
            </div>
            <button
              onClick={nextChord}
              className="bg-blue-400 text-white text-lg font-bold py-2 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform hover:bg-blue-500"
            >
              Next Chord
            </button>
          </div>
        )}
      </div>
    </div>
  );
}