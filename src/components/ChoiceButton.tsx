import React from 'react';

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        block w-full max-w-md mx-auto my-2 px-6 py-3
        bg-blue-600 hover:bg-blue-700 active:bg-blue-800
        text-white text-lg rounded shadow-md
        transition-all duration-150 ease-in-out
        disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none
      `}
    >
      {text}
    </button>
  );
};