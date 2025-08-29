import { PollItem } from "../components/PollItem";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CreatePollFAB } from "../components/CreatePollFAB";
import { useAuth } from "react-oidc-context";
import { usePolls } from "../hooks/usePolls";

const Home = () => {
  const auth = useAuth();
  const { polls, loading, error, hasMore, loadMore, refreshPolls } = usePolls(12);

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
              className="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg max-w-md mx-auto"
            >
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={refreshPolls}
                className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-lg text-red-200 text-xs transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!auth.isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg max-w-md mx-auto"
            >
              <p className="text-blue-300 text-sm">
                Login to create polls and vote. Only authenticated users can see live results.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Initial Loading Spinner */}
        {loading && polls.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-4 text-white text-lg font-light">Loading polls...</span>
          </div>
        )}

        {/* Polls */}
        {polls.length > 0 && (
          <InfiniteScroll
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
            className="poll-grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full px-4"
            loadingComponent={
              <div className="col-span-full flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-400">Loading more polls...</span>
              </div>
            }
          >
            {polls.map((poll, index) => (
              <motion.div
                key={poll.pollId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 12) * 0.05 }}
                className="h-full"
              >
                <PollItem
                  pollId={poll.pollId}
                  question={poll.question}
                  options={poll.options}
                  createdBy={poll.owner?.name}
                  createdAt={poll.createdAt}
                  userOption={poll.userOption}
                />
              </motion.div>
            ))}
          </InfiniteScroll>
        )}

        {/* Empty state */}
        {!loading && polls.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <h2 className="text-xl mb-2">No polls yet</h2>
            <p className="mb-6">Be the first to create a poll!</p>
            {auth.isAuthenticated && (
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                <span>+</span>
                <span>Create First Poll</span>
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer />
      {auth.isAuthenticated && <CreatePollFAB />}
    </div>
  );
};

export default Home;
