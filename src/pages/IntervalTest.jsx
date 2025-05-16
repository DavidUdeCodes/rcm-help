import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

// Only include the available samples (A, C, D#, F# for each octave)
const sampleMap = {
  "C3": "/rcm-help/piano_samples/C3v10.wav",
  "D#3": "/rcm-help/piano_samples/Ds3v10.wav", 
  "F#3": "/rcm-help/piano_samples/Fs3v10.wav", 
  "A3": "/rcm-help/piano_samples/A3v10.wav",
  "C4": "/rcm-help/piano_samples/C4v10.wav",
  "D#4": "/rcm-help/piano_samples/Ds4v10.wav",
  "F#4": "/rcm-help/piano_samples/Fs4v10.wav",
  "A4": "/rcm-help/piano_samples/A4v10.wav",
  "C5": "/rcm-help/piano_samples/C5v10.wav",
  "D#5": "/rcm-help/piano_samples/Ds5v10.wav",
  "F#5": "/rcm-help/piano_samples/Fs5v10.wav",
  "A5": "/rcm-help/piano_samples/A5v10.wav",
  "C6": "/rcm-help/piano_samples/C6v10.wav",
};

const intervals = [
  { name: "Minor 2nd", semitones: 1 },
  { name: "Major 2nd", semitones: 2 },
  { name: "Minor 3rd", semitones: 3 },
  { name: "Major 3rd", semitones: 4 },
  { name: "Perfect 4th", semitones: 5 },
  { name: "Tritone", semitones: 6 },
  { name: "Perfect 5th", semitones: 7 },
  { name: "Minor 6th", semitones: 8 },
  { name: "Major 6th", semitones: 9 },
  { name: "Minor 7th", semitones: 10 },
  { name: "Major 7th", semitones: 11 },
  { name: "Perfect 8th", semitones: 12 },
  { name: "Minor 9th", semitones: 13 },
  { name: "Major 9th", semitones: 14 },
];

const PRESETS = [
  {
    label: "Custom",
    intervals: [],
  },
  {
    label: "RCM 10 (All Intervals)",
    intervals: intervals.map(i => i.name),
  },
  {
    label: "RCM 9 (Up to Octave)",
    intervals: intervals.filter(i => i.semitones <= 12).map(i => i.name),
  },
];

const PLAYBACK_MODES = [
  { label: "Ascending", value: "ascending" },
  { label: "Descending", value: "descending" },
  { label: "Harmonic", value: "together" },
];

function midiToNoteName(midi) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = notes[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

function getRandomInterval(intervalList) {
  const idx = Math.floor(Math.random() * intervalList.length);
  return intervalList[idx];
}

function getRandomRoot(semitones) {
  const minMidi = 48;
  const maxMidi = 84;
  const possibleRoots = [];
  for (let midi = minMidi; midi <= maxMidi; midi++) {
    const intervalMidi = midi + semitones;
    if (intervalMidi >= minMidi && intervalMidi <= maxMidi) {
      possibleRoots.push(midi);
    }
  }
  const rootMidi = possibleRoots[Math.floor(Math.random() * possibleRoots.length)];
  return rootMidi;
}

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function IntervalTest() {
  const samplerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Setup states
  const [showSetup, setShowSetup] = useState(true);
  const [selectedIntervals, setSelectedIntervals] = useState(intervals.filter(i => i.semitones <= 7).map(i => i.name)); // Custom
  const [preset, setPreset] = useState(PRESETS[0].label);
  const [selectedPlaybackModes, setSelectedPlaybackModes] = useState(["ascending"]); // Default to ascending

  // Test states
  const [currentInterval, setCurrentInterval] = useState(null);
  const [rootMidi, setRootMidi] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [playbackMode, setPlaybackMode] = useState("ascending");

  // Load sampler
  useEffect(() => {
    const sampler = new Tone.Sampler(sampleMap, {
      onload: () => setLoaded(true),
    }).toDestination();
    samplerRef.current = sampler;
    return () => {
      sampler.dispose();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto-play interval when new interval/root/playbackMode is set (not in setup)
  useEffect(() => {
    if (!showSetup && currentInterval && rootMidi !== null && playbackMode) {
      playInterval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInterval, rootMidi, playbackMode]);

  // Handle preset change
  const handlePresetChange = (e) => {
    const presetLabel = e.target.value;
    setPreset(presetLabel);
    const presetObj = PRESETS.find(p => p.label === presetLabel);
    setSelectedIntervals(presetObj.intervals);

    // Set playback modes based on preset
    if (presetLabel === "RCM 10 (All Intervals)") {
      setSelectedPlaybackModes(PLAYBACK_MODES.map(m => m.value)); // all modes
    } else if (presetLabel === "RCM 9 (Up to Octave)") {
      setSelectedPlaybackModes(PLAYBACK_MODES.map(m => m.value)); // or specify which modes you want
      // Example: setSelectedPlaybackModes(["ascending", "descending"]);
    }
    // For Custom, don't change playback modes
  };

  // Handle interval checkbox change
  const handleIntervalChange = (intervalName) => {
    setSelectedIntervals(prev =>
      prev.includes(intervalName)
        ? prev.filter(i => i !== intervalName)
        : [...prev, intervalName]
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
    if (selectedIntervals.length === 0) {
      alert("Please select at least one interval.");
      return;
    }
    if (selectedPlaybackModes.length === 0) {
      alert("Please select at least one playback order.");
      return;
    }
    const availableIntervals = intervals.filter(i => selectedIntervals.includes(i.name));
    const interval = getRandomInterval(availableIntervals);
    const root = getRandomRoot(interval.semitones);
    setCurrentInterval(interval);
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
    if (guess === currentInterval.name) {
      setFeedback('Correct!');
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setShowAnswer(true);
    } else {
      setFeedback('Try again!');
    }
  };

  // Next interval
  const nextInterval = () => {
    const availableIntervals = intervals.filter(i => selectedIntervals.includes(i.name));
    const newInterval = getRandomInterval(availableIntervals);
    const newRoot = getRandomRoot(newInterval.semitones);
    setCurrentInterval(newInterval);
    setRootMidi(newRoot);
    setPlaybackMode(getRandomFromArray(selectedPlaybackModes));
    setUserGuess('');
    setFeedback('');
    setShowAnswer(false);
  };

  // Play interval (with timeout management)
  const playInterval = async () => {
    await Tone.start();
    if (!loaded) return;
    const sampler = samplerRef.current;

    // Clear any previous timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    sampler.releaseAll(); // Stop any currently playing notes

    const lowerMidi = rootMidi;
    const higherMidi = rootMidi + currentInterval.semitones;
    const lowerNote = midiToNoteName(lowerMidi);
    const higherNote = midiToNoteName(higherMidi);

    if (playbackMode === "ascending") {
      sampler.triggerAttackRelease(lowerNote, 1.1);
      timeoutRef.current = setTimeout(() => {
        sampler.triggerAttackRelease(higherNote, 1.1);
        timeoutRef.current = null;
      }, 1000);
    } else if (playbackMode === "descending") {
      sampler.triggerAttackRelease(higherNote, 1.1);
      timeoutRef.current = setTimeout(() => {
        sampler.triggerAttackRelease(lowerNote, 1.1);
        timeoutRef.current = null;
      }, 1000);
    } else if (playbackMode === "together") {
      sampler.triggerAttackRelease([lowerNote, higherNote], 1.5);
    }
  };

  // --- RENDER ---

  if (showSetup) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-main-background">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Interval Test Setup</h1>
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
            <label className="block text-lg font-semibold mb-2">Select Intervals:</label>
            <div className="grid grid-cols-2 gap-2">
              {intervals.map(interval => (
                <label key={interval.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedIntervals.includes(interval.name)}
                    onChange={() => handleIntervalChange(interval.name)}
                  />
                  <span>{interval.name}</span>
                </label>
              ))}
            </div>
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
        <h1 className="text-6xl font-medium text-gray-800 mb-4">Interval Test</h1>
        <div className="text-lg text-gray-700 mb-6">
          Score: <span className="font-bold">{score.correct}</span> / {score.total}
        </div>
        <button
          onClick={playInterval}
          disabled={!loaded}
          className={`bg-blue-400 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow
            transition duration-300 ease-in-out transform scale-110 hover:bg-blue-500 hover:scale-115 mb-8
            ${!loaded ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loaded ? "Play Interval" : "Loading Piano..."}
        </button>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {intervals.filter(i => selectedIntervals.includes(i.name)).map((interval) => (
            <button
              key={interval.name}
              onClick={() => handleGuess(interval.name)}
              className={`bg-blue-400 text-white text-lg font-bold py-2 px-6 rounded-2xl shadow
                transition duration-300 ease-in-out transform hover:bg-blue-500
                ${userGuess === interval.name ? 'ring-4 ring-blue-300' : ''}`}
              disabled={showAnswer}
            >
              {interval.name}
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
              The interval was: <span className="font-bold">{currentInterval.name}</span>
            </div>
            <button
              onClick={nextInterval}
              className="bg-blue-400 text-white text-lg font-bold py-2 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform hover:bg-blue-500"
            >
              Next Interval
            </button>
          </div>
        )}
      </div>
    </div>
  );
}