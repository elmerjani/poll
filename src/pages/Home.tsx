import { usePolls } from '../hooks/usePolls';
import { PollItem } from '../components/PollItem';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { motion } from 'framer-motion';

const Home = () => {
  const { polls, loading, error, voteOnOption } = usePolls();

  const handleVote = (pollId: string, optionId: string) => {
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

        {/* Polls */}
        {!loading && (
          <div className="poll-grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full px-4">
            {polls.map((poll, index) => (
              <motion.div
                key={poll.id || poll.pollId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <PollItem
                  id={poll.id || poll.pollId}
                  question={poll.question}
                  options={poll.options}
                  createdBy={poll.createdBy}
                  createdOn={poll.createdOn}
                  onVote={(optionId) => handleVote(poll.id || poll.pollId, optionId)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
