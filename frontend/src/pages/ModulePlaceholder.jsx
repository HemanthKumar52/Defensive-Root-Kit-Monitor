
import React from 'react';
import { Construction } from 'lucide-react';

export function ModulePlaceholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="p-4 bg-white/5 rounded-full border border-white/10">
        <Construction size={48} className="text-gray-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 mt-2 max-w-md">
          This advanced detection module is currently initializing. 
          Please check back in the next update cycle.
        </p>
      </div>
    </div>
  );
}
