import { usePolls } from '../hooks/usePolls';
import { PollItem } from '../components/PollItem';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { motion } from 'framer-motion';

const Home = () => {
  const { polls, voteOnOption } = usePolls();

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
        </motion.div>

        {/* Polls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 w-full px-4">
          {polls.map((poll, index) => (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PollItem
                id={poll.id}
                question={poll.question}
                options={poll.options}
                createdBy={poll.createdBy}
                createdOn={poll.createdOn}
                onVote={(optionId) => handleVote(poll.id, optionId)}
              />
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
