import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { getPoll, getPollAuth } from "../api/polls";
import { sortOptionsByVotes, getTotalVotes, timeAgo } from "../utils/constants";
import { usePollRealtime } from "../hooks/usePollRealTime";
import { useWebSocket } from "../contexts/WebSocketContext";
import type { PollExample } from "../types/poll";
import { useAuth } from "react-oidc-context";

const PollDetail = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const [poll, setPoll] = useState<PollExample | null>(null);
  const [clickedOption, setClickedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useWebSocket();

  // Fetch poll on mount
  useEffect(() => {
    if (!id) return;

    const fetchPoll = async () => {
      setLoading(true);
      try {
        let data;
        // const data = await getPoll(id);
        if (auth.isAuthenticated && auth.user && auth.user.id_token) {
          data = await getPollAuth({ pollId: id, idToken: auth.user.id_token });
        } else {
          data = await getPoll(id);
        }
        setPoll(data);
      } catch (err) {
        console.error("Failed to fetch poll:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  // Use real-time poll hook - pass poll options when available
  const realTimePoll = usePollRealtime({
    pollId: id || "",
    initialOptions: poll?.options || [],
  });

  // Use real-time options if available, otherwise fall back to poll options
  const currentOptions =
    realTimePoll.options.length > 0
      ? realTimePoll.options
      : poll?.options || [];
  const sortedOptions = sortOptionsByVotes(currentOptions);
  const totalVotes = getTotalVotes(sortedOptions);

  const handleVote = async (optionId: number) => {
    if (!poll || isVoting || !isConnected) return;

    setIsVoting(true);
    setClickedOption(optionId);

    // Send vote via WebSocket
    realTimePoll.handleVote(optionId);

    // Reset voting state after animation
    setTimeout(() => {
      setIsVoting(false);
      setClickedOption(null);
    }, 600);
  };
  console.log(poll);
  if (loading)
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="w-full py-12 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-light">Loading poll...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );

  if (!poll)
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="w-full py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-light text-white mb-4">
              Poll not found
            </h2>
            <p className="text-gray-400">
              The poll you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Back to Polls
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );

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
            <h1 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wide">
              Poll Details
            </h1>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-30 mb-8"></div>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              Real-time voting results
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <span>←</span>
              <span className="text-sm">Back to Polls</span>
            </Link>
          </motion.div>

          {/* Poll Container - Same style as PollItem */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group mb-8 max-w-2xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 relative overflow-hidden">
              {/* Connection status indicator */}
              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  animate={{
                    scale: isConnected ? [1, 1.2, 1] : 1,
                    opacity: isConnected ? 1 : 0.5,
                  }}
                  transition={{
                    scale: { duration: 2, repeat: Infinity },
                    opacity: { duration: 0.3 },
                  }}
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-400" : "bg-red-400"
                  }`}
                  title={isConnected ? "Real-time connected" : "Disconnected"}
                />
              </div>

              {/* Header with creator info */}
              <div className="relative z-10 flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                  {poll.owner?.name
                    ? poll.owner.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-white text-sm">
                    {poll.owner?.name || poll.owner?.email || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {timeAgo(poll.createdAt)}
                  </p>
                </div>
              </div>

              {/* Question */}
              <h2 className="relative z-10 text-xl font-light text-white mb-6 leading-relaxed">
                {poll.question}
              </h2>

              {/* Options with same styling as PollItem */}
              <div className="relative z-10 space-y-3">
                {/* Debug info - remove this after testing */}
                {process.env.NODE_ENV === "development" && (
                  <div className="text-xs text-gray-500 mb-2">
                    Debug: {currentOptions.length} options, Total votes:{" "}
                    {totalVotes}, Connected: {isConnected ? "Yes" : "No"}
                  </div>
                )}

                {currentOptions.length === 0 ? (
                  <div className="text-center text-gray-400 py-4">
                    {loading ? "Loading options..." : "No options available"}
                  </div>
                ) : (
                  <AnimatePresence>
                    {sortedOptions.map((option, index) => {
                      const percent = totalVotes
                        ? Math.round((option.votesCount / totalVotes) * 100)
                        : 0;
                      const isClicked = clickedOption === option.id;
                      const isTopOption = index === 0 && option.votesCount > 0;
                      const wasUpdated = realTimePoll.updatedOptions.has(
                        option.id
                      );
                      const isUserChoice = poll.userOption === option.id;

                      return (
                        <motion.button
                          key={option.id}
                          onClick={() =>
                            auth.isAuthenticated ? handleVote(option.id) : undefined
                          }
                          disabled={isVoting || !auth.isAuthenticated}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: clickedOption === option.id ? 1.02 : 1,
                            rotateY: clickedOption === option.id ? 5 : 0,
                          }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            scale: { duration: 0.2 },
                            rotateY: { duration: 0.3 },
                          }}
                          whileHover={{ scale: 1.02, borderColor: 'rgba(255, 255, 255, 0.3)' }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative w-full p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 overflow-hidden cursor-pointer ${
                            index === 0 && option.votesCount > 0
                              ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          } ${isVoting ? 'opacity-70 cursor-not-allowed' : ''} ${!auth.isAuthenticated ? 'pointer-events-none opacity-60' : ''}`}
                        >
                          {/* Progress bar background */}
                          <motion.div
                            className={`absolute inset-0 ${
                              isTopOption
                                ? "bg-gradient-to-r from-green-400/30 to-emerald-400/30"
                                : "bg-gradient-to-r from-green-400/20 to-emerald-400/20"
                            }`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${percent}%`,
                              opacity: isClicked ? 0.8 : wasUpdated ? 0.9 : 0.6,
                            }}
                            transition={{
                              duration: 1,
                              delay: index * 0.2,
                              opacity: { duration: 0.3 },
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

                          {/* Update pulse effect */}
                          {wasUpdated && (
                            <motion.div
                              className="absolute inset-0 bg-green-400/20 rounded-xl"
                              initial={{ scale: 1, opacity: 0 }}
                              animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0, 0.6, 0],
                              }}
                              transition={{
                                duration: 0.8,
                                times: [0, 0.5, 1],
                              }}
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
                                  👑
                                </motion.span>
                              )}
                              <span className="font-medium text-white">
                                {option.text}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <motion.span
                                className={`text-sm font-semibold ${
                                  isTopOption
                                    ? "text-green-300"
                                    : "text-green-300"
                                }`}
                                animate={{
                                  scale: isClicked || wasUpdated ? 1.2 : 1,
                                  color: wasUpdated ? "#22c55e" : undefined,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                {percent}%
                              </motion.span>
                              <motion.span
                                className={`text-xs px-2 py-1 rounded-lg ${
                                  isTopOption
                                    ? "text-green-200 bg-green-500/20 border border-green-400/30"
                                    : "text-gray-400 bg-white/10"
                                }`}
                                animate={{
                                  scale: isClicked || wasUpdated ? 1.1 : 1,
                                  rotateZ: isClicked ? 3 : 0,
                                  backgroundColor: wasUpdated
                                    ? "rgba(34, 197, 94, 0.2)"
                                    : undefined,
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
                )}
              </div>
              {/* Footer stats */}
              <motion.div
                className="relative z-10 mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400"
                animate={{ opacity: isVoting ? 0.7 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>{totalVotes} total votes</span>
                <span className="mx-2" />
                {auth.isAuthenticated ? (
                  <span
                    className={`text-xs px-3 py-1 rounded-lg ${
                      !isConnected
                        ? "bg-red-500/10 text-red-300"
                        : isVoting
                        ? "bg-yellow-500/10 text-yellow-300"
                        : "bg-green-500/10 text-green-300"
                    }`}
                  >
                    {!isConnected
                      ? "🔌 Reconnecting..."
                      : isVoting
                      ? "⏳ Voting..."
                      : "✨ Live voting"}
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-500/10 text-yellow-300 px-3 py-1 rounded-lg ml-4">Login to vote</span>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Poll Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
          >
            <h3 className="text-lg font-medium text-white mb-4">
              Poll Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Created by:</span>
                <span className="text-white ml-2">
                  {poll.owner?.name || poll.owner?.email || "Anonymous"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Poll ID:</span>
                <span className="text-white ml-2 font-mono text-xs">
                  {poll.pollId}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Total options:</span>
                <span className="text-white ml-2">{poll.options.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span
                  className={`ml-2 ${
                    isConnected ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {isConnected ? "🟢 Live" : "🔴 Offline"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PollDetail;
