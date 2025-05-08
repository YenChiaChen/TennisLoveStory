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
        block w-full max-w-md mx-auto my-2 px-6 py-3 kaisei-tokumin-regular opacity-90
        bg-pink-400
        border-[2px]
        border-white
        text-white text-lg rounded shadow-md
        transition-all duration-150 ease-in-out
       relative
      `}
    >
      {text}
      <img src={'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746352648/Untitled_design_3_hj5r6r.png'} className='absolute w-[30px] -right-3 -top-3' />
    </button>
  );
};