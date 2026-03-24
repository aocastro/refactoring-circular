import React from 'react';

export const A11yIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    fill="none" 
    {...props}
  >
    {/* Outer circle */}
    <circle 
      cx="50" 
      cy="50" 
      r="40" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
    
    {/* Arms */}
    <path 
      d="M 11.3 40 Q 50 55 88.7 40" 
      stroke="currentColor" 
      strokeWidth="4" 
      fill="none" 
      strokeLinecap="round" 
    />
    
    {/* Legs */}
    <path 
      d="M 50 47.5 L 30.7 85" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    <path 
      d="M 50 47.5 L 69.3 85" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />

    {/* Head */}
    <circle 
      cx="50" 
      cy="24" 
      r="10" 
      fill="#4fc3f7" 
      stroke="currentColor" 
      strokeWidth="4" 
    />

    {/* Hands */}
    <circle 
      cx="11.3" 
      cy="40" 
      r="4.5" 
      fill="#4fc3f7" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
    <circle 
      cx="88.7" 
      cy="40" 
      r="4.5" 
      fill="#4fc3f7" 
      stroke="currentColor" 
      strokeWidth="4" 
    />

    {/* Feet */}
    <circle 
      cx="30.7" 
      cy="85" 
      r="4.5" 
      fill="#4fc3f7" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
    <circle 
      cx="69.3" 
      cy="85" 
      r="4.5" 
      fill="#4fc3f7" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
  </svg>
);
