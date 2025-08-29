// src/components/PollItem.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { sortOptionsByVotes, timeAgo } from "../utils/constants";
import { usePollRealtime } from "../hooks/usePollRealTime";
import type { OptionExample } from "../types/poll";
import { useAuth } from "react-oidc-context";

interface PollItemProps {
  pollId: string;
  question: string;
  options: OptionExample[];
  createdBy?: string;
  createdAt?: string;
  userOption?: number;
}

export const PollItem: React.FC<PollItemProps> = ({
  pollId,
  question,
  options: initialOptions,
  createdBy,
  createdAt,
  userOption: initialUserOption,
}) => {
  const [clickedOption, setClickedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const auth = useAuth();

  const { options, updatedOptions, handleVote, isConnected, userOption } =
    usePollRealtime({
      pollId,
      initialOptions,
      initialUserOption,
    });

  const sortedOptions = sortOptionsByVotes(options);
  const totalVotes = sortedOptions.reduce(
    (sum, opt) => sum + opt.votesCount,
    0
  );

  const onVoteClick = async (optionId: number) => {
    if (isVoting || !isConnected) return;

    setIsVoting(true);
    setClickedOption(optionId);
    handleVote(optionId);
    setTimeout(() => {
      setIsVoting(false);
      setClickedOption(null);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group mb-8 max-w-lg mx-auto"
    >
      <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 relative overflow-hidden">
       

        {/* Header with creator info */}
        <div className="relative z-10 flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
            {createdBy ? createdBy.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="ml-3">
            <p className="font-medium text-white text-sm">
              {createdBy || "Anonymous"}
            </p>
            <p className="text-xs text-gray-400">{timeAgo(createdAt)}</p>
          </div>
        </div>

        {/* Question */}
        {pollId ? (
          <Link to={`/poll/${pollId}`}>
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
              const percent = totalVotes
                ? Math.round((option.votesCount / totalVotes) * 100)
                : 0;

              const isRecentVoted =
                clickedOption === option.id || userOption === option.id;
              const isTopOption = index === 0 && option.votesCount > 0;
              const wasUpdated = updatedOptions.has(option.id);

              return (
                <motion.button
                  key={option.id}
                  onClick={() => onVoteClick(option.id)}
                  disabled={isVoting || !isConnected}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: clickedOption === option.id ? 1.02 : 1,
                    rotateY: clickedOption === option.id ? 5 : 0,
                    boxShadow: wasUpdated
                      ? "0 0 30px rgba(34, 197, 94, 0.3)"
                      : "0 0 0px rgba(34, 197, 94, 0)",
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    scale: { duration: 0.3 },
                    rotateY: { duration: 0.3 },
                    boxShadow: { duration: 0.5 },
                  }}
                  whileHover={{
                    scale: isConnected ? 1.02 : 1,
                    borderColor: isConnected
                      ? "rgba(255, 255, 255, 0.3)"
                      : undefined,
                  }}
                  whileTap={{ scale: isConnected ? 0.98 : 1 }}
                  className={`relative w-full p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 overflow-hidden ${
                    isRecentVoted
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/40"
                      : isTopOption
                      ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  } ${isVoting || !isConnected ? "opacity-70 cursor-not-allowed" : "cursor-pointer"} ${
                    wasUpdated ? "ring-2 ring-green-400/50" : ""
                  }`}
                >
                  {/* Progress bar */}
                  <motion.div
                    className={`absolute inset-0 ${
                      isRecentVoted
                        ? "bg-gradient-to-r from-blue-400/30 to-purple-400/30"
                        : isTopOption
                        ? "bg-gradient-to-r from-green-400/30 to-emerald-400/30"
                        : "bg-gradient-to-r from-green-400/20 to-emerald-400/20"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%`, opacity: 0.6 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />

                  {/* Click ripple */}
                  {clickedOption === option.id && (
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-xl"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-medium text-white">{option.text}</span>
                    <span className="text-xs px-2 py-1 rounded-lg text-gray-400 bg-white/10">
                      {option.votesCount} ({percent}%)
                    </span>
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
          <span
            className={`text-xs px-3 py-1 rounded-lg ${
              !auth.isAuthenticated
                ? "bg-yellow-500/10 text-yellow-300"
                : !isConnected
                ? "bg-red-500/10 text-red-300"
                : isVoting
                ? "bg-yellow-500/10 text-yellow-300"
                : "bg-green-500/10 text-green-300"
            }`}
          >
            {!auth.isAuthenticated
              ? "Login to vote"
              : !isConnected
              ? "🔌 Reconnecting..."
              : isVoting
              ? "⏳ Voting..."
              : "✨ Live voting"}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
