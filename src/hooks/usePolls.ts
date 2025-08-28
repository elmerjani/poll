import { useState, useEffect } from "react";
import { getAllPolls, createPollApi } from "../api/polls";

export function usePolls() {
  const [polls, setPolls] = useState<
    {
      pollId: string;
      question: string;
      createdAt: string;
      owner: { name: string; email: string };
      options: { id: number; text: string; votesCount: number }[];
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPolls();
  }, []);
  
  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiPolls = await getAllPolls();

      setPolls(apiPolls);
    } catch (err) {
      console.warn("Failed to fetch polls from API, using mock data:", err);
      setError("Failed to load polls from server");
    } finally {
      setLoading(false);
    }
  };

  // Create new poll
  const createPoll = async ({
    question,
    options,
    idToken,
  }: {
    question: string;
    options: string[];
    idToken: string | undefined;
  }): Promise<string> => {
    try {
      const response = await createPollApi({ question, options, idToken });
      console.log(response);
      return response.message;
    } catch (err) {
      console.error("Failed to create poll:", err);
      throw new Error("Failed to create poll. Please try again.");
    }
  };

  // Vote on option (local update + API call)
  const voteOnOption = async (pollId: string, optionId: number) => {
    try {
      // Optimistic update
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.pollId === pollId || poll.pollId === pollId
            ? {
                ...poll,
                options: poll.options.map((option) =>
                  option.id === optionId
                    ? { ...option, votes: option.votesCount + 1 }
                    : option
                ),
              }
            : poll
        )
      );

      // If you implement a voting endpoint, uncomment this:
      // await votePoll(pollId, { optionId });
    } catch (err) {
      console.error("Failed to vote:", err);
      // Revert optimistic update on error
      await fetchPolls();
    }
  };

  // Delete poll (if needed)
  const deletePoll = async (pollId: string) => {
    try {
      // Optimistic update
      setPolls((prevPolls) =>
        prevPolls.filter((poll) => poll.pollId !== pollId && poll.pollId !== pollId)
      );

      // If you implement a delete endpoint, uncomment this:
      // await deletePollAPI(pollId);
    } catch (err) {
      console.error("Failed to delete poll:", err);
      // Revert optimistic update on error
      await fetchPolls();
    }
  };

  // Refresh polls
  const refreshPolls = () => {
    fetchPolls();
  };

  return {
    polls,
    loading,
    error,
    createPoll, // NEW: Create poll function
    voteOnOption,
    deletePoll, // NEW: Delete poll function
    refreshPolls,
    setPolls, // Keep for backward compatibility
  };
}
