import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGameStore, useCharacterStore } from "../../store";
import { StoryEngine } from "../../engines/StoryEngine";
import { MAIN_STORY } from "../../data/story/main_story"; // Import the actual story data
import { getCharacterById, CHARACTERS_DATA } from "../../data/characters"; // Import character data
import type { StoryNode, Choice } from "../../types";

// Import UI Components
import { BackgroundDisplay } from "../../components/BackgroundDisplay";
import { CharacterSprite } from "../../components/CharacterSprite";
import { DialogueBox } from "../../components/DialogueBox";
import { ChoiceButton } from "../../components/ChoiceButton";
import { getSceneById } from "../../data/scenes";

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
  const [currentCharacterSprite, setCurrentCharacterSprite] = useState<
    string | null
  >(null);
  const [currentBackground, setCurrentBackground] = useState<string | null>(
    null
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

  // --- Engine Instantiation ---
  // Use useMemo to create the engine instance only once
  const storyEngine = useMemo(() => new StoryEngine(MAIN_STORY), []); // Pass the imported story data

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
      setCurrentBackground(scene ? scene.backgroundPath : null); // Use scene data

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

  const handleMiniGameComplete = useCallback(
    (result: any) => {
      console.log("Minigame completed with result:", result);
      // Here you would typically:
      // 1. Process the result (e.g., update game flags or affection based on score)
      //    Example: if(result.score > 5) { useGameStore.getState().setGameFlag('minigame_A_passed', true); }
      // 2. Find the *next* story node after the minigame (this needs defining in your story data or engine logic)
      //    Example: const nextNodeId = currentNode?.nextNodeId ?? 'minigame_fallback_node';
      // 3. Clear the active minigame state and set the next story node
      setActiveMiniGame(null);
      // useGameStore.getState().setStoryNode(nextNodeId);

      // For now, just go to the next node defined in the node that triggered the minigame
      if (currentNode?.nextNodeId) {
        useGameStore.getState().setStoryNode(currentNode.nextNodeId);
      } else {
        console.warn(
          "No nextNodeId defined after minigame on node:",
          currentNode?.id
        );
        // Maybe go to a default 'minigame_complete' node?
      }
    },
    [currentNode, setActiveMiniGame]
  );

  // --- Rendering Logic ---

  const CurrentMiniGameComponent = activeMiniGameId
    ? MiniGameComponents[activeMiniGameId]
    : null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <button
        onClick={handleDebugReset}
        className="absolute top-2 right-2 z-50 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded shadow opacity-80 hover:opacity-100"
        title="重置遊戲狀態 (Debug)"
      >
        RESET GAME
      </button>
      {/* 1. Background Layer */}
      <BackgroundDisplay imagePath={currentBackground} />

      {/* 2. Character Layer */}
      {/* Basic implementation showing one character, centered */}
      <CharacterSprite
        imagePath={currentCharacterSprite}
        altText={speakerName ?? "Character"}
        isVisible={!!currentCharacterSprite}
        position="center" // Adjust positioning logic as needed (e.g., based on speaker)
      />
      {/* TODO: Add logic to display multiple characters if needed */}

      {/* 3. Mini-Game Layer (Renders on top of background/characters, hides dialogue) */}
      {CurrentMiniGameComponent && (
        <div className="absolute inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
          <CurrentMiniGameComponent onComplete={handleMiniGameComplete} />
        </div>
      )}

      {/* 4. UI Layer (Dialogue / Choices) - Hidden during minigame */}
      {!activeMiniGameId && currentNode && (
        <>
          {/* Dialogue Box */}
          <DialogueBox
            speakerName={speakerName}
            dialogue={
              Array.isArray(currentNode.text)
                ? currentNode.text[dialogueIndex] ?? ""
                : currentNode.text
            }
            onDialogueAdvance={handleDialogueAdvance}
            isVisible={!showChoices} // Hide dialogue box when choices are shown
          />

          {/* Choice Buttons Area (Shown instead of Dialogue Box) */}
          {showChoices && currentNode.choices && (
            <div className="absolute inset-x-0 bottom-10 z-30 flex flex-col items-center justify-center p-4">
              {currentNode.choices
                .filter(
                  (choice) =>
                    !choice.condition ||
                    storyEngine.checkCondition(choice.condition)
                ) // Filter based on condition
                .map((choice, index) => (
                  <ChoiceButton
                    key={`${currentNode.id}-choice-${index}`}
                    text={choice.text}
                    onClick={() => handleChoiceClick(choice)}
                  />
                ))}
            </div>
          )}
        </>
      )}

      {/* Add Loading indicator? */}
      {/* { !currentNode && !activeMiniGameId && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl">Loading...</p> } */}
    </div>
  );
};
