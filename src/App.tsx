import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // If using routing
import { useGameStore } from './store'; // Import stores
import { MainGame } from './featuyres/MainGame/MainGame';

// Import Engine instances if needed globally (or manage them within features)
// import { storyEngine } from './engines/StoryEngine';
// import { gameStateManager } from './engines/GameStateManager';

function App() {
  // Example: Initialize or load something on app start
  useEffect(() => {
    console.log('App mounted. Initializing game systems...');
    // Potential place to load initial assets or check save states
    // Ensure Zustand state is hydrated from localStorage (persist middleware handles this)
    const initialNodeId = useGameStore.getState().currentStoryNodeId;
    console.log("Initial story node from store:", initialNodeId);

    // If not using persist middleware for hydration, you might manually load here:
    // gameStateManager.loadInitialStateOrFromStorage(); // Example custom logic

  }, []);

  return (
    <div className="font-sans w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Basic structure - Replace with Router if needed */}
      <MainGame />

      {/* Example using React Router */}
      {/* <Router>
        <Routes>
          <Route path="/title" element={<TitleScreen />} />
          <Route path="/game" element={<MainGame />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/" element={<MainGame />} /> // Default route
        </Routes>
      </Router> */}

      {/* You might add global UI elements here like a loading overlay */}
    </div>
  );
}

export default App;