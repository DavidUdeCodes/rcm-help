// techniqueData.js

const techniqueData = {
  "RCM Level 1": {
    Scales: [
      {
        name: "Two-octave",
        keys: [
          "C major", "G major", "F major",
          "A minor (natural)", "A minor (harmonic)",
          "E minor (natural)", "E minor (harmonic)",
          "D minor (natural)", "D minor (harmonic)"
        ],
        tempo: 69
      },
      {
        name: "Contrary Motion",
        keys: ["C major"],
        tempo: 69
      },
      {
        name: "Chromatic",
        keys: ["Starting on C"],
        tempo: 69
      }
    ],
    Chords: [
      {
        name: "Tonic Triads",
        style: "broken",
        keys: ["C major", "G major", "F major", "A minor", "E minor", "D minor"],
        tempo: 50
      },
      {
        name: "Tonic Triads",
        style: "solid/blocked",
        keys: ["C major", "G major", "F major", "A minor", "E minor", "D minor"],
        tempo: 100
      }
    ]
    // No Arpeggios for RCM Level 1
  },
  "RCM Level 2": {
    Scales: [
      {
        name: "Two-octave",
        keys: [
          "G major", "F major", "Bb major",
          "E minor (harmonic)", "E minor (melodic)",
          "D minor (harmonic)", "D minor (melodic)",
          "G minor (harmonic)", "G minor (melodic)"
        ],
        tempo: 80
      },
      {
        name: "Formula Pattern",
        keys: ["C major", "G major"],
        tempo: 80
      },
      {
        name: "Chromatic",
        keys: ["Starting on G"],
        tempo: 80
      }
    ],
    Chords: [
      {
        name: "Tonic Triads",
        style: "broken",
        keys: ["G major", "F major", "Bb major", "E minor", "D minor", "G minor"],
        tempo: 60
      },
      {
        name: "Tonic Triads",
        style: "solid/blocked",
        keys: ["G major", "F major", "Bb major", "E minor", "D minor", "G minor"],
        tempo: 112
      }
    ]
    // No Arpeggios for RCM Level 2
  },
  "RCM Level 3": {
    Scales: [
      {
        name: "Two-octave",
        keys: [
          "D major", "F major", "Bb major",
          "B minor (harmonic)", "B minor (melodic)",
          "D minor (harmonic)", "D minor (melodic)",
          "G minor (harmonic)", "G minor (melodic)"
        ],
        tempo: 80
      },
      {
        name: "Formula Pattern",
        keys: ["D major"],
        tempo: 80
      },
      {
        name: "Chromatic",
        keys: ["Starting on D"],
        tempo: 80
      }
    ],
    Chords: [
      {
        name: "Tonic Triads",
        style: "broken",
        keys: ["D major", "F major", "Bb major", "B minor", "D minor", "G minor"],
        tempo: 69
      },
      {
        name: "Tonic Triads",
        style: "solid/blocked",
        keys: ["D major", "F major", "Bb major", "B minor", "D minor", "G minor"],
        tempo: 120
      }
    ]
    // No Arpeggios for RCM Level 3
  },
  "RCM Level 4": {
    Scales: [
      {
        name: "Two-octave",
        keys: [
          "D major", "A major", "Bb major", "Eb major",
          "B minor (harmonic)", "B minor (melodic)",
          "G minor (harmonic)", "G minor (melodic)",
          "C minor (harmonic)", "C minor (melodic)"
        ],
        tempo: 92
      },
      {
        name: "Formula Pattern",
        keys: ["C minor (harmonic)"],
        tempo: 92
      },
      {
        name: "Chromatic",
        keys: ["Starting on C"],
        tempo: 104
      }
    ],
    Chords: [
      {
        name: "Tonic Triads",
        style: "broken",
        keys: ["D major", "A major", "Bb major", "Eb major", "B minor", "G minor", "C minor"],
        tempo: 60
      },
      {
        name: "Tonic Triads",
        style: "solid/blocked",
        keys: ["D major", "A major", "Bb major", "Eb major", "B minor", "G minor", "C minor"],
        tempo: 120
      }
    ],
    Arpeggios: [
      {
        name: "Tonic",
        keys: ["D major", "A major", "Bb major", "Eb major", "B minor", "G minor", "C minor"],
        tempo: 72
      }
    ]
  },
  "RCM Level 5": {
    Scales: [
      {
        name: "Two-octave",
        keys: [
          "A major", "E major", "F major", "Ab major",
          "A minor (harmonic)", "A minor (melodic)",
          "E minor (harmonic)", "E minor (melodic)",
          "F minor (harmonic)", "F minor (melodic)"
        ],
        tempo: 92
      },
      {
        name: "Formula Pattern",
        keys: ["A major", "A minor (harmonic)"],
        tempo: 92
      },
      {
        name: "Chromatic",
        keys: ["Starting on A", "Starting on F"],
        tempo: 104
      }
    ],
    Chords: [
      {
        name: "Tonic Triads",
        style: "broken",
        keys: ["A major", "E major", "F major", "Ab major", "A minor", "E minor", "F minor"],
        tempo: 60
      },
      {
        name: "Tonic Triads",
        style: "solid/blocked",
        keys: ["A major", "E major", "F major", "Ab major", "A minor", "E minor", "F minor"],
        tempo: 120
      }
    ],
    Arpeggios: [
      {
        name: "Tonic",
        keys: ["A major", "E major", "F major", "Ab major", "A minor", "E minor", "F minor"],
        tempo: 72
      }
    ]
  },
  "RCM Level 6": {
    Scales: [
      {
        name: "Two-octave",
        keys: [
          "G major", "E major", "B major", "Db major",
          "G minor (harmonic)", "G minor (melodic)",
          "E minor (harmonic)", "B minor (harmonic)", "C# minor (harmonic)", "C# minor (melodic)"
        ],
        tempo: 60
      },
      {
        name: "Formula Pattern",
        keys: ["E major", "E minor (harmonic)"],
        tempo: 60
      },
      {
        name: "Chromatic",
        keys: ["Starting on E", "Starting on Db"],
        tempo: 60
      }
    ],
    Chords: [
      {
        name: "Tonic Triads",
        style: "broken",
        keys: ["G major", "E major", "B major", "Db major"],
        tempo: 80
      },
      {
        name: "Tonic Triads",
        style: "solid/blocked",
        keys: ["G major", "E major", "B major", "Db major", "G minor", "E minor", "B minor", "C# minor"],
        tempo: 80
      },
      {
        name: "Dominant 7th Chords",
        style: "broken",
        keys: ["G major", "E major", "B major", "Db major"],
        tempo: 88
      },
      {
        name: "Dominant 7th Chords",
        style: "solid/blocked",
        keys: ["G major", "E major", "B major", "Db major"],
        tempo: 72
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "broken",
        keys: ["G major", "E major", "B major", "C# minor"],
        tempo: 88
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "solid/blocked",
        keys: ["G major", "E major", "B major", "C# minor"],
        tempo: 72
      }
    ],
    Arpeggios: [
      {
        name: "Tonic",
        keys: ["G major", "E major", "B major", "Db major", "G minor", "E minor", "B minor", "C# minor"],
        tempo: 92
      },
      {
        name: "Dominant 7th",
        keys: ["G major", "E major", "B major", "Db major"],
        tempo: 92
      },
      {
        name: "Leading-tone Diminished 7th",
        keys: ["G minor", "E minor", "B minor", "C# minor"],
        tempo: 92
      }
    ]
  },
  "RCM Level 7": {
    Scales: [
      {
        name: "Two-octave",
        keys: [
          "C major", "D major", "F major", "Ab major", "Gb major",
          "C minor (harmonic)", "D minor (harmonic)", "F minor (harmonic)", "G# minor (harmonic)", "F# minor (harmonic)",
          "C minor (melodic)", "D minor (melodic)", "F minor (melodic)", "G# minor (melodic)", "F# minor (melodic)"
        ],
        tempo: 76
      },
      {
        name: "Formula Pattern",
        keys: ["D major", "D minor (harmonic)"],
        tempo: 76
      },
      {
        name: "Chromatic",
        keys: ["Starting on D", "Starting on Gb"],
        tempo: 76
      }
    ],
    Chords: [
      {
        name: "Tonic Four-Note",
        style: "broken",
        keys: [
          "C major", "D major", "F major", "Ab major", "Gb major",
          "C minor", "D minor", "F minor", "G# minor", "F# minor"
        ],
        tempo: 60
      },
      {
        name: "Dominant 7th Chords",
        style: "broken",
        keys: ["C major", "D major", "F major", "Ab major", "Gb major"],
        tempo: 60
      },
      {
        name: "Dominant 7th Chords",
        style: "solid/blocked",
        keys: ["C major", "D major", "F major", "Ab major", "Gb major"],
        tempo: 80
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "broken",
        keys: ["C minor", "D minor", "F minor", "G# minor", "F# minor"],
        tempo: 60
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "solid/blocked",
        keys: ["C minor", "D minor", "F minor", "G# minor", "F# minor"],
        tempo: 80
      }
    ],
    Arpeggios: [
      {
        name: "Tonic",
        keys: [
          "C major", "D major", "F major", "Ab major", "Gb major",
          "C minor", "D minor", "F minor", "G# minor", "F# minor"
        ],
        tempo: 60
      },
      {
        name: "Dominant 7th",
        keys: ["C major", "D major", "F major", "Ab major", "Gb major"],
        tempo: 60
      },
      {
        name: "Leading-tone Diminished 7th",
        keys: ["C minor", "D minor", "F minor", "G# minor", "F# minor"],
        tempo: 60
      }
    ]
  },
  "RCM Level 8": {
    Scales: [
      {
        name: "Four-octave",
        keys: [
          "C major", "D major", "E major", "Bb major", "Eb major", "Gb major",
          "C minor (harmonic)", "C minor (melodic)",
          "D minor (harmonic)", "D minor (melodic)",
          "E minor (harmonic)", "E minor (melodic)",
          "Bb minor (harmonic)", "Bb minor (melodic)",
          "Eb minor (harmonic)", "Eb minor (melodic)",
          "F# minor (harmonic)", "F# minor (melodic)"
        ],
        tempo: 88
      },
      {
        name: "Formula Pattern",
        keys: ["Eb major", "Eb minor (harmonic)"],
        tempo: 88
      },
      {
        name: "Chromatic",
        keys: ["Starting on Eb", "Starting on E"],
        tempo: 88
      }
    ],
    Chords: [
      {
        name: "Tonic Four-Note",
        style: "broken",
        keys: [
          "C major", "D major", "E major", "Bb major", "Eb major", "Gb major",
          "C minor", "D minor", "E minor", "Bb minor", "Eb minor", "F# minor"
        ],
        tempo: 80
      },
      {
        name: "Dominant 7th Chords",
        style: "broken",
        keys: ["C major", "D major", "E major", "Bb major", "Eb major", "Gb major"],
        tempo: 80
      },
      {
        name: "Dominant 7th Chords",
        style: "solid/blocked",
        keys: ["C major", "D major", "E major", "Bb major", "Eb major", "Gb major"],
        tempo: 100
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "broken",
        keys: ["C minor", "D minor", "E minor", "Bb minor", "Eb minor", "F# minor"],
        tempo: 80
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "solid/blocked",
        keys: ["C minor", "D minor", "E minor", "Bb minor", "Eb minor", "F# minor"],
        tempo: 100
      }
    ],
    Arpeggios: [
      {
        name: "Tonic",
        keys: [
          "C major", "D major", "E major", "Bb major", "Eb major", "Gb major",
          "C minor", "D minor", "E minor", "Bb minor", "Eb minor", "F# minor"
        ],
        tempo: 69
      },
      {
        name: "Dominant 7th",
        keys: ["C major", "D major", "E major", "Bb major", "Eb major", "Gb major"],
        tempo: 69
      },
      {
        name: "Leading-tone Diminished 7th",
        keys: ["C minor", "D minor", "E minor", "Bb minor", "Eb minor", "F# minor"],
        tempo: 69
      }
    ]
  },
  "RCM Level 9": {
    Scales: [
      {
        name: "Four-octave",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor (harmonic)", "C minor (melodic)",
          "Db minor (harmonic)", "Db minor (melodic)",
          "D minor (harmonic)", "D minor (melodic)",
          "Eb minor (harmonic)", "Eb minor (melodic)",
          "E minor (harmonic)", "E minor (melodic)",
          "F minor (harmonic)", "F minor (melodic)"
        ],
        tempo: 104
      },
      {
        name: "Formula Pattern",
        keys: [
          "F major", "Db major",
          "F minor (harmonic)", "C# minor (harmonic)"
        ],
        tempo: 104
      },
      {
        name: "Chromatic",
        keys: ["C major", "Db major", "D major", "Eb major", "E major", "F major"],
        tempo: 104
      },
      {
        name: "In Octaves (solid/blocked staccato)",
        keys: ["F major", "Db major", "F minor (harmonic)", "C# minor (harmonic)"],
        tempo: 60
      },
      {
        name: "In Octaves (broken legato)",
        keys: ["F major", "Db major", "F minor (harmonic)", "C# minor (harmonic)"],
        tempo: 72
      }
    ],
    Chords: [
      {
        name: "Tonic Four-Note",
        style: "broken",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 104
      },
      {
        name: "Tonic Four-Note",
        style: "solid/blocked",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 80
      },
      {
        name: "Tonic Four-Note (broken alternate-note pattern)",
        style: "broken",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 80
      },
      {
        name: "Dominant 7th Chords",
        style: "broken",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 104
      },
      {
        name: "Dominant 7th Chords",
        style: "solid/blocked",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 104
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "broken",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 104
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "solid/blocked",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 104
      }
    ],
    Arpeggios: [
      {
        name: "Tonic",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 84
      },
      {
        name: "Dominant 7th",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 84
      },
      {
        name: "Leading-tone Diminished 7th",
        keys: [
          "C major", "Db major", "D major", "Eb major", "E major", "F major",
          "C minor", "C# minor", "D minor", "Eb minor", "E minor", "F minor"
        ],
        tempo: 84
      }
    ]
  },
  "RCM Level 10": {
    Scales: [
      {
        name: "Four-octave",
        keys: [
          "Gb major", "G major", "Ab major", "A major", "Bb major", "B major",
          "F# minor (harmonic)", "F# minor (melodic)",
          "G minor (harmonic)", "G minor (melodic)",
          "G# minor (harmonic)", "G# minor (melodic)",
          "A minor (harmonic)", "A minor (melodic)",
          "Bb minor (harmonic)", "Bb minor (melodic)",
          "B minor (harmonic)", "B minor (melodic)"
        ],
        tempo: 120
      },
      {
        name: "Separated by a 3rd",
        keys: ["Gb major", "G major", "Ab major"],
        tempo: 104
      },
      {
        name: "Separated by a 6th",
        keys: ["A major", "Bb major", "B major"],
        tempo: 104
      },
      {
        name: "In Octaves",
        keys: ["Bb", "Bb minor", "B", "B minor"],
        tempo: 80
      },
      {
        name: "Chromatic in Octaves",
        keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major"],
        tempo: 80
      }
    ],
    Chords: [
      {
        name: "Tonic Four-Note",
        style: "broken",
        keys: [
          "Gb major", "G major", "Ab major", "A major", "Bb major", "B major",
          "F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"
        ],
        tempo: 96
      },
      {
        name: "Tonic Four-Note",
        style: "solid/blocked",
        keys: [
          "Gb major", "G major", "Ab major", "A major", "Bb major", "B major",
          "F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"
        ],
        tempo: 120
      },
      {
        name: "Dominant 7th Chords",
        style: "broken",
        keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major"],
        tempo: 96
      },
      {
        name: "Dominant 7th Chords",
        style: "solid/blocked",
        keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major"],
        tempo: 120
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "broken",
        keys: ["F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"],
        tempo: 96
      },
      {
        name: "Leading-tone Diminished 7th Chords",
        style: "solid/blocked",
        keys: ["F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"],
        tempo: 120
      }
    ],
    Arpeggios: [
      {
        name: "Tonic",
        keys: [
          "Gb major", "G major", "Ab major", "A major", "Bb major", "B major",
          "F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"
        ],
        tempo: 92
      },
      {
        name: "Dominant 7th",
        keys: ["Gb major", "G major", "Ab major", "A major", "Bb major", "B major"],
        tempo: 92
      },
      {
        name: "Leading-tone Diminished 7th",
        keys: ["F# minor", "G minor", "G# minor", "A minor", "Bb minor", "B minor"],
        tempo: 92
      }
    ]
  }
};

export default techniqueData;