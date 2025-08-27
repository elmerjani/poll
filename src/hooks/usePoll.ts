import { useState, useEffect } from 'react';
import { getPoll } from '../api/polls';
import type { Poll } from '../types/poll';

export function usePoll(pollId: string | undefined) {
  const [poll, setPoll] = useState<Poll | null>(null);
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
        
        // Transform API data to match our component structure
        const transformedPoll: Poll = {
          pollId: apiPoll.pollId,
          id: apiPoll.pollId,
          question: apiPoll.question,
          options: apiPoll.options,
          createdBy: apiPoll.createdBy,
          createdAt: apiPoll.createdAt,
          createdOn: new Date(apiPoll.createdAt).toLocaleDateString()
        };
        
        setPoll(transformedPoll);
      } catch (err) {
        console.error('Failed to fetch poll:', err);
        setError('Failed to load poll');
        setPoll(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  return { poll, loading, error };
}
