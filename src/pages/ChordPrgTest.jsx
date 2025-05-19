import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import sampleMap from "../data/soundSampleMap.js";
import { PRESETS, CHORDS_MAJOR, CHORDS_MINOR, PRESET_PROGRESSION_MAP} from "../data/chordPrgTestData.js";

function midiToNoteName(midi) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = notes[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomRootMidi() {
  // C3 (48) to B4 (71)
  return 48 + Math.floor(Math.random() * 24);
}

function generateProgression({ mode, chords, length, presetLabel }) {
  // Check for hard-coded progressions for this preset
  if (PRESET_PROGRESSION_MAP[presetLabel]) {
    // Only use progressions where all chords are in the current mode's chord list
    const filtered = PRESET_PROGRESSION_MAP[presetLabel].filter(
      prog => prog.every(chord => chords.includes(chord))
    );
    // If there are any valid progressions, pick one at random
    if (filtered.length > 0) {
      return getRandomFromArray(filtered);
    }
    // If not, fall back to all progressions for the preset
    return getRandomFromArray(PRESET_PROGRESSION_MAP[presetLabel]);
  }

  // --- Your existing random progression logic below ---
  const tonic = mode === "major" ? "I" : "i";
  const dominant = "V";
  const cad64 = mode === "major" ? "I6/4" : "i6/4";
  let available = chords.filter(c => c !== tonic && c !== cad64);

  let prog = [tonic];

  if (chords.includes(cad64) && length >= 3) {
    const useFullCadence = length >= 4 && Math.random() < 0.5;
    if (useFullCadence) {
      for (let i = 1; i < length - 3; i++) {
        prog.push(getRandomFromArray(available.length ? available : chords));
      }
      prog.push(cad64, dominant, tonic);
    } else {
      for (let i = 1; i < length - 2; i++) {
        prog.push(getRandomFromArray(available.length ? available : chords));
      }
      prog.push(cad64, dominant);
    }
  } else {
    for (let i = 1; i < length; i++) {
      prog.push(getRandomFromArray(available.length ? available : chords));
    }
  }
  return prog;
}

export default function ChordPrgTest() {
  const samplerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Setup states
  const [showSetup, setShowSetup] = useState(true);
  const [mode, setMode] = useState("random");
  const [selectedChords, setSelectedChords] = useState({
    major: ["I", "IV", "V", "vi"],
    minor: ["i", "iv", "V", "VI"],
  });
  const [preset, setPreset] = useState(PRESETS[0].label);
  const [progressionLength, setProgressionLength] = useState(4);

  // Test states
  const [actualMode, setActualMode] = useState("random");
  const [progression, setProgression] = useState([]);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [userGuesses, setUserGuesses] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isInitialPlayback, setIsInitialPlayback] = useState(true);
  const [mistakeMade, setMistakeMade] = useState(false);
  const [progressionComplete, setProgressionComplete] = useState(false);
  const [rootMidi, setRootMidi] = useState(60);

  // Load sampler
  useEffect(() => {
    const sampler = new Tone.Sampler(sampleMap, {
      onload: () => setLoaded(true),
    }).toDestination();
    samplerRef.current = sampler;
    return () => {
      sampler.dispose();
    };
  }, []);

  useEffect(() => {
    if (preset === "RCM Level 5") {
      setMode("major");
      setProgressionLength(3);
    }
    else if (preset === "RCM Level 6" || preset === "RCM Level 7" || preset === "RCM Level 8") {
      setMode("random");
      setProgressionLength(4);
    }
    else if (preset === "RCM Level 9" || preset === "RCM Level 10") {
      setMode("random");
      setProgressionLength(5);
    }
  }, [preset]);

  // Handle preset change
  const handlePresetChange = (e) => {
    const presetLabel = e.target.value;
    setPreset(presetLabel);
    const presetObj = PRESETS.find(p => p.label === presetLabel);
    setSelectedChords({
      major: presetObj.major.length ? [...presetObj.major] : [],
      minor: presetObj.minor.length ? [...presetObj.minor] : [],
    });
  };

  // Handle chord checkbox change
  const handleChordChange = (modeKey, chordValue) => {
    setSelectedChords(prev => {
      const current = prev[modeKey];
      return {
        ...prev,
        [modeKey]: current.includes(chordValue)
          ? current.filter(c => c !== chordValue)
          : [...current, chordValue],
      };
    });
    setPreset("Custom");
  };

  // Start test
  const startTest = () => {
    let chosenMode = mode;
    if (mode === "random") {
      chosenMode = Math.random() < 0.5 ? "major" : "minor";
      setActualMode(chosenMode);
    } else {
      setActualMode(mode);
    }
    const chords = selectedChords[chosenMode];
    if (!chords.includes(chosenMode === "major" ? "I" : "i")) {
      alert("Tonic chord must be selected.");
      return;
    }
    if (chords.length < 2) {
      alert("Please select at least two chords.");
      return;
    }
    if (progressionLength < 2) {
      alert("Progression must be at least 2 chords.");
      return;
    }
    const randomRoot = getRandomRootMidi();
    setRootMidi(randomRoot);
    const prog = generateProgression({
      mode: chosenMode,
      chords,
      length: progressionLength,
      presetLabel: preset, // Pass the current preset label
    });
    setProgression(prog);
    setCurrentGuessIndex(0);
    setUserGuesses(Array(prog.length).fill(""));
    setFeedback(Array(prog.length).fill(""));
    setShowSetup(false);
    setShowAnswer(false);
    setIsInitialPlayback(true);
    setMistakeMade(false);
    setProgressionComplete(false);
  };

  // Play a single chord, with correct voicing for cadential 6/4 and all others
  const playChord = async (chordValue, modeKey) => {
    await Tone.start();
    if (!loaded) return;
    const sampler = samplerRef.current;
    sampler.releaseAll();
    const chordDefs = modeKey === "major" ? CHORDS_MAJOR : CHORDS_MINOR;
    const chordObj = chordDefs.find(c => c.value === chordValue);

    let notes;
    if (chordValue === "I6/4" || chordValue === "i6/4") {
      notes = [
        midiToNoteName(rootMidi + 7 - 12), // 5th below root
        midiToNoteName(rootMidi),          // root
        midiToNoteName(rootMidi + (chordValue === "I6/4" ? 4 : 3)), // 3rd
        midiToNoteName(rootMidi + 7),      // 5th above root
      ];
    } else if (chordValue === "V") {
      notes = [
        midiToNoteName(rootMidi + 7 - 12), // dominant below root
        midiToNoteName(rootMidi + 11 - 12), // leading tone below root
        midiToNoteName(rootMidi + 14 - 12), // 2nd above dominant
        midiToNoteName(rootMidi + 7),      // dominant above root
      ];
    } else {
      notes = chordObj.notes.map(i => midiToNoteName(rootMidi + i));
    }
    sampler.triggerAttackRelease(notes, 1);
  };

  // Play the full progression, then enable guessing
  useEffect(() => {
    let cancelled = false;
    async function playProgression() {
      if (!showSetup && isInitialPlayback && progression.length > 0 && loaded) {
        for (let i = 0; i < progression.length; i++) {
          if (cancelled) return;
          await playChord(progression[i], actualMode);
          await new Promise(res => setTimeout(res, 1100));
        }
        setIsInitialPlayback(false);
      }
    }
    playProgression();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [showSetup, isInitialPlayback, progression, loaded, actualMode]);

  // Guess logic (updated for last chord/progression complete)
  const handleGuess = (guess, idx) => {
    setUserGuesses(prev => {
      const arr = [...prev];
      arr[idx] = guess;
      return arr;
    });
    setFeedback(prev => {
      const arr = [...prev];
      const correct = progression[idx];
      if (guess === correct) {
        arr[idx] = "Correct!";
      } else {
        arr[idx] = "Try again!";
        setMistakeMade(true);
      }
      return arr;
    });

    if (guess === progression[idx]) {
      setShowAnswer(true);
      if (idx === progression.length - 1) {
        setProgressionComplete(true);
        setShowAnswer(false);
        setScore(s => {
          if (!mistakeMade) {
            return { ...s, correct: s.correct + 1, total: s.total + 1 };
          } else {
            return { ...s, total: s.total + 1 };
          }
        });
      }
    }
  };

  // Next chord in progression
  const nextChord = async () => {
    if (currentGuessIndex < progression.length - 1) {
      setCurrentGuessIndex(currentGuessIndex + 1);
      setShowAnswer(false);
      await new Promise(res => setTimeout(res, 200));
      playChord(progression[currentGuessIndex + 1], actualMode);
    }
  };

  // Next progression
  const nextProgression = () => {
    startTest();
  };

  // Restart test
  const restart = () => {
    setShowSetup(true);
  };

  // --- RENDER ---

  const chordDefs = actualMode === "major" ? CHORDS_MAJOR : CHORDS_MINOR;

  if (showSetup) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen bg-main-background">
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Chord Progression Test Setup</h1>
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
            <label className="block text-lg font-semibold mb-2">Mode:</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  checked={mode === "major"}
                  onChange={() => {
                    setMode("major");
                    setPreset("Custom");
                  }}
  
                /> Major
              </label>
              <label>
                <input
                  type="radio"
                  checked={mode === "minor"}
                  onChange={() => {
                    setMode("minor");
                    setPreset("Custom");
                  }}
  
                /> Minor
              </label>
              <label>
                <input
                  type="radio"
                  checked={mode === "random"}
                  onChange={() => {
                    setMode("random");
                    setPreset("Custom");
                  }}
  
                /> Random
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Select Chords (Major):</label>
            <div className="grid grid-cols-2 gap-2">
              {CHORDS_MAJOR.map(chord => (
                <label key={chord.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedChords.major.includes(chord.value)}
                    onChange={() => handleChordChange("major", chord.value)}
                  />
                  <span>{chord.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Select Chords (Minor):</label>
            <div className="grid grid-cols-2 gap-2">
              {CHORDS_MINOR.map(chord => (
                <label key={chord.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedChords.minor.includes(chord.value)}
                    onChange={() => handleChordChange("minor", chord.value)}
                  />
                  <span>{chord.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Number of chords in progression:</label>
            <input
              type="number"
              min={2}
              max={5}
              value={progressionLength}
              onChange={e => {
                setProgressionLength(Math.max(2, Math.min(5, Number(e.target.value))));
                setPreset("Custom");
              }}
              className="w-20 p-2 rounded border"
            />
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

  const currentChordValue = progression[currentGuessIndex];
  const currentChordObj = chordDefs.find(c => c.value === currentChordValue);

  return (
    <div className='pt-16'>
      <div className="main-font h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-main-background text-center lg:px-80">
        <div className="flex w-full justify-end pr-8">
          <button
            onClick={restart}
            className="mb-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Edit
          </button>
        </div>
        <h1 className="text-5xl font-medium text-gray-800 mb-4">Chord Progression Test</h1>
        {/* <div className="text-lg text-gray-700 mb-2">
          Key: <span className="font-bold">{midiToNoteName(rootMidi).replace(/\d+$/, '')} {actualMode}</span>
        </div> */}
        <div className="text-lg text-gray-700 mb-6">
          Score: <span className="font-bold">{score.correct}</span> / {score.total}
        </div>
        <div className="mb-2 text-xl font-semibold">
          {isInitialPlayback
            ? "Listen to the progression..."
            : progressionComplete
              ? "Progression Complete!"
              : `Chord ${currentGuessIndex + 1} of ${progression.length}`}
        </div>
        {isInitialPlayback ? (
          <button
            disabled
            className="bg-blue-200 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow mb-8 opacity-50 cursor-not-allowed"
          >
            Playing...
          </button>
        ) : progressionComplete ? (
          <button
            onClick={nextProgression}
            className="bg-green-500 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow mb-8 hover:bg-green-600"
          >
            Next Progression
          </button>
        ) : (
          <button
            onClick={() =>
              playChord(currentChordValue, actualMode)
            }
            disabled={!loaded}
            className={`bg-blue-400 text-white text-xl font-bold py-3 px-8 rounded-2xl shadow
              transition duration-300 ease-in-out transform scale-110 hover:bg-blue-500 hover:scale-115 mb-8
              ${!loaded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loaded ? "Play Chord" : "Loading Piano..."}
          </button>
        )}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {chordDefs.filter(c => selectedChords[actualMode].includes(c.value)).map((chord) => (
            <button
              key={chord.value}
              onClick={() => handleGuess(chord.value, currentGuessIndex)}
              className={`bg-blue-400 text-white text-lg font-bold py-2 px-6 rounded-2xl shadow
                transition duration-300 ease-in-out transform hover:bg-blue-500
                ${userGuesses[currentGuessIndex] === chord.value ? 'ring-4 ring-blue-300' : ''}`}
              disabled={isInitialPlayback || showAnswer || progressionComplete}
            >
              {chord.name}
            </button>
          ))}
        </div>
        {feedback[currentGuessIndex] && (
          <div className={`text-2xl font-semibold mb-4 ${feedback[currentGuessIndex] === 'Correct!' ? 'text-green-600' : 'text-red-500'}`}>
            {feedback[currentGuessIndex]}
          </div>
        )}
        {showAnswer && !progressionComplete && (
          <div>
            <div className="text-lg text-gray-700 mb-4">
              The chord was: <span className="font-bold">{currentChordObj?.name}</span>
            </div>
            {currentGuessIndex < progression.length - 1 ? (
              <button
                onClick={nextChord}
                className="bg-blue-400 text-white text-lg font-bold py-2 px-8 rounded-2xl shadow
                  transition duration-300 ease-in-out transform hover:bg-blue-500"
              >
                Next Chord
              </button>
            ) : null}
          </div>
        )}
        {progressionComplete && (
          <div className="text-2xl font-bold text-green-700 mt-4">
            {mistakeMade
              ? "Try for a perfect score next time!"
              : "Perfect! +1 point"}
          </div>
        )}
      </div>
    </div>
  );
}