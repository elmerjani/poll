import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center py-4 px-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span className="text-2xl font-light bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Poll App
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
          <span className="text-white font-semibold text-sm">M</span>
        </div>
        <span className="text-sm font-medium text-white/90">mohamed el merjani</span>
      </div>
    </div>
  </header>
);
