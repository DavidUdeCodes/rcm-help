import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home"; // This is your home page
import Technique from "./pages/Technique";
import NotFoundPage from "./pages/NotFoundPage";
import MetronomePage from "./pages/MetronomePage";
import EarTraining from "./pages/EarTraining";
import IntervalTest from "./pages/IntervalTest";
import ChordTest from "./pages/ChordTest";
import ChordPrgTest from "./pages/ChordPrgTest";
import MelodyPlayback from "./pages/MelodyPlayback";
import SightReading from "./pages/SightReading";
import EarPracticeTest from "./pages/EarPracticeTest";
import App from "./App"; // <-- Import the layout
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // The shared layout with Navbar
    children: [
      { index: true, element: <Home /> }, // home page
      { path: "technique", element: <Technique /> },
      { path: "metronome-page", element: <MetronomePage /> },
      { path: "ear-training", element: <EarTraining />},
      { path: "interval-test", element: <IntervalTest />},
      { path: "chord-test", element: <ChordTest />},
      { path: "chordprg-test", element: <ChordPrgTest />},
      { path: "melody-playback", element: <MelodyPlayback />},
      { path: "sight-reading", element: <SightReading />},
      { path: "ear-practice-test", element: <EarPracticeTest />},
      // add more pages here
    ],
  },
  { path: "*", element: <NotFoundPage /> }, // 404 fallback
  ]
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
