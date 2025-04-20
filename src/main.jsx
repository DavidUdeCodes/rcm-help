import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home"; // This is your home page
import Technique from "./pages/Technique";
import NotFoundPage from "./pages/NotFoundPage";
import MetronomePage from "./pages/MetronomePage";
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
      // add more pages here
    ],
  },
  { path: "*", element: <NotFoundPage /> }, // 404 fallback
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
