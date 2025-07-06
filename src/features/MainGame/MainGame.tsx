import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGameStore, useCharacterStore } from "../../store";
import { StoryEngine } from "../../engines/StoryEngine";
import { MAIN_STORY } from "../../data/story/main_story"; // Import the actual story data
import { getCharacterById, CHARACTERS_DATA } from "../../data/characters"; // Import character data
import type { StoryNode, Choice } from "../../types";
import { SettingsScreen } from "../SettingScreen/SettingScreen";
import { COMBINED_STORY_DATA } from "../../data/story/senpai_A_sidequest_1";

// Import UI Components
import { BackgroundDisplay } from "../../components/BackgroundDisplay";
import { CharacterSprite } from "../../components/CharacterSprite";
import { DialogueBox } from "../../components/DialogueBox";
import { ChoiceButton } from "../../components/ChoiceButton";
import { getSceneById } from "../../data/scenes";
import { MapView } from "../MapView/MapView";
import { AnimatePresence, motion } from "framer-motion";
import { EventTitleDisplay } from "../../components/EventTitleDisplay";
import { AffectionIndicatorManager } from "../../components/AffectionChangeIndicator";
import { PhoneScreen } from "../PhoneScreen/PhoneScreen";

// Placeholder for MiniGame components mapping
// import { TennisRallyGame } from './MiniGames/TennisRally/TennisRallyGame';
const MiniGameComponents: Record<
  string,
  React.FC<{ onComplete: (result: any) => void }>
> = {
  // 'tennis_rally': TennisRallyGame,
  // Add other minigames here
};

export const MainGame: React.FC = () => {
  // --- State from Stores ---
  const currentStoryNodeId = useGameStore((state) => state.currentStoryNodeId);
  const activeMiniGameId = useGameStore((state) => state.activeMiniGameId);
  const setActiveMiniGame = useGameStore((state) => state.setActiveMiniGame);
  const characterStates = useCharacterStore((state) => state.characters); // Get all character states for conditions/effects

  const resetGameState = useGameStore((state) => state.resetGameState); // 獲取 reset action
  const resetCharacterStates = useCharacterStore(
    (state) => state.resetCharacterStates
  ); // 獲取 reset action

  // --- Local Component State ---
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0); // For multi-part dialogue
  const [showChoices, setShowChoices] = useState(false);
  const [speakerName, setSpeakerName] = useState<string | null>(null);
  const isPhoneUnlocked = useGameStore((state) => state.isPhoneUnlocked);
  const isPhoneOpen = useGameStore((state) => state.isPhoneOpen);
  const openPhone = useGameStore((state) => state.openPhone);
  const [isMapOpen, setIsMapOpen] = useState(false); // New state for map view
  const [currentCharacterSprite, setCurrentCharacterSprite] = useState<
    string | null
  >(null);
  const [currentBackground, setCurrentBackground] = useState<string | null>(
    null
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const handleToggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

   const unreadCount = useGameStore((state) => state.unreadMessages.length);

  const miniGameReturnContext = useGameStore(
    (state) => state.miniGameReturnContext
  );
  const handleDebugReset = useCallback(() => {
    if (window.confirm("確定要重置所有遊戲進度到初始狀態嗎？(僅限 Debug)")) {
      console.log("DEBUG: Resetting game state...");
      // 調用各個 store 的 reset action
      resetGameState();
      resetCharacterStates();
      // 如果需要，也重置設定
      // resetSettings();
      // 你可能還需要手動清除一些非 store 管理的臨時狀態，如果有的話
      setCurrentNode(null); // 清除當前節點狀態，讓 useEffect 重新獲取 'start' 節點
      setShowChoices(false);
      setDialogueIndex(0);
      console.log("DEBUG: Game state reset complete.");
      // 頁面可能會因為狀態變動自動刷新，或者你可以強制刷新 (雖然通常不推薦)
      // window.location.reload();
    }
  }, [resetGameState, resetCharacterStates]); // 包含依賴項

  const handleEventTitleClick = useCallback(() => {
    if (!currentNode || currentNode.nodeType !== "eventTitle") return;

    if (currentNode.nextNodeId) {
      // Advance to the next node
      useGameStore.getState().setStoryNode(currentNode.nextNodeId);
    } else {
      console.warn("EventTitle node has no nextNodeId:", currentNode.id);
      // Potentially hang here, or maybe auto-close the title? For now, requires nextNodeId.
    }
  }, [currentNode]);

  // --- Engine Instantiation ---
  // Use useMemo to create the engine instance only once
  const storyEngine = useMemo(() => new StoryEngine(COMBINED_STORY_DATA), []); // Pass the imported story data

  const handleToggleMap = useCallback(() => {
    // Maybe add conditions later (e.g., can't open map during certain scenes)
    setIsMapOpen((prev) => !prev);
  }, []);
  // --- Effects ---

  // Effect to update component state when the story node changes in the store
  useEffect(() => {
    console.log("Story Node ID changed:", currentStoryNodeId);
    const node = storyEngine.getNode(currentStoryNodeId);
    setCurrentNode(node);

    if (node) {
      // Reset dialogue state for the new node
      setDialogueIndex(0);
      setShowChoices(false);

      // Update Speaker Name
      const speaker = node.characterId
        ? getCharacterById(node.characterId)
        : null;
      setSpeakerName(speaker ? speaker.name : null);

      // Update Character Sprite
      if (speaker && node.spriteExpression) {
        const spritePath =
          speaker.sprites[node.spriteExpression] ?? speaker.sprites.default;
        setCurrentCharacterSprite(spritePath);
      } else if (!node.characterId) {
        // Hide character sprite during narration or if no character is specified
        setCurrentCharacterSprite(null);
      }
      // If characterId exists but no spriteExpression, keep the previous sprite or use default? Decide policy.
      // else if (speaker) { setCurrentCharacterSprite(speaker.sprites.default); }

      // Update Background (Scene might be set by node effect, or check node directly)
      const scene = getSceneById(node.sceneId);
      setCurrentBackground(scene ? scene.backgroundPath : null);
      console.log(currentBackground);

      // Process node entry effects (scene changes, audio, state updates)
      // This should ideally happen *after* the UI state is ready to reflect the node
      requestAnimationFrame(() => {
        // Ensure state update has rendered before processing effects potentially causing further updates
        storyEngine.processNodeEntry(node);
      });
    } else {
      // Handle case where node is not found (e.g., end of story, error)
      setSpeakerName(null);
      setCurrentCharacterSprite(null);
      // Maybe show an "End" screen or error message
      console.warn("Current node is null or not found:", currentStoryNodeId);
    }
  }, [currentStoryNodeId, storyEngine]); // Rerun when node ID changes

  // --- Event Handlers ---

  const handleMiniGameComplete = useCallback(
    (result: any) => {
      console.log(
        "Minigame completed with result:",
        result,
        "Return context:",
        miniGameReturnContext
      );
      // --- Process result based on the specific minigame ---
      // Example: Update flags based on result for the specific activeMiniGameId
      // if (activeMiniGameId === 'tennis_rally' && result.score > 10) { ... }

      // --- Determine where to return ---
      let nextNodeId: string | null = null;

      if (miniGameReturnContext === "story" && currentNode?.nextNodeId) {
        // If triggered by story, go to the node's defined next step
        nextNodeId = currentNode.nextNodeId;
        console.log(`Returning to story node: ${nextNodeId}`);
      } else if (miniGameReturnContext === "map") {
        // If triggered by map, decide where to go.
        // Option A: Re-open the map?
        // setIsMapOpen(true); // This might feel abrupt.
        // Option B: Go to a generic post-minigame node?
        // nextNodeId = 'post_map_minigame_node'; // Define this node in story data
        // Option C: Just stay where you are (clear minigame state, no node change)? Might be weird.

        // Let's choose Option B for now (requires defining the node)
        nextNodeId = "post_map_activity_node"; // Define this node in main_story.ts
        console.log(`Returning from map minigame to node: ${nextNodeId}`);
      } else if (currentNode?.nextNodeId) {
        // Fallback: If context is missing, try story node's next id
        console.warn(
          "Minigame context missing, falling back to currentNode.nextNodeId"
        );
        nextNodeId = currentNode.nextNodeId;
      } else {
        // Fallback if no context and no next node
        console.warn(
          "No return context or next node after minigame from node:",
          currentNode?.id
        );
        nextNodeId = "start"; // Or some other safe fallback node
      }

      // --- Update State ---
      setActiveMiniGame(null, null); // Clear minigame ID and context!
      if (nextNodeId) {
        useGameStore.getState().setStoryNode(nextNodeId); // Use direct store access if needed within callback
      }
    },
    [currentNode, setActiveMiniGame, miniGameReturnContext]
  );

  const handleDialogueAdvance = useCallback(() => {
    if (!currentNode || showChoices || activeMiniGameId) return; // Don't advance if showing choices or in minigame

    const dialogueText = currentNode.text;
    const isMultiPart = Array.isArray(dialogueText);

    if (isMultiPart && dialogueIndex < dialogueText.length - 1) {
      // Advance to the next part of the dialogue
      setDialogueIndex((prev) => prev + 1);
    } else {
      // Dialogue finished
      if (currentNode.choices && currentNode.choices.length > 0) {
        // Show choices if available
        setShowChoices(true);
      } else if (currentNode.triggerMiniGameId) {
        // Minigame trigger is handled by the store state change via processNodeEntry
        console.log(
          "Minigame should be active now:",
          currentNode.triggerMiniGameId
        );
      } else if (currentNode.nextNodeId) {
        // Auto-advance if there's a next node ID
        storyEngine.processAutoAdvance(currentNode);
      } else {
        // End of branch or story?
        console.log(
          "End of dialogue and no next step defined for node:",
          currentNode.id
        );
      }
    }
  }, [currentNode, dialogueIndex, showChoices, storyEngine, activeMiniGameId]);

  const handleChoiceClick = useCallback(
    (choice: Choice) => {
      if (!currentNode) return;
      console.log("Choice selected:", choice.text);
      setShowChoices(false); // Hide choices after selection
      storyEngine.processChoice(choice); // Process effects and advance story node
    },
    [currentNode, storyEngine]
  );

  const isEventTitleNode =
    currentNode?.nodeType === "eventTitle" && !!currentNode.eventTitleText;
  const isDialogueNode =
    !currentNode?.nodeType || currentNode?.nodeType === "dialogue"; // Default or explicit dialogue

  // --- Rendering Logic ---

  const CurrentMiniGameComponent = activeMiniGameId
    ? MiniGameComponents[activeMiniGameId]
    : null;

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      id="game-container"
    >
      <button
        onClick={handleDebugReset}
        className="absolute top-2 right-2 z-50 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded shadow opacity-80 hover:opacity-100"
        title="重置遊戲狀態 (Debug)"
      >
        RESET GAME
      </button>
      {/* {isPhoneUnlocked && (
        <div onClick={openPhone}>
          <img
            src={
              "https://res.cloudinary.com/dcpzacz9d/image/upload/v1746368626/Untitled_design_6_krybcd.png"
            }
            className="z-50 absolute top-2 left-2 w-10"
          />
        </div>
      )} */}

      <div className="z-50 absolute top-2 left-2 w-10">

        {isPhoneUnlocked && (
                    <button
                        onClick={openPhone}
                        className="relative transition-transform duration-150 ease-in-out hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        title="開啟手機"
                        disabled={isPhoneOpen || isMapOpen || isSettingsOpen || !!activeMiniGameId}
                        aria-label={`手機（${unreadCount}則未讀訊息）`}
                    >
                        {/* 使用你的圖片 */}
                        <img
                            src={"https://res.cloudinary.com/dcpzacz9d/image/upload/v1746368626/Untitled_design_6_krybcd.png"}
                            alt="手機"
                            className="w-10 h-10 drop-shadow-md" // drop-shadow 增加立體感
                        />
                        {/* 保留未讀訊息的通知角標 */}
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-3 w-3 pointer-events-none">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                            </span>
                        )}
                    </button>
                )}</div>
      {/* <button
        onClick={handleToggleMap}
        className="absolute top-10 left-2 z-50 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded shadow opacity-80 hover:opacity-100"
        title="開啟地圖"
        disabled={isMapOpen || isSettingsOpen || !!activeMiniGameId} // Disable if map/settings/minigame active
      >
        MAP
      </button> */}
      {/* 1. Background Layer */}
      <AffectionIndicatorManager />
      <BackgroundDisplay imagePath={currentBackground} />
      {/* 2. Character Layer */}
      {/* Basic implementation showing one character, centered */}
      <AnimatePresence mode="wait">
        <CharacterSprite
          key={currentCharacterSprite}
          imagePath={currentCharacterSprite}
          altText={speakerName ?? "Character"}
          isVisible={!!currentCharacterSprite}
          position="center" // Adjust positioning logic as needed (e.g., based on speaker)
        />
      </AnimatePresence>
      {/* TODO: Add logic to display multiple characters if needed */}
      {/* 3. Mini-Game Layer (Renders on top of background/characters, hides dialogue) */}
      {CurrentMiniGameComponent && (
        <div className="absolute inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
          <CurrentMiniGameComponent onComplete={handleMiniGameComplete} />
        </div>
      )}
      {/* 4. UI Layer (Dialogue / Choices) - Hidden during minigame */}
      {!activeMiniGameId && currentNode && (
        <AnimatePresence mode="wait">
          {" "}
          {/* Allows exit anim before next enters */}
          {
            isEventTitleNode ? (
              <EventTitleDisplay
                key={`evt-${currentNode.id}`}
                titleText={currentNode.eventTitleText!} // Assert non-null as we checked isEventTitleNode
                onClick={handleEventTitleClick}
              />
            ) : isDialogueNode ? (
              // Use a key here if DialogueBox needs enter/exit animation itself
              <motion.div key={`dlg-${currentNode.id}`} className="contents">
                {" "}
                {/* Use "contents" to avoid extra div affecting layout */}
                <DialogueBox
                  // key={`dialogue-${currentNode.id}-${dialogueIndex}`} // Key might be needed if animating text change
                  speakerName={speakerName}
                  dialogue={
                    Array.isArray(currentNode.text)
                      ? currentNode.text[dialogueIndex] ?? ""
                      : currentNode.text ?? "" // Handle optional text
                  }
                  onDialogueAdvance={handleDialogueAdvance}
                  isVisible={!showChoices}
                />
                {/* Choice Buttons */}
                {showChoices && currentNode.choices && (
                  <motion.div
                    key={`choices-${currentNode.id}`}
                    className="absolute inset-x-0 bottom-10 z-30 flex flex-col items-center justify-center p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    {currentNode.choices
                      .filter(
                        (choice) =>
                          !choice.condition ||
                          storyEngine.checkCondition(choice.condition)
                      )
                      .map((choice, index) => (
                        <ChoiceButton
                          key={`${currentNode.id}-choice-${index}`}
                          text={choice.text}
                          onClick={() => handleChoiceClick(choice)}
                        />
                      ))}
                  </motion.div>
                )}
              </motion.div>
            ) : null /* End of node type check */
          }
        </AnimatePresence>
      )}
      <AnimatePresence>
        {isPhoneOpen && (
          <motion.div
            key="phone-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PhoneScreen /> {/* PhoneScreen handles its own close logic */}
          </motion.div>
        )}
      </AnimatePresence>
      {/* 5. Settings Screen Layer */}
      {isSettingsOpen && <SettingsScreen onClose={handleToggleSettings} />}
      {/* 6. Map View Layer */}
      {isMapOpen && (
        <MapView onClose={handleToggleMap} storyEngine={storyEngine} />
      )}{" "}
      {/* Pass engine */}
      {/* Add Loading indicator? */}
      {/* { !currentNode && !activeMiniGameId && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl">Loading...</p> } */}
    </div>
  );
};
