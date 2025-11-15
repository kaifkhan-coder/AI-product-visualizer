
import React from 'react';
import { MarketingMedium } from '../types';

interface MediumSelectorProps {
  onSelectMedium: (medium: MarketingMedium) => void;
  isLoading: boolean;
}

const MediumSelector: React.FC<MediumSelectorProps> = ({ onSelectMedium, isLoading }) => {
  const mediums = Object.values(MarketingMedium);

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-semibold text-gray-200">2. Choose a Medium</h2>
      <div className="grid grid-cols-1 gap-4">
        {mediums.map((medium) => (
          <button
            key={medium}
            onClick={() => onSelectMedium(medium)}
            disabled={isLoading}
            className="w-full px-4 py-3 text-left bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className="font-medium text-white">{medium}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediumSelector;
