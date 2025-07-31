export  const intervals = [
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
  { name: "Perfect Octave", semitones: 12 },
  { name: "Minor 9th", semitones: 13 },
  { name: "Major 9th", semitones: 14 },
];

export const PRESETS = [
  {
    label: "Custom",
    intervals: [],
  },
  {
    label: "RCM Level 1",
    intervals: ["Minor 3rd", "Major 3rd"]
  },
  {
    label: "RCM Level 2",
    intervals: ["Minor 3rd", "Major 3rd", "Perfect 5th"]
  },
  {
    label: "RCM Level 3",
    intervals: ["Minor 3rd", "Major 3rd", "Perfect 4th", "Perfect 5th"]
  },
  {
    label: "RCM Level 4",
    intervals: ["Minor 3rd", "Major 3rd", "Perfect 4th", "Perfect 5th", "Perfect Octave"]
  },
  {
    label: "RCM Level 5",
    intervals: ["Minor 3rd", "Major 3rd", "Perfect 4th", "Perfect 5th", "Minor 6th", "Major 6th", "Perfect Octave"]
  },
  {
    label: "RCM Level 6",
    intervals: ["Minor 2nd", "Major 2nd","Minor 3rd", "Major 3rd", "Perfect 4th", "Perfect 5th", "Minor 6th", "Major 6th", "Perfect Octave"]
  },
  {
    label: "RCM Level 7",
    intervals: ["Minor 2nd", "Major 2nd","Minor 3rd", "Major 3rd", "Perfect 4th", "Perfect 5th", "Minor 6th", "Major 6th","Minor 7th", "Major 7th", "Perfect Octave"]
  },
  {
    label: "RCM Level 8",
    intervals: intervals.filter(i => i.semitones <= 12).map(i => i.name)
  },
  {
    label: "RCM Level 9",
    intervals: intervals.filter(i => i.semitones <= 12).map(i => i.name)
  },
  {
    label: "RCM Level 10",
    intervals: intervals.map(i => i.name),
  }
];

export const PLAYBACK_MODES = [
  { label: "Ascending", value: "ascending" },
  { label: "Descending", value: "descending" },
  { label: "Harmonic", value: "together" },
];