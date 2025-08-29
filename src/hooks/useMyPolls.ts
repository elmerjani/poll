import { useState, useEffect, useCallback, useRef } from "react";
import { createPollApi, deletePollApi, getMyPolls } from "../api/polls";
import type { PollExample } from "../types/poll";
import { useAuth } from "react-oidc-context";

export function useMyPolls(limit = 12) {
  const auth = useAuth();
  const [polls, setPolls] = useState<PollExample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);

  // Paginated fetch
  const fetchPolls = useCallback(
    async (reset = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const params = {
          limit,
          lastKey: reset ? undefined : lastKey,
        };
        if (!auth || !auth.user || !auth.user.id_token) return;
        const response = await getMyPolls({
          idToken: auth.user?.id_token,
          ...params,
        });
        setPolls((prev) =>
          reset ? response.items : [...prev, ...response.items]
        );
        setLastKey(response.lastKey);
        setHasMore(!!response.lastKey && response.items.length > 0);
      } catch (err) {
        console.error("Failed to fetch polls:", err);
        setError("Failed to load polls");
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [auth.isAuthenticated, auth.user?.id_token, lastKey, limit]
  );

  // Load more polls for infinite scroll
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchPolls(false);
  }, [hasMore, loading, fetchPolls]);

  // Refresh polls
  const refreshPolls = useCallback(async () => {
    setLastKey(undefined);
    await fetchPolls(true);
  }, [fetchPolls]);

  // Initial fetch
  useEffect(() => {
    fetchPolls(true);
  }, [auth.isAuthenticated]);

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
      return response.message;
    } catch (err) {
      console.error("Failed to create poll:", err);
      throw new Error("Failed to create poll. Please try again.");
    }
  };
  const deletePoll = async (pollId: string) => {
    try {
      if (!auth.user?.id_token) throw new Error("Not authenticated");

      const response = await deletePollApi({
        pollId,
        idToken: auth.user.id_token,
      });

      console.log("Poll deleted:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete poll:", err);
      throw err; // propagate the error to the UI
    }
  };

  // Vote on option (local update + API call)
  const voteOnOption = async (pollId: string, optionId: number) => {
    try {
      setPolls((prev) =>
        prev.map((poll) =>
          poll.pollId === pollId
            ? {
                ...poll,
                options: poll.options.map((option) =>
                  option.id === optionId
                    ? { ...option, votesCount: option.votesCount + 1 }
                    : option
                ),
              }
            : poll
        )
      );
      // Uncomment and implement API call if needed
      // await votePoll(pollId, { optionId });
    } catch (err) {
      console.error("Failed to vote:", err);
      await fetchPolls(true); // revert
    }
  };

  return {
    polls,
    loading,
    error,
    hasMore,
    loadMore,
    refreshPolls,
    createPoll,
    voteOnOption,
    setPolls,
    deletePoll,
  };
}
