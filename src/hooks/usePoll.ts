import { useState, useEffect } from "react";
import { getPoll } from "../api/polls";

export function usePoll(pollId: string | undefined) {
  const [poll, setPoll] = useState<{
    pollId: string;
    question: string;
    createdAt: string;
    owner: { name: string; email: string };
    options: { id: number; text: string; votesCount: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId) {
      setLoading(false);
      return;
    }

    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiPoll = await getPoll(pollId);
        setPoll(apiPoll);
      } catch (err) {
        console.error("Failed to fetch poll:", err);
        setError("Failed to load poll");
        setPoll(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  return { poll, loading, error };
}
