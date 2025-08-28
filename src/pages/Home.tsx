import { usePolls } from "../hooks/usePolls";
import { PollItem } from "../components/PollItem";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CreatePollFAB } from "../components/CreatePollFAB";
import { useAuth } from "react-oidc-context";

const Home = () => {
  const { polls, loading, error, voteOnOption } = usePolls();
  const auth = useAuth();
  const handleVote = (pollId: string, optionId: number) => {
    voteOnOption(pollId, optionId);
  };

  return (
    <div className="min-h-screen bg-black w-full">
      <Header />
      <main className="w-full py-12 px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
            Active Polls
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-30 mb-8"></div>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Vote on the latest polls and see real-time results
          </p>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg max-w-md mx-auto"
            >
              <p className="text-yellow-300 text-sm">⚠️ {error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-light">Loading polls...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && polls.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg ">
                <img
                  src="/logo.png"
                  alt="App Logo"
                  className="w-10 h-10 rounded-lg"
                />
              </div>
            </div>
            <h2 className="text-xl text-gray-400 mb-2">No polls yet</h2>
            <p className="text-gray-500 mb-6">Be the first to create a poll!</p>
            {auth.isAuthenticated && (
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                <span>+</span>
                <span>Create First Poll</span>
              </Link>
            )}
          </motion.div>
        )}

        {/* Polls */}
        {!loading && polls.length > 0 && (
          <div className="poll-grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full px-4">
            {polls.map((poll, index) => (
              <motion.div
                key={poll.pollId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <PollItem
                  pollId={poll.pollId}
                  question={poll.question}
                  options={poll.options}
                  createdBy={poll.owner.name}
                  createdAt={poll.createdAt}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      {/* Floating Action Button */}
      {auth.isAuthenticated && <CreatePollFAB />}
    </div>
  );
};

export default Home;
