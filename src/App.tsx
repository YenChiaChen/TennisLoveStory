import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { useGameStore } from "./store";
import { MainGame } from "./features/MainGame/MainGame";
import { TitleScreen } from "./features/TitleScreen/TitleScreen";
import { EndingScreen } from "./features/EndingScreen/EndingScreen";
import ScriptEditor from "./editor/ScriptEditor";

// 將原本的 App 內容抽成 Home component
const Home: React.FC = () => {
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const activeEndingId = useGameStore((state) => state.activeEndingId);

  useEffect(() => {
    console.log("App mounted. Initializing game systems...");
    const initialNodeId = useGameStore.getState().currentStoryNodeId;
    console.log("Initial story node from store:", initialNodeId);
  }, []);

  const startGame = () => setHasStartedGame(true);
  const handleReturnToTitle = useCallback(() => setHasStartedGame(false), []);

  return (
    <div className="font-sans w-screen h-screen bg-gray-100 overflow-hidden">
      <AnimatePresence>
        {activeEndingId && <EndingScreen returnToTitle={handleReturnToTitle} />}
      </AnimatePresence>

      {!activeEndingId && !hasStartedGame && (
        <TitleScreen onGameStart={startGame} />
      )}
      {!activeEndingId && hasStartedGame && <MainGame />}
    </div>
  );
};

// App 只負責 Routing
const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<ScriptEditor />} />
    </Routes>
  </Router>
);

export default App;
