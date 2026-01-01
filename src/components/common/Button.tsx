import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick,
  className = '' 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}



