// src/hooks/usePollRealtime.ts
import { useEffect, useState, useCallback } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import type { OptionExample } from "../types/poll";
import { useAuth } from "react-oidc-context";

interface UsePollRealtimeProps {
  pollId: string;
  initialOptions: OptionExample[];
  initialUserOption?: number; // Initial user's vote option ID
}

export const usePollRealtime = ({
  pollId,
  initialOptions,
  initialUserOption,
}: UsePollRealtimeProps) => {
  const auth = useAuth();
  const [options, setOptions] = useState<OptionExample[]>(initialOptions);
  const [updatedOptions, setUpdatedOptions] = useState<Set<number>>(new Set());
  const { sendVote, subscribe, isConnected } = useWebSocket();
  const [userOption, setUserOption] = useState<number | undefined>(initialUserOption);

  // Update options when initialOptions change (important for PollDetail)
  useEffect(() => {
    if (initialOptions.length > 0) {
      console.log("Initializing options with:", initialOptions);
      setOptions(initialOptions);
    }
  }, [initialOptions]);

  // Update user option when initialUserOption changes
  useEffect(() => {
    setUserOption(initialUserOption);
  }, [initialUserOption]);

  // Subscribe to WebSocket updates for this poll
  useEffect(() => {
    if (!pollId || !auth.isAuthenticated) {
      console.log("Skipping WebSocket subscription - no pollId or not authenticated");
      return;
    }

    console.log(`Setting up WebSocket subscription for poll ${pollId}`);

    const unsubscribe = subscribe(pollId, (data) => {
      console.log(`Received update for poll ${pollId}:`, data);

      // Update options with new vote counts
      setOptions((prevOptions) => {
        if (prevOptions.length === 0) {
          // If we don't have options yet, use the ones from the update
          return data.options || [];
        }

        const newOptions = prevOptions.map((option) => {
          const updatedOption = data.options.find((p) => p.id === option.id);
          return updatedOption
            ? {
                ...option,
                votesCount: updatedOption.votesCount,
              }
            : option;
        });

        // Track which options were updated for animation
        const changedOptionIds = new Set<number>();
        newOptions.forEach((newOption, index) => {
          if (newOption.votesCount !== prevOptions[index]?.votesCount) {
            changedOptionIds.add(newOption.id);
          }
        });

        if (changedOptionIds.size > 0) {
          setUpdatedOptions(changedOptionIds);
          // Clear the updated options after animation duration
          setTimeout(() => {
            setUpdatedOptions(new Set());
          }, 1000);
        }

        return newOptions;
      });

      // Update user's vote if the update is from the current user
      const currentUserEmail = auth.user?.profile?.email;
      if (data.user?.email === currentUserEmail && data.optionId !== undefined) {
        console.log(`Updating user vote to option ${data.optionId}`);
        setUserOption(data.optionId);
      }
    });

    return () => {
      console.log(`Cleaning up WebSocket subscription for poll ${pollId}`);
      unsubscribe();
    };
  }, [pollId, subscribe, auth.isAuthenticated, auth.user?.profile?.email]);

  // Handle voting
  const handleVote = useCallback(
    (optionId: number) => {
      if (!auth.isAuthenticated) {
        console.warn("User not authenticated, cannot vote");
        return;
      }

      if (!isConnected) {
        console.warn("WebSocket not connected, cannot vote");
        return;
      }

      console.log(`Sending vote for poll ${pollId}, option ${optionId}`);
      sendVote(pollId, optionId);

      // Optimistically update the user's vote
      setUserOption(optionId);
    },
    [pollId, sendVote, isConnected, auth.isAuthenticated]
  );

  return {
    options,
    updatedOptions,
    handleVote,
    isConnected,
    userOption,
    isAuthenticated: auth.isAuthenticated,
  };
};