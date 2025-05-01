import React from 'react';

interface DialogueBoxProps {
  speakerName: string | null; // Name of the character speaking
  dialogue: string;         // The line of dialogue to display
  onDialogueAdvance: () => void; // Callback when player clicks to advance
  isVisible?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speakerName,
  dialogue,
  onDialogueAdvance,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-1/4 md:h-1/3 bg-black bg-opacity-70 text-white p-4 md:p-6 z-20 cursor-pointer border-t-2 border-gray-600" // z-20 for UI above characters
      onClick={onDialogueAdvance} // Click anywhere on the box to advance
    >
      {/* Speaker Name Area */}
      {speakerName && (
        <div className="absolute -top-8 left-6 bg-gray-800 px-4 py-1 rounded-t-md border border-b-0 border-gray-600">
          <p className="text-lg font-semibold">{speakerName}</p>
        </div>
      )}

      {/* Dialogue Text */}
      <p className="text-xl md:text-2xl whitespace-pre-wrap">
        {dialogue}
        {/* You might add a blinking indicator here later */}
      </p>
    </div>
  );
};