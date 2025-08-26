import { useState } from 'react';

export function useVote(initialVotes: number) {
  const [votes, setVotes] = useState(initialVotes);
  // Placeholder for voting logic
  const vote = () => setVotes(v => v + 1);
  return { votes, vote };
}
