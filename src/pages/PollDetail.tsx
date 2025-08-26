import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePolls } from '../hooks/usePolls';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getTotalVotes, sortOptionsByVotes } from '../utils/mockData';

const PollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { polls, voteOnOption } = usePolls();
  const [clickedOption, setClickedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const poll = polls.find(p => p.id === id);

  const handleVote = async (optionId: string) => {
    if (!poll || isVoting) return;
    
    setIsVoting(true);
    setClickedOption(optionId);
    
    // Add small delay for animation
    setTimeout(() => {
      voteOnOption(poll.id, optionId);
      setIsVoting(false);
      setClickedOption(null);
    }, 400);
  };

  if (!poll) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-light text-white mb-4">Poll not found</h2>
        <p className="text-gray-400">The poll you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  const sortedOptions = sortOptionsByVotes(poll.options);
  const totalVotes = getTotalVotes(sortedOptions);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto py-12 px-6 pb-24 max-w-4xl">
        {/* Poll Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wide leading-tight">
            {poll.question}
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-30 mb-8"></div>
        </motion.div>

        {/* Poll Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden"
        >
          {/* Creator info */}
          <div className="relative z-10 flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-semibold">
              {poll.createdBy ? poll.createdBy.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-4">
              <p className="font-medium text-white">{poll.createdBy || 'Anonymous'}</p>
              <p className="text-sm text-gray-400">{poll.createdOn || 'Today'}</p>
            </div>
          </div>
          
          {/* Results */}
          <div className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {sortedOptions.map((option, index) => {
                const percent = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
                const isClicked = clickedOption === option.id;
                const isTopOption = index === 0 && option.votes > 0;
                
                return (
                  <motion.div 
                    key={option.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className="relative"
                  >
                    <motion.button
                      onClick={() => handleVote(option.id)}
                      disabled={isVoting}
                      className={`w-full text-left transition-all duration-300 ${
                        isVoting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-[1.02]'
                      }`}
                      whileHover={{ scale: isVoting ? 1 : 1.02 }}
                      whileTap={{ scale: isVoting ? 1 : 0.98 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          {isTopOption && (
                            <motion.span
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="text-yellow-400 text-lg"
                            >
                              👑
                            </motion.span>
                          )}
                          <span className="font-medium text-white text-lg">{option.text}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <motion.span 
                            className={`text-2xl font-light ${
                              isTopOption ? 'text-yellow-300' : 'text-green-400'
                            }`}
                            animate={{ 
                              scale: isClicked ? 1.2 : 1,
                              color: isClicked ? '#fbbf24' : (isTopOption ? '#fcd34d' : '#4ade80')
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {percent}%
                          </motion.span>
                          <motion.span 
                            className={`text-sm px-3 py-1 rounded-lg border ${
                              isTopOption 
                                ? 'text-yellow-200 bg-yellow-500/20 border-yellow-400/30' 
                                : 'text-gray-400 bg-white/10 border-white/20'
                            }`}
                            animate={{ 
                              scale: isClicked ? 1.1 : 1,
                              rotateZ: isClicked ? 5 : 0
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {option.votes} votes
                          </motion.span>
                        </div>
                      </div>
                      
                      {/* Click ripple effect */}
                      {isClicked && (
                        <motion.div
                          className="absolute inset-0 bg-white/10 rounded-lg pointer-events-none"
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                      )}
                      
                      {/* Animated progress bar */}
                      <div className={`relative h-4 rounded-lg overflow-hidden backdrop-blur-sm border ${
                        isTopOption 
                          ? 'bg-yellow-500/10 border-yellow-400/20' 
                          : 'bg-white/10 border-white/10'
                      }`}>
                        <motion.div
                          className={`absolute top-0 left-0 h-full rounded-lg overflow-hidden ${
                            isTopOption 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                              : 'bg-gradient-to-r from-green-400 to-emerald-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${percent}%`,
                            opacity: isClicked ? 0.9 : 0.8
                          }}
                          transition={{ 
                            duration: 1.2, 
                            delay: index * 0.2 + 0.5, 
                            ease: "easeOut",
                            opacity: { duration: 0.3 }
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {/* Footer stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative z-10 mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-center"
          >
            <div>
              <motion.p 
                className="text-3xl font-light text-white mb-1"
                key={totalVotes} // Re-animate when total changes
                initial={{ scale: 1.2, color: '#10b981' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.5 }}
              >
                {totalVotes}
              </motion.p>
              <p className="text-sm text-gray-400">Total Votes</p>
            </div>
            <div>
              <p className="text-3xl font-light text-white mb-1">{sortedOptions.length}</p>
              <p className="text-sm text-gray-400">Options</p>
            </div>
            <div>
              <motion.div 
                className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/20 rounded-lg px-4 py-2"
                animate={{ opacity: isVoting ? 0.7 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-yellow-400 font-medium">
                  {isVoting ? '⏳ Voting...' : '🔧 Interactive Poll'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PollDetail;
