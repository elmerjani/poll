import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { useMyPolls } from "../hooks/useMyPolls";
import { CreatePollFAB } from "../components/CreatePollFAB";
import { PollItem } from "../components/PollItem";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { PollExample } from "../types/poll";

export default function MyPollsPage() {
  const { polls, setPolls, loading, error, hasMore, loadMore, deletePoll } = useMyPolls(10);
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<PollExample | null>(null);

  const handleDeleteClick = (poll: PollExample) => {
    setPollToDelete(poll);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pollToDelete) return;

    setDeletingPollId(pollToDelete.pollId);
    // Optimistically remove poll from state
    setPolls((prev) => prev.filter((p) => p.pollId !== pollToDelete.pollId));

    try {
      await deletePoll(pollToDelete.pollId);
    } catch (error) {
      console.error("Failed to delete poll:", error);
      // Revert if deletion failed
      setPolls((prev) => [...prev, pollToDelete]);
    } finally {
      setDeletingPollId(null);
      setShowDeleteModal(false);
      setPollToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPollToDelete(null);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black w-full py-12 px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
            My Polls
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-30 mb-8"></div>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Manage and view your created polls
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && polls.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-4 text-white text-lg font-light">Loading your polls...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg max-w-md mx-auto"
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Polls Grid */}
        {polls.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full px-4">
            <AnimatePresence>
              {polls.map((poll, index) => (
                <motion.div
                  key={poll.pollId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: (index % 12) * 0.05 }}
                  className="h-full relative"
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(poll);
                    }}
                    disabled={deletingPollId === poll.pollId}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors opacity-75 hover:opacity-100"
                    title="Delete poll"
                  >
                    {deletingPollId === poll.pollId ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>

                  <PollItem
                    pollId={poll.pollId}
                    question={poll.question}
                    options={poll.options}
                    createdBy={poll.owner.name}
                    createdAt={poll.createdAt}
                    userOption={poll.userOption}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && polls.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && polls.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading more polls...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && polls.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl mb-2">No polls created yet</h2>
            <p className="mb-6">Start by creating your first poll!</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleDeleteCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Poll</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  "{pollToDelete?.question}"
                </span>
                ? All votes and data will be permanently removed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingPollId === pollToDelete?.pollId}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center"
                >
                  {deletingPollId === pollToDelete?.pollId ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <CreatePollFAB />
    </>
  );
}