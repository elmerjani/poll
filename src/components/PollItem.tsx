import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sortOptionsByVotes } from '../utils/constants';

interface PollItemProps {
  id?: string;
  question: string;
  options: {id: number; text: string; votesCount: number}[];
  onVote?: (optionId: number) => void;
  createdBy?: string;
  createdAt?: string;
}

export const PollItem: React.FC<PollItemProps> = ({ 
  id,
  question, 
  options, 
  onVote, 
  createdBy, 
  createdAt 
}) => {
  const [clickedOption, setClickedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  // Sort options by votes (highest first)
  const sortedOptions = sortOptionsByVotes(options);
  const totalVotes = sortedOptions.reduce((sum, opt) => sum + opt.votesCount, 0);

  const handleVote = async (optionId: number) => {
    if (isVoting) return; // Prevent double clicks
    
    setIsVoting(true);
    setClickedOption(optionId);
    
    // Add small delay for animation
    setTimeout(() => {
      onVote?.(optionId);
      setIsVoting(false);
      setClickedOption(null);
    }, 400);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group mb-8 max-w-lg mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 relative overflow-hidden">
        {/* Header with creator info */}
        <div className="relative z-10 flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
            {createdBy ? createdBy.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="ml-3">
            <p className="font-medium text-white text-sm">{createdBy || 'Anonymous'}</p>
            <p className="text-xs text-gray-400">{createdAt || 'Today'}</p>
          </div>
        </div>

        {/* Question with link to detail */}
        {id ? (
          <Link to={`/poll/${id}`}>
            <h2 className="relative z-10 text-xl font-light text-white mb-6 leading-relaxed hover:text-blue-300 transition-colors duration-300 cursor-pointer">
              {question}
            </h2>
          </Link>
        ) : (
          <h2 className="relative z-10 text-xl font-light text-white mb-6 leading-relaxed">
            {question}
          </h2>
        )}
        
        {/* Options */}
        <div className="relative z-10 space-y-3">
          <AnimatePresence>
            {sortedOptions.map((option, index) => {
              const percent = totalVotes ? Math.round((option.votesCount / totalVotes) * 100) : 0;
              const isClicked = clickedOption === option.id;
              const isTopOption = index === 0 && option.votesCount > 0;
              
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={isVoting}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: isClicked ? 1.02 : 1,
                    rotateY: isClicked ? 5 : 0
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    scale: { duration: 0.2 },
                    rotateY: { duration: 0.3 }
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: 'rgba(255, 255, 255, 0.3)' 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isTopOption 
                      ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  } ${isVoting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {/* Progress bar background */}
                  <motion.div
                    className={`absolute inset-0 ${
                      isTopOption 
                        ? 'bg-gradient-to-r from-green-400/30 to-emerald-400/30' 
                        : 'bg-gradient-to-r from-green-400/20 to-emerald-400/20'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${percent}%`,
                      opacity: isClicked ? 0.8 : 0.6
                    }}
                    transition={{ 
                      duration: 1, 
                      delay: index * 0.2,
                      opacity: { duration: 0.3 }
                    }}
                  />
                  
                  {/* Click ripple effect */}
                  {isClicked && (
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-xl"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isTopOption && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-yellow-400 text-sm"
                        >
                          
                        </motion.span>
                      )}
                      <span className="font-medium text-white">{option.text}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.span 
                        className={`text-sm font-semibold ${
                          isTopOption ? 'text-green-300' : 'text-green-300'
                        }`}
                        animate={{ scale: isClicked ? 1.2 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {percent}%
                      </motion.span>
                      <motion.span 
                        className={`text-xs px-2 py-1 rounded-lg ${
                          isTopOption 
                            ? 'text-green-200 bg-green-500/20 border border-green-400/30' 
                            : 'text-gray-400 bg-white/10'
                        }`}
                        animate={{ 
                          scale: isClicked ? 1.1 : 1,
                          rotateZ: isClicked ? 3 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {option.votesCount}
                      </motion.span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Footer stats */}
        <motion.div 
          className="relative z-10 mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400"
          animate={{ opacity: isVoting ? 0.7 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span>{totalVotes} total votes</span>
          <span className="mx-2" />
          <span className="text-xs bg-green-500/10 text-green-300 px-3 py-1 rounded-lg">{isVoting ? '⏳ Voting...' : 'Tap to vote'}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
