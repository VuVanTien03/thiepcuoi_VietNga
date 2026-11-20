import React from 'react';

interface BotanicalProps {
  className?: string;
}

/**
 * Nhánh lá bạch đàn / olive tối giản phong cách vẽ tay.
 */
export const BotanicalSprig: React.FC<BotanicalProps> = ({ className }) => (
  <svg
    className={className}
    width="44"
    height="22"
    viewBox="0 0 44 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 16C12 13 24 10 41 6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M12 13C10 9 12 5 16 4C16 8 15 11 12 13Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M21 11C21 15 24 18 28 17C27 13 24 11 21 11Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M28 9C27 5 30 2 34 2C34 6 32 8 28 9Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

export const BotanicalCorner: React.FC<BotanicalProps> = ({ className }) => (
  <svg
    className={className}
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 108C20 74 44 40 96 14"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M24 80C12 72 12 58 22 50C28 60 28 70 24 80Z"
      fill="currentColor"
      fillOpacity="0.16"
      stroke="currentColor"
      strokeWidth="1.1"
    />
    <path
      d="M38 62C50 66 58 76 54 88C42 84 36 74 38 62Z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.1"
    />
    <path
      d="M54 44C44 34 46 22 56 16C62 26 60 36 54 44Z"
      fill="currentColor"
      fillOpacity="0.16"
      stroke="currentColor"
      strokeWidth="1.1"
    />
    <path
      d="M72 30C84 34 90 44 86 54C75 50 70 40 72 30Z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.1"
    />
  </svg>
);
