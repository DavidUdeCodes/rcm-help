import { useState, useEffect } from 'react';
import techniqueData from '../data/techniqueData.js'; // Adjust path as needed
import Metronome from '../components/Metronome.jsx';

// Expanded enharmonics for all roots used in your data
const enharmonics = {
  "C": ["C"],
  "C#/Db": ["C#", "Db"],
  "D": ["D"],
  "D#/Eb": ["D#", "Eb"],
  "E": ["E"],
  "F": ["F"],
  "F#/Gb": ["F#", "Gb"],
  "G": ["G"],
  "G#/Ab": ["G#", "Ab"],
  "A": ["A"],
  "A#/Bb": ["A#", "Bb"],
  "B": ["B"]
};

const getPossibleKeys = (root, mode, selectedType, level) => {
  
  // For all other levels, use enharmonic logic as before
  const candidates = root === "Random"
    ? Object.values(enharmonics).flat()
    : enharmonics[root] || [root];
  let possibleKeys = [];
  if (mode === "Minor" && selectedType === "Scales") {
    possibleKeys = candidates.flatMap(r => [
      `${r} minor (harmonic)`,
      `${r} minor (melodic)`
    ]);
  } else if (mode === "Minor") {
    possibleKeys = candidates.map(r => `${r} minor`);
  } else if (mode === "Major") {
    possibleKeys = candidates.map(r => `${r} major`);
  } else {
    possibleKeys = candidates.flatMap(r => [
      `${r} major`,
      `${r} minor`,
      ...(selectedType === "Scales" ? [
        `${r} minor (harmonic)`,
        `${r} minor (melodic)`
      ] : [])
    ]);
  }
  return possibleKeys;
};

// NEW: Get valid roots for the current level, type, and mode
function getValidRoots(level, type, mode) {
  // For other levels, return all enharmonic roots
  return ["Random", ...Object.keys(enharmonics)];
}

const getArpeggioInversions = (arpeggioName, inversionSetting) => {
  if (inversionSetting === "Root only") return "Root position";
  const inversions = arpeggioName.includes("7th")
    ? ["Root position", "1st inversion", "2nd inversion", "3rd inversion"]
    : ["Root position", "1st inversion", "2nd inversion"];
  const randomIndex = Math.floor(Math.random() * inversions.length);
  return inversions[randomIndex];
};

const Technique = () => {
  const [level, setLevel] = useState("RCM Level 1");
  const [type, setType] = useState("Random");
  const [subtype, setSubtype] = useState("Random");
  const [root, setRoot] = useState("Random");
  const [mode, setMode] = useState("Random");
  const [arpeggioInversions, setArpeggioInversions] = useState("Root only");
  const [chordStyle, setChordStyle] = useState("Random");
  const [count, setCount] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [showMetronome, setShowMetronome] = useState(false);
  const [generationError, setGenerationError] = useState(false);

  useEffect(() => {
    setShowMetronome(false);
    setSelectedExercise(null);
    setSubtype("Random");
  }, [exercises, level, type]);

  const availableTypes = Object.keys(techniqueData[level]);
  const selectedTypeForRoots = type === "Random" ? availableTypes[0] : type;
  const availableSubtypes = type !== "Random" ? techniqueData[level][type].map(st => st.name) : [];

  // Use filtered roots
  const rootOptions = getValidRoots(level, selectedTypeForRoots, mode);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGenerationError(false);
    const levelData = techniqueData[level];
    if (!levelData) return;

    const types = type === "Random" ? Object.keys(levelData) : [type];
    const generated = [];
    let attempts = 0;
    const MAX_ATTEMPTS = 1000;

    while (generated.length < count && attempts < MAX_ATTEMPTS) {
      attempts++;
      const selectedType = types[Math.floor(Math.random() * types.length)];
      let options = levelData[selectedType];

      // Subtype filter
      if (subtype !== "Random") {
        options = options.filter(option => option.name === subtype);
        if (options.length === 0) continue;
      }

      // Chord style filter (if present)
      if (selectedType === "Chords" && chordStyle !== "Random") {
        options = options.filter(option => (option.style || "") === chordStyle);
        if (options.length === 0) continue;
      }

      let entry;
      let selectedKey = "N/A";

      // Random root and mode selection
      if (root === "Random" && mode === "Random") {
        entry = options[Math.floor(Math.random() * options.length)];
        selectedKey = entry.keys[Math.floor(Math.random() * entry.keys.length)];
      } else {
        const possibleKeys = getPossibleKeys(root, mode, selectedType, level);
        const matchingOptions = options.filter(option =>
          option.keys.some(k => possibleKeys.includes(k))
        );
        if (matchingOptions.length === 0) continue;
        entry = matchingOptions[Math.floor(Math.random() * matchingOptions.length)];
        const matchingKeys = entry.keys.filter(k => possibleKeys.includes(k));
        selectedKey = matchingKeys[Math.floor(Math.random() * matchingKeys.length)] || "N/A";
      }

      let exercise = {
        type: selectedType,
        name: entry.name,
        key: selectedKey,
        tempo: entry.tempo,
        style: entry.style
      };

      if (selectedType === "Arpeggios") {
        exercise.inversion = getArpeggioInversions(entry.name, arpeggioInversions);
      } else if (selectedType === "Chords") {
        exercise.style = entry.style;
      }

      generated.push(exercise);
    }

    if (generated.length < count) {
      setGenerationError(true);
      console.warn("Could not generate all requested exercises");
    }

    setExercises(generated);
  };

  // Chord style options (always match data)
  const chordStyleOptions = [
    { value: "Random", label: "Random" },
    { value: "solid/blocked", label: "Solid/Blocked" },
    { value: "broken", label: "Broken" }
  ];

  return (
    <div className="main-font min-h-screen flex flex-col items-center justify-center bg-main-background text-center p-4">
      <h1 className="text-5xl font-medium mb-8 mt-26 text-gray-800">Technique</h1>
      <h2 className="text-3xl mb-6 text-gray-700">Technique Exercise Generator</h2>

      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-xl text-left">
        <p className="mb-4 text-center">Select your preferences to generate exercises:</p>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium">RCM Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              {Object.keys(techniqueData).map(lvl => (
                <option key={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Technique Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option>Random</option>
              {availableTypes.map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {type !== "Random" && availableSubtypes.length > 1 && (
            <div>
              <label className="block font-medium">Subtype</label>
              <select
                value={subtype}
                onChange={e => setSubtype(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option>Random</option>
                {availableSubtypes.map(st => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium">Key Root</label>
            <select
              value={root}
              onChange={e => setRoot(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              {rootOptions.map(note => (
                <option key={note}>{note}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Major / Minor</label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option>Random</option>
              <option>Major</option>
              <option>Minor</option>
            </select>
          </div>

          {type === "Chords" && availableTypes.includes("Chords") && (
            <div>
              <label className="block font-medium">Chord Style</label>
              <select
                value={chordStyle}
                onChange={e => setChordStyle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                {chordStyleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {type === "Arpeggios" && availableTypes.includes("Arpeggios") && (
            <div>
              <label className="block font-medium">Arpeggio Inversions</label>
              <select
                value={arpeggioInversions}
                onChange={e => setArpeggioInversions(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option>Root only</option>
                <option>All Inversions</option>
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium">Number of Exercises</label>
            <input
              type="number"
              value={count}
              onChange={e => setCount(parseInt(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded"
              min={1} max={12}
            />
          </div>

          <div className='flex justify-center items-center space-x-10 mx-auto mt-6'>
            <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Generate Exercises
            </button>
            <h1 className='text-xl'>OR</h1>
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Practice Exam
            </button>
          </div>
        </form>

        {generationError && (
          <div className="text-red-500 mt-4">
            Could not generate all requested exercises. Please select different options.
          </div>
        )}

        {showMetronome && selectedExercise && (
          <>
            <h1 className="text-3xl font-semibold my-4 text-gray-800 text-center">Metronome</h1>
            <Metronome
              key={`${selectedExercise.name}-${selectedExercise.key}-${selectedExercise.tempo}-${exerciseKey}`}
              tempo={selectedExercise.tempo}
            />
            <h1
              onClick={() => setShowMetronome(false)}
              className="mt-2 px-6 pt-3 text-base font-medium text-center text-gray-700 hover:text-blue-500 "
            >
              Hide Metronome
            </h1>
          </>
        )}
        {!showMetronome && exercises.length > 0 && (
          <h1 className="text-xl font-semibold mt-6 text-gray-800 text-center">
            Click on an exercise to launch a metronome
          </h1>
        )}

        {exercises.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Generated Exercises:</h3>
            <ul className="list-disc list-inside space-y-4">
              {exercises.map((ex, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    setSelectedExercise({ ...ex });
                    setExerciseKey(k => k + 1);
                    setShowMetronome(true);
                  }}
                >
                  <strong>{ex.type}:</strong> {ex.name} in {ex.key}
                  {ex.inversion ? ` (${ex.inversion})` : ""}
                  {ex.style ? ` [${ex.style}]` : ""}
                  — Tempo: ♩={ex.tempo}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Technique;