import React, { useCallback, useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // If using routing
import { useGameStore } from "./store"; // Import stores
import { MainGame } from "./features/MainGame/MainGame";
import { TitleScreen } from "./features/TitleScreen/TitleScreen";
import { EndingScreen } from "./features/EndingScreen/EndingScreen"; // Import EndingScreen
import { AnimatePresence } from "framer-motion";

// Import Engine instances if needed globally (or manage them within features)
// import { storyEngine } from './engines/StoryEngine';
// import { gameStateManager } from './engines/GameStateManager';

function App() {
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const activeEndingId = useGameStore((state) => state.activeEndingId);
  // Example: Initialize or load something on app start
  useEffect(() => {
    console.log("App mounted. Initializing game systems...");
    // Potential place to load initial assets or check save states
    // Ensure Zustand state is hydrated from localStorage (persist middleware handles this)
    const initialNodeId = useGameStore.getState().currentStoryNodeId;
    console.log("Initial story node from store:", initialNodeId);

    // If not using persist middleware for hydration, you might manually load here:
    // gameStateManager.loadInitialStateOrFromStorage(); // Example custom logic
  }, []);

  const startGame = () => {
    console.log("Starting game...");
    setHasStartedGame(true);
  };

  const handleReturnToTitle = useCallback(() => {
    console.log("App: Returning to title...");
    setHasStartedGame(false); // Set state to show TitleScreen
    // State resets (game, characters) are handled within EndingScreen's button click now
  }, []);

  return (
    <div className="font-sans w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Render Ending Screen on top if active */}
      <AnimatePresence>
        {activeEndingId && <EndingScreen returnToTitle={handleReturnToTitle} />}
      </AnimatePresence>

      {/* Conditionally render TitleScreen or MainGame underneath */}
      {/* We might hide MainGame when ending is active to prevent interaction */}
      {!activeEndingId && !hasStartedGame && (
        <TitleScreen onGameStart={startGame} />
      )}
      {!activeEndingId && hasStartedGame && <MainGame />}
    </div>
  );
}

export default App;
