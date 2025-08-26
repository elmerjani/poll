import { useState } from 'react';
import { mockPolls } from '../utils/mockData';

export function usePolls() {
  const [polls, setPolls] = useState(mockPolls);
  
  const voteOnOption = (pollId: string, optionId: string) => {
    setPolls(prevPolls => 
      prevPolls.map(poll => 
        poll.id === pollId 
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
  };

  return { polls, setPolls, voteOnOption };
}
