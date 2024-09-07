'use client';

import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 -translate-y-2 transform rounded-md bg-gray-700 px-2 py-1 text-sm text-white">
          {text}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
