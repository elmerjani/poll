import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
      voteOnOption(poll.id!, optionId);
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
    <div className="min-h-screen bg-black w-full">
      <Header />
      <main className="w-full py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
        {/* Poll Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide leading-tight">
            Poll Details
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-30"></div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span>←</span>
            <span className="text-sm">Back to Polls</span>
          </Link>
        </motion.div>

        {/* Poll Container - styled like PollItem */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 relative overflow-hidden max-w-2xl mx-auto"
        >
          {/* Creator info - same as PollItem */}
          <div className="relative z-10 flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
              {poll.createdBy ? poll.createdBy.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-3">
              <p className="font-medium text-white text-sm">{poll.createdBy || 'Anonymous'}</p>
              <p className="text-xs text-gray-400">{poll.createdOn || 'Today'}</p>
            </div>
          </div>

          {/* Question - same style as PollItem */}
          <h2 className="relative z-10 text-xl font-light text-white mb-6 leading-relaxed">
            {poll.question}
          </h2>
          
          {/* Options - same style as PollItem */}
          <div className="relative z-10 space-y-3">
            <AnimatePresence>
              {sortedOptions.map((option, index) => {
                const percent = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
                const isClicked = clickedOption === option.id;
                const isTopOption = index === 0 && option.votes > 0;
                
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
                          {option.votes}
                        </motion.span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
          
          {/* Footer stats - same style as PollItem */}
          <motion.div 
            className="relative z-10 mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400"
            animate={{ opacity: isVoting ? 0.7 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              key={totalVotes} // Re-animate when total changes
              initial={{ scale: 1.2, color: '#10b981' }}
              animate={{ scale: 1, color: '#9ca3af' }}
              transition={{ duration: 0.5 }}
            >
              {totalVotes} total votes
            </motion.span>
            <span className="text-xs bg-green-500/10 text-green-300 px-3 py-1 rounded-lg border border-green-400/20">
              {isVoting ? '⏳ Voting...' : '� Tap to vote'}
            </span>
          </motion.div>
        </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PollDetail;
