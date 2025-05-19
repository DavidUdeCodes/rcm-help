// chordTestData.js

// Triads
export const TRIADS = [
  { name: "Major (Root)", group: "Triads", intervals: [0, 4, 7] },
  { name: "Major (1st Inv)", group: "Triads", intervals: [4, 7, 12] },
  { name: "Major (2nd Inv)", group: "Triads", intervals: [7, 12, 16] },
  { name: "Minor (Root)", group: "Triads", intervals: [0, 3, 7] },
  { name: "Minor (1st Inv)", group: "Triads", intervals: [3, 7, 12] },
  { name: "Minor (2nd Inv)", group: "Triads", intervals: [7, 12, 15] },
  { name: "Diminished (Root)", group: "Triads", intervals: [0, 3, 6] },
  { name: "Diminished (1st Inv)", group: "Triads", intervals: [3, 6, 12] },
  { name: "Diminished (2nd Inv)", group: "Triads", intervals: [6, 12, 15] },
  { name: "Augmented (Root)", group: "Triads", intervals: [0, 4, 8] },
  { name: "Augmented (1st Inv)", group: "Triads", intervals: [4, 8, 12] },
  { name: "Augmented (2nd Inv)", group: "Triads", intervals: [8, 12, 16] },
];

// Four Note Chords
export const FOUR_NOTE_CHORDS = [
  { name: "Major 4-note (Root)", group: "Four Note Chords", intervals: [0, 4, 7, 12] },
  { name: "Major 4-note (1st Inv)", group: "Four Note Chords", intervals: [4, 7, 12, 16] },
  { name: "Major 4-note (2nd Inv)", group: "Four Note Chords", intervals: [7, 12, 16, 19] },
  { name: "Minor 4-note (Root)", group: "Four Note Chords", intervals: [0, 3, 7, 12] },
  { name: "Minor 4-note (1st Inv)", group: "Four Note Chords", intervals: [3, 7, 12, 15] },
  { name: "Minor 4-note (2nd Inv)", group: "Four Note Chords", intervals: [7, 12, 15, 19] },
];

// Seventh Chords
export const SEVENTHS = [
  { name: "Major-Major 7th (Root)", group: "Seventh Chords", intervals: [0, 4, 7, 11] },
  { name: "Major-Major 7th (1st Inv)", group: "Seventh Chords", intervals: [4, 7, 11, 12] },
  { name: "Major-Major 7th (2nd Inv)", group: "Seventh Chords", intervals: [7, 11, 12, 16] },
  { name: "Major-Major 7th (3rd Inv)", group: "Seventh Chords", intervals: [11, 12, 16, 19] },
  { name: "Dominant 7th (Root)", group: "Seventh Chords", intervals: [0, 4, 7, 10] },
  { name: "Dominant 7th (1st Inv)", group: "Seventh Chords", intervals: [4, 7, 10, 12] },
  { name: "Dominant 7th (2nd Inv)", group: "Seventh Chords", intervals: [7, 10, 12, 14] },
  { name: "Dominant 7th (3rd Inv)", group: "Seventh Chords", intervals: [10, 12, 14, 17] },
  { name: "Minor-Minor 7th (Root)", group: "Seventh Chords", intervals: [0, 3, 7, 10] },
  { name: "Minor-Minor 7th (1st Inv)", group: "Seventh Chords", intervals: [3, 7, 10, 12] },
  { name: "Minor-Minor 7th (2nd Inv)", group: "Seventh Chords", intervals: [7, 10, 12, 15] },
  { name: "Minor-Minor 7th (3rd Inv)", group: "Seventh Chords", intervals: [10, 12, 15, 19] },
  { name: "Minor-Major 7th (Root)", group: "Seventh Chords", intervals: [0, 3, 7, 11] },
  { name: "Minor-Major 7th (1st Inv)", group: "Seventh Chords", intervals: [3, 7, 11, 12] },
  { name: "Minor-Major 7th (2nd Inv)", group: "Seventh Chords", intervals: [7, 11, 12, 15] },
  { name: "Minor-Major 7th (3rd Inv)", group: "Seventh Chords", intervals: [11, 12, 15, 19] },
  { name: "Diminished 7th (Root)", group: "Seventh Chords", intervals: [0, 3, 6, 9] },
  { name: "Diminished 7th (1st Inv)", group: "Seventh Chords", intervals: [3, 6, 9, 12] },
  { name: "Diminished 7th (2nd Inv)", group: "Seventh Chords", intervals: [6, 9, 12, 15] },
  { name: "Diminished 7th (3rd Inv)", group: "Seventh Chords", intervals: [9, 12, 15, 18] },
];

export const CHORDS = [...TRIADS, ...FOUR_NOTE_CHORDS, ...SEVENTHS];

const RCM1_CHORDS = [
  "Major (Root)",
  "Minor (Root)"
]

const RCM2_CHORDS = [
  "Major (Root)",
  "Minor (Root)"
]

const RCM3_CHORDS = [
  "Major (Root)",
  "Minor (Root)"
]

const RCM4_CHORDS = [
  "Major (Root)",
  "Minor (Root)"
]

const RCM5_CHORDS = [
  "Major (Root)",
  "Minor (Root)",
  "Dominant 7th (Root)"
]

const RCM6_CHORDS = [
  "Major (Root)",
  "Minor (Root)",
  "Dominant 7th (Root)",
  "Diminished 7th (Root)"
]

const RCM7_CHORDS = [
  "Major (Root)",
  "Minor (Root)",
  "Augmented (Root)",
  "Dominant 7th (Root)",
  "Diminished 7th (Root)",
]

const RCM8_CHORDS = [
  "Major (Root)",
  "Minor (Root)",
  "Augmented (Root)",
  "Dominant 7th (Root)",
  "Diminished 7th (Root)",
]

const RCM9_CHORDS = [
  "Major 4-note (Root)",
  "Major 4-note (1st Inv)",
  "Minor 4-note (Root)",
  "Minor 4-note (1st Inv)",
  "Augmented (Root)",
  "Dominant 7th (Root)",
  "Diminished 7th (Root)",
];

const RCM10_CHORDS = [
  "Major 4-note (Root)",
  "Major 4-note (1st Inv)",
  "Minor 4-note (Root)",
  "Minor 4-note (1st Inv)",
  "Augmented (Root)",
  "Diminished 7th (Root)",
  "Dominant 7th (Root)",
  "Minor-Minor 7th (Root)",
  "Major-Major 7th (Root)",
];

export const PRESETS = [
  {
    label: "Custom",
    chords: [],
  },
  {
    label: "RCM Level 1",
    chords: RCM1_CHORDS,
  },
  {
    label: "RCM Level 2",
    chords: RCM2_CHORDS,
  },
  {
    label: "RCM Level 3",
    chords: RCM3_CHORDS,
  },
  {
    label: "RCM Level 4",
    chords: RCM4_CHORDS,
  },
  {
    label: "RCM Level 5",
    chords: RCM5_CHORDS,
  },
  {
    label: "RCM Level 6",
    chords: RCM6_CHORDS,
  },
  {
    label: "RCM Level 7",
    chords: RCM7_CHORDS,
  },
  {
    label: "RCM Level 8",
    chords: RCM8_CHORDS,
  },
  {
    label: "RCM Level 9",
    chords: RCM9_CHORDS,
  },
  {
    label: "RCM Level 10",
    chords: RCM10_CHORDS,
  },
];