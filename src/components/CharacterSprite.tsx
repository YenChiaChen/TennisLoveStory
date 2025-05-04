import React from "react";
import { motion } from "framer-motion";

interface CharacterSpriteProps {
  imagePath: string | null;
  altText?: string;
  position?: "left" | "center" | "right"; // Example positioning
  isVisible?: boolean;
}

const spriteVariants = {
  // Initial state (before entering)
  hidden: {
    opacity: 0,
    scale: 0.6, // Start smaller
    // x: '-100%', // Alternative: slide in from left
    // filter: 'blur(8px)', // Optional: start blurred
  },
  // Visible state (animated to)
  visible: {
    opacity: 1,
    scale: 1,
    // x: '0%', // End at original position if sliding
    // filter: 'blur(0px)',
    transition: {
      type: "spring", // Use a spring animation for a bouncier feel
      stiffness: 150,
      damping: 15,
      // Or a simple tween: type: 'tween', duration: 0.4, ease: 'easeOut'
    },
  },
  // Exit state (when leaving)
  exit: {
    opacity: 0,
    scale: 0.6, // Shrink out
    // x: '100%', // Alternative: slide out to right
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  imagePath,
  altText = "Character",
  position = "center",
  isVisible = true,
}) => {
  if (!imagePath || !isVisible) {
    return null; // Don't render if no image or not visible
  }

  // Basic positioning with Tailwind - adjust as needed!
  let positionClasses = "bottom-0"; // Default bottom aligned
  if (position === "left") {
    positionClasses += " left-10 md:left-20"; // Example responsive positioning
  } else if (position === "right") {
    positionClasses += " right-10 md:right-20";
  } else {
    // Center
    positionClasses += " left-0 -translate-x-1/2";
  }

  return (
    <motion.img
      // IMPORTANT: key prop is handled in MainGame.tsx to trigger animation on change
      src={imagePath ?? ""} // Provide empty string if null to avoid React errors, though AnimatePresence handles null case better
      alt={altText}
      className={`absolute h-4/5 max-h-[80vh] object-contain z-10 ${positionClasses}`}
      style={{ imageRendering: "pixelated" }}
      variants={spriteVariants}
      initial="hidden" // Start hidden
      animate="visible" // Animate to visible state when mounted/key changes
      exit="exit" // Use exit animation when unmounting/key changes within AnimatePresence
    />
  );
};
