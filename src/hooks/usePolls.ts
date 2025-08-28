import { useState, useEffect } from "react";
import { getAllPolls, createPollApi, getAllPollsAuth } from "../api/polls";
import type { PollExample } from "../types/poll";
import { useAuth } from "react-oidc-context";

export function usePolls() {
  const auth = useAuth()
  const [polls, setPolls] = useState<PollExample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      // const apiPolls = await getAllPolls();
      let apiPolls;
      if(auth.isAuthenticated && auth.user && auth.user.id_token){
        apiPolls = await getAllPollsAuth({idToken:auth.user.id_token})
      }
      else{
        apiPolls = await getAllPolls();
      }
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
    refreshPolls,
    setPolls, // Keep for backward compatibility
  };
}
