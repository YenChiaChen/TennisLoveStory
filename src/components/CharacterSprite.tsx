import React from 'react';

interface CharacterSpriteProps {
  imagePath: string | null;
  altText?: string;
  position?: 'left' | 'center' | 'right'; // Example positioning
  isVisible?: boolean;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  imagePath,
  altText = "Character",
  position = 'center',
  isVisible = true,
}) => {
  if (!imagePath || !isVisible) {
    return null; // Don't render if no image or not visible
  }

  // Basic positioning with Tailwind - adjust as needed!
  let positionClasses = 'bottom-0'; // Default bottom aligned
  if (position === 'left') {
    positionClasses += ' left-10 md:left-20'; // Example responsive positioning
  } else if (position === 'right') {
    positionClasses += ' right-10 md:right-20';
  } else { // Center
    positionClasses += ' left-1/2 -translate-x-1/2';
  }

  return (
    <img
      src={imagePath}
      alt={altText}
      className={`absolute h-4/5 max-h-[80vh] object-contain z-10 transition-opacity duration-300 ease-in-out ${positionClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`} // z-10 for characters above background
      style={{ imageRendering: 'pixelated' }} // Optional: For pixel art style
    />
  );
};