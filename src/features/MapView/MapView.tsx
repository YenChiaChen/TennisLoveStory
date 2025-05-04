// src/features/MapView/MapView.tsx
import React from 'react';
import { SCENES_DATA, getSceneById } from '../../data/scenes';
import { useGameStore, useCharacterStore } from '../../store';
import { StoryEngine } from '../../engines/StoryEngine'; // Needed for condition checking

interface MapViewProps {
  onClose: () => void; // Function to close the map view
  storyEngine: StoryEngine; // Pass the engine instance for condition checks
}

export const MapView: React.FC<MapViewProps> = ({ onClose, storyEngine }) => {
  const setActiveMiniGame = useGameStore((state) => state.setActiveMiniGame);

  const characterState = useCharacterStore.getState(); // Get character state for conditions

  const handleLocationClick = (sceneId: string) => {
    const scene = getSceneById(sceneId);
    if (!scene) return;

    console.log(`Map location clicked: ${scene.name}`);

    // Check if it triggers a minigame and meets condition
    if (scene.miniGameId && (!scene.miniGameCondition || storyEngine.checkCondition(scene.miniGameCondition))) {
      console.log(`Triggering minigame ${scene.miniGameId} from map.`);
      // Set the active minigame AND the context
      setActiveMiniGame(scene.miniGameId, 'map');
      onClose(); // Close the map view after starting minigame
    } else if (scene.miniGameId) {
        console.log(`Minigame condition not met for ${scene.miniGameId}`);
        // Optionally show a message to the player: "還不能進行這個活動"
        alert("現在還無法進行這個活動。"); // Basic alert, improve UI later
    }
    else {
      console.log(`Location ${scene.name} does not trigger a minigame.`);
      // Handle non-minigame locations later (e.g., trigger story node, simple visit)
       alert("這裡現在沒什麼特別的事。"); // Basic alert
       // onClose(); // Maybe close map even if nothing happens?
    }
  };

  // Filter locations accessible via map
  const mapLocations = Object.values(SCENES_DATA).filter(
    (scene) => scene.accessibleViaMap
  );

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-green-300 z-40 flex flex-col items-center justify-center p-4 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-800 hover:text-red-600 text-3xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          aria-label="Close Map"
        >
          &times;
        </button>

      <h2 className="text-3xl font-bold mb-8 text-gray-800 shadow-sm">選擇地點</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {mapLocations.map((location) => (
          <button
            key={location.id}
            onClick={() => handleLocationClick(location.id)}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:bg-yellow-100 transition-all duration-200 ease-in-out text-center"
          >
            <h3 className="text-xl font-semibold text-blue-700">{location.mapLabel || location.name}</h3>
            {/* Optionally add icons or brief descriptions */}
            {location.miniGameId && <p className="text-sm text-gray-500 mt-1">(可能觸發活動)</p>}
          </button>
        ))}
      </div>
    </div>
  );
};