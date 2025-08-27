import { useState, useEffect } from 'react';
import { getAllPolls } from '../api/polls';
import { mockPolls } from '../utils/mockData';
import type { Poll } from '../types/poll';

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch polls from API
  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiPolls = await getAllPolls();
      
      // Transform API data to match our component structure
      const transformedPolls: Poll[] = apiPolls.map(poll => ({
        pollId: poll.pollId,
        id: poll.pollId, // For backward compatibility
        question: poll.question,
        options: poll.options,
        createdBy: poll.createdBy,
        createdAt: poll.createdAt,
        createdOn: new Date(poll.createdAt).toLocaleDateString()
      }));
      
      setPolls(transformedPolls);
    } catch (err) {
      console.warn('Failed to fetch polls from API, using mock data:', err);
      setError('Failed to load polls from server');
      // Fallback to mock data - transform to match Poll type
      const transformedMockPolls: Poll[] = mockPolls.map(poll => ({
        pollId: poll.id,
        id: poll.id,
        question: poll.question,
        options: poll.options,
        createdBy: poll.createdBy,
        createdAt: new Date().toISOString(),
        createdOn: poll.createdOn
      }));
      setPolls(transformedMockPolls);
    } finally {
      setLoading(false);
    }
  };

  // Load polls on mount
  useEffect(() => {
    fetchPolls();
  }, []);

  // Vote on option (local update + API call)
  const voteOnOption = async (pollId: string, optionId: string) => {
    try {
      // Optimistic update
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          (poll.id === pollId || poll.pollId === pollId)
            ? {
                ...poll,
                options: poll.options.map(option =>
                  option.id === optionId
                    ? { ...option, votes: option.votes + 1 }
                    : option
                )
              }
            : poll
        )
      );

      // If you implement a voting endpoint, uncomment this:
      // await votePoll(pollId, { optionId });
      
    } catch (err) {
      console.error('Failed to vote:', err);
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
    voteOnOption, 
    refreshPolls,
    setPolls // Keep for backward compatibility
  };
}
