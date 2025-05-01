import React from 'react';

interface BackgroundDisplayProps {
  imagePath: string | null;
  altText?: string;
}

export const BackgroundDisplay: React.FC<BackgroundDisplayProps> = ({ imagePath, altText = "Background" }) => {
  if (!imagePath) {
    // Render a solid color or nothing if path is empty (e.g., black screen)
    return <div className="absolute inset-0 w-full h-full bg-black z-0"></div>;
  }

  return (
    <img
      src={imagePath}
      alt={altText}
      className="absolute inset-0 w-full h-full object-cover z-0" // z-0 for background layer
    />
  );
};