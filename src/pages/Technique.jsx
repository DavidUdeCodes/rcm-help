import { useState, useEffect } from 'react';
import Metronome from '../components/Metronome.jsx';

const techniqueData10 = {
  Scales: [
    { name: "Four-octave", keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major", 
      "F# minor (harmonic)", "F# minor (melodic)",
      "G minor (harmonic)", "G minor (melodic)",
      "G# minor (harmonic)", "G# minor (melodic)",
      "A minor (harmonic)", "A minor (melodic)",
      "Bb minor (harmonic)", "Bb minor (melodic)",
      "B minor (harmonic)", "B minor (melodic)"], tempo: 120 },
    { name: "Separated by a 3rd", keys: ["Gb major", "G major", "Ab major"], tempo: 104 },
    { name: "Separated by a 6th", keys: ["A major", "Bb major", "B major"], tempo: 104 },
    { name: "In Octaves", keys: ["Bb", "Bb minor", "B", "B minor"], tempo: 80 },
    { name: "Chromatic in Octaves", keys: ["any note F#–B"], tempo: 80 },
  ],
  Chords: [
    { name: "Tonic Four-note (broken)", keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major", "F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"], tempo: 96, style: "broken" },
    { name: "Tonic Four-note (solid)", keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major", "F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"], tempo: 120, style: "solid" },
    { name: "Dominant 7th (broken)", keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major"], tempo: 96, style: "broken" },
    { name: "Dominant 7th (solid)", keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major"], tempo: 120, style: "solid" },
    { name: "Leading-tone Dim 7th (broken)", keys: ["F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"], tempo: 96, style: "broken" },
    { name: "Leading-tone Dim 7th (solid)", keys: ["F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"], tempo: 120, style: "solid" },
  ],
  Arpeggios: [
    { name: "Tonic", keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major", "F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"], tempo: 92 },
    { name: "Dominant 7th", keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major"], tempo: 92 },
    { name: "Leading-tone Dim 7th", keys: ["F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"], tempo: 92 },
  ]
};

const enharmonics = {
  "Gb/F#": ["Gb", "F#"],
  "Ab/G#": ["Ab", "G#"],
  "A": ["A"],
  "Bb": ["Bb"],
  "B": ["B"],
  "G": ["G"],
};

// Function to get possible keys based on root and mode
const getPossibleKeys = (root, mode, selectedType) => {
  const candidates = root === "Random" ? Object.values(enharmonics).flat() : enharmonics[root] || [root];
  let possibleKeys = [];

  if (mode === "Minor" && selectedType === "Scales") {
    possibleKeys = candidates.flatMap(r => [
      `${r} minor (harmonic)`,
      `${r} minor (melodic)`
    ]);
  } 
  else if (mode === "Minor") {
    possibleKeys = candidates.map(r => `${r} minor`);
  } 
  else if (mode === "Major") {
    possibleKeys = candidates.map(r => `${r} major`);
  } 
  else {
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

const getArpeggioInversions = (arpeggioName, inversionSetting) => {
  if (inversionSetting === "Root only") {
    return "Root position";
  }
  
  // Create the array of possible inversions
  const inversions = arpeggioName.includes("7th")
    ? ["Root position", "1st inversion", "2nd inversion", "3rd inversion"]
    : ["Root position", "1st inversion", "2nd inversion"];
    
  // Select a random inversion from the array
  const randomIndex = Math.floor(Math.random() * inversions.length);
  return inversions[randomIndex];
};

const Technique = () => {
  const [level] = useState("Level 10");
  const [root, setRoot] = useState("Random");
  const [mode, setMode] = useState("Random");
  const [type, setType] = useState("Random");
  const [arpeggioInversions, setArpeggioInversions] = useState("Root only");
  const [count, setCount] = useState(1);
  const [chordStyle, setChordStyle] = useState("Random");
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [showMetronome, setShowMetronome] = useState(false);

  useEffect(() => {
    setShowMetronome(false); // Always hide metronome after generating new exercises
    setSelectedExercise(null);
  }, [exercises]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const types = type === "Random" ? Object.keys(techniqueData10) : [type];
    const generated = [];
    let attempts = 0;
    const MAX_ATTEMPTS = 1000; // Prevent infinite loops
  
    while (generated.length < count && attempts < MAX_ATTEMPTS) {
      attempts++;
      const selectedType = types[Math.floor(Math.random() * types.length)];
      let options = techniqueData10[selectedType];
  
      if (selectedType === "Chords" && chordStyle !== "Random") {
        options = options.filter(option => option.style === chordStyle.toLowerCase());
      }
  
      let entry;
      let selectedKey = "N/A";
  
      // Random root and mode selection
      if (root === "Random" && mode === "Random") {
        entry = options[Math.floor(Math.random() * options.length)];
        selectedKey = entry.keys[Math.floor(Math.random() * entry.keys.length)];
      } else {
        const possibleKeys = getPossibleKeys(root, mode, selectedType);
        const matchingOptions = options.filter(option =>
          option.keys.some(k => possibleKeys.includes(k))
        );
  
        if (matchingOptions.length === 0) continue;
  
        entry = matchingOptions[Math.floor(Math.random() * matchingOptions.length)];
        const matchingKeys = entry.keys.filter(k => possibleKeys.includes(k));
        selectedKey = matchingKeys[Math.floor(Math.random() * matchingKeys.length)] || "N/A";
      }
  
      // Create the exercise object based on type
      let exercise = {
        type: selectedType,
        name: entry.name,
        key: selectedKey,
        tempo: entry.tempo
      };
  
      // Add type-specific properties
      if (selectedType === "Arpeggios") {
        exercise.inversion = getArpeggioInversions(entry.name, arpeggioInversions);
      } else if (selectedType === "Chords") {
        exercise.style = entry.style;
      }
  
      generated.push(exercise);
    }
  
    if (generated.length < count) {
      console.warn("Could not generate all requested exercises");
    }
  
    setExercises(generated);
  };

  return (
    <div className="main-font min-h-screen flex flex-col items-center justify-center bg-main-background text-center p-4">
      <h1 className="text-5xl font-medium mb-8 mt-26 text-gray-800">RCM Help</h1>
      <h2 className="text-3xl mb-6 text-gray-700">Technique Exercise Generator</h2>

      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-xl text-left">
        <p className="mb-4">Select your preferences to generate exercises:</p>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium">RCM Level</label>
            <select className="w-full border border-gray-300 p-2 rounded" disabled>
              <option>{level}</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Key Root</label>
            <select value={root} onChange={(e) => setRoot(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option>Random</option>
              {Object.keys(enharmonics).map((note) => (
                <option key={note}>{note}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Major / Minor</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option>Random</option>
              <option>Major</option>
              <option>Minor</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Technique Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option>Random</option>
              <option>Scales</option>
              <option>Chords</option>
              <option>Arpeggios</option>
            </select>
          </div>

          {type === "Chords" && (
            <div>
              <label className="block font-medium">Chord Style</label>
              <select value={chordStyle} onChange={(e) => setChordStyle(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
                <option>Random</option>
                <option>Solid</option>
                <option>Broken</option>
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium">Arpeggio Inversions</label>
            <select value={arpeggioInversions} onChange={(e) => setArpeggioInversions(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option>Root only</option>
              <option>All Inversions</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Number of Exercises</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded"
              min={1} max={12}
            />
          </div>

          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Generate
          </button>

        </form>

        {/* Metronome and Hide button */}
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