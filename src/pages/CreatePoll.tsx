import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { usePolls } from "../hooks/usePolls";
import { useAuth } from "react-oidc-context";

const CreatePoll = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { createPoll } = usePolls();
  const addOption = () => {
    if (options.length < 6) {
      // Limit to 6 options
      const newId = options.length + 1;
      setOptions([...options, { id: newId, text: "" }]);
    }
  };

  const removeOption = (id: number) => {
    if (options.length > 2) {
      // Minimum 2 options
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const updateOption = (id: number, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate question
    if (!question.trim()) {
      newErrors.question = "Question is required";
    }

    // Validate options
    const validOptions = options.filter((opt) => opt.text.trim());
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    // Check for duplicate options
    const optionTexts = validOptions.map((opt) =>
      opt.text.trim().toLowerCase()
    );
    const hasDuplicates = optionTexts.length !== new Set(optionTexts).size;
    if (hasDuplicates) {
      newErrors.options = "Options must be unique";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    const optionTexts = options.map((opt) => opt.text);
    const pollData = {
      question,
      options: optionTexts,
      idToken: auth.user?.id_token,
    };
    try {
      await createPoll(pollData);
      setSuccessMsg("Poll created successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const errorMessage = (err as Error)?.message || "Failed to create poll.";
      setErrorMsg(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black w-full">
      <Header />
      <main className="w-full py-12 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide leading-tight">
              Create New Poll
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

          {/* Form Container */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 relative overflow-hidden"
          >
            {/* Question Input */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="block text-white text-sm font-medium mb-2">
                Poll Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                rows={3}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400/50 focus:outline-none transition-colors duration-300 resize-none"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.question ? (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs"
                  >
                    {errors.question}
                  </motion.p>
                ) : (
                  <span></span>
                )}
                <span className="text-gray-500 text-xs">
                  {question.length}/200
                </span>
              </div>
            </motion.div>

            {/* Options */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white text-sm font-medium">
                  Poll Options
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  disabled={options.length >= 6}
                  className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Option
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {options.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            updateOption(option.id, e.target.value)
                          }
                          placeholder={`Option ${index + 1}...`}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-green-400/50 focus:outline-none transition-colors duration-300"
                          maxLength={100}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                          {option.text.length}/100
                        </span>
                      </div>
                      {options.length > 2 && (
                        <motion.button
                          type="button"
                          onClick={() => removeOption(option.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                        >
                          ×
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {errors.options && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2"
                >
                  {errors.options}
                </motion.p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Creating Poll...</span>
                </div>
              ) : (
                "Create Poll"
              )}
            </motion.button>

            {/* Success/Error Message */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-4 p-3 bg-green-500/10 border border-green-400/30 rounded-lg text-green-300 text-sm"
              >
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg text-red-300 text-sm"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Helper Text */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-gray-400 text-xs">
                Your poll will be public and anyone can vote on it
              </p>
            </motion.div>
          </motion.form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePoll;
