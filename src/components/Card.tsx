import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`card bg-base-100 shadow-md p-4 ${className}`}>
    {children}
  </div>
);
