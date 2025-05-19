export const CHORDS_MAJOR = [
  { name: "Tonic (I)", value: "I", notes: [0, 4, 7, 12] },
  { name: "Subdominant (IV)", value: "IV", notes: [5, 9, 12, 17] },
  { name: "Dominant (V)", value: "V", notes: [7, 11, 14, 19] },
  { name: "Submediant (vi)", value: "vi", notes: [9, 12, 16, 21] },
  { name: "Cadential 6/4 (I6/4)", value: "I6/4", notes: [7, 12, 16, 19] },
];

export const CHORDS_MINOR = [
  { name: "Tonic (i)", value: "i", notes: [0, 3, 7, 12] },
  { name: "Subdominant (iv)", value: "iv", notes: [5, 8, 12, 17] },
  { name: "Dominant (V)", value: "V", notes: [7, 11, 14, 19] },
  { name: "Submediant (VI)", value: "VI", notes: [8, 12, 15, 20] },
  { name: "Cadential 6/4 (i6/4)", value: "i6/4", notes: [7, 12, 15, 19] },
];

export const PRESET_PROGRESSION_MAP = {
  "RCM Level 5": [
    ["I", "IV", "I"],
    ["I", "V", "I"],
  ],
  "RCM Level 6": [
    ["I", "IV", "I"],
    ["I", "V", "I"],
    ["i", "iv", "i"],
    ["i", "V", "i"],
  ],
  "RCM Level 7": [
    ["I", "IV", "I"],
    ["I", "V", "I"],
    ["i", "iv", "i"],
    ["i", "V", "i"],
    ["I", "IV", "V"],
    ["i", "iv", "V"],
  ],
  "RCM Level 8": [ 
    ["I", "IV", "V", "I"],
    ["I", "IV", "V", "vi"],
    ["I", "vi", "IV", "V"],
    ["I", "vi", "IV", "I"],
    ["i", "iv", "V", "i"],
    ["i", "iv", "V", "VI"],
    ["i", "VI", "iv", "V"],
    ["i", "VI", "iv", "i"]
  ]
};

const RCM5 = {
  major: ["I", "IV", "V"],
  minor: []
};

const RCM6 = {
  major: ["I", "IV", "V"],
  minor: ["i", "iv", "V"],
};

const RCM7 = {
  major: ["I", "IV", "V"],
  minor: ["i", "iv", "V"],
}

const RCM8 = {
  major: ["I", "IV", "V", "vi"],
  minor: ["i", "iv", "V", "VI"],
};

const RCM9 = {
  major: ["I", "IV", "V", "vi"],
  minor: ["i", "iv", "V", "VI"],
};

const RCM10 = {
  major: ["I", "IV", "V", "vi", "I6/4"],
  minor: ["i", "iv", "V", "VI", "i6/4"],
};

export const PRESETS = [
  { label: "Custom", major: [], minor: [] },
  { label: "RCM Level 5", ...RCM5 },
  { label: "RCM Level 6", ...RCM6 },
  { label: "RCM Level 7", ...RCM7 },
  { label: "RCM Level 8", ...RCM8 },
  { label: "RCM Level 9", ...RCM9 },
  { label: "RCM Level 10", ...RCM10 },
];