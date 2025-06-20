import React from 'react';

interface BadgeProps {
  variant: 'positive' | 'neutral' | 'negative' | 'acknowledged' | 'pending';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const variantClasses = {
    positive: 'bg-success-100 text-success-800 border-success-200',
    neutral: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    negative: 'bg-red-100 text-red-800 border-red-200',
    acknowledged: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};