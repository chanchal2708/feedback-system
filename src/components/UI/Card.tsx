import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
};