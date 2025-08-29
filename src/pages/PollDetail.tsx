import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { motion } from "framer-motion";
import { getPoll, getPollAuth } from "../api/polls";
import { PollItem } from "../components/PollItem";
import { useAuth } from "react-oidc-context";
import type {  PollWithVotes } from "../types/poll";

const PollDetail = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const [poll, setPoll] = useState<PollWithVotes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPoll = async () => {
      setLoading(true);
      try {
        let data;
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

          {/* Use PollItem */}
          <PollItem
            pollId={poll.pollId}
            question={poll.question}
            options={poll.options}
            createdBy={poll.owner?.name || poll.owner?.email}
            createdAt={poll.createdAt}
            userOption={poll.userOption}
          />

          {/* Additional Poll Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 p-6 bg-white/5 bg-glass border border-white/10 rounded-2xl"
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
                <span className="text-gray-400">Total votes:</span>
                <span className="text-white ml-2">
                  {poll.votes?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Total options:</span>
                <span className="text-white ml-2">{poll.options.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Voter Details Section */}
          {poll.votes && poll.votes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 p-6 bg-white/5 bg-glass border border-white/10 rounded-2xl"
            >
              <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Voter Breakdown
              </h3>

              <div className="space-y-6">
                {poll.options.map((option) => {
                  const optionVoters = poll.votes.filter(
                    (vote) => vote.optionId === option.id
                  );

                  if (optionVoters.length === 0) return null;

                  return (
                    <div
                      key={option.id}
                      className="border-l-2 border-blue-400/30 pl-4"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                        <h4 className="text-white font-medium">
                          {option.text}
                        </h4>
                        <span className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                          {optionVoters.length} vote
                          {optionVoters.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="grid gap-2">
                        {optionVoters.map((vote, index) => (
                          <div
                            key={`${vote.optionId}-${index}`}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {vote.user.name
                                  ? vote.user.name.charAt(0).toUpperCase()
                                  : vote.user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {vote.user.name || vote.user.email}
                                </p>
                                {vote.user.name && (
                                  <p className="text-gray-400 text-xs">
                                    {vote.user.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-xs">
                                {new Date(vote.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {new Date(vote.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PollDetail;
