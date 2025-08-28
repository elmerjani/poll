import { api } from "./baseApi";
import type {  PollExample } from "../types/poll";


// Get a single poll by ID
export const getPoll = async (pollId: string): Promise<PollExample> => {
  const response = await api.get(`/polls/${pollId}`);
  return response.data;
};

// Create a new poll (requires authentication)
export const createPollApi = async ({
  question,
  options,
  idToken,
}: {
  question: string;
  options: string[];
  idToken: string | undefined;
}): Promise<{ pollId: string; message: string }> => {
  const pollData = { question, options };
  const response = await api.post("/polls", pollData, {
    headers: {
      Authorization: idToken,
    },
  });
  return response.data;
};

// Vote on a poll option (if you implement voting endpoint)
export const votePoll = async (
  pollId: string,
  voteData
)=> {
  const response = await api.post(`/polls/${pollId}/vote`, voteData);
  return response.data;
};

// Get all polls (simplified for current use - fetches first page)
export const getAllPolls = async (): Promise<PollExample[]> => {
  const response = await api.get("/polls");
  return response.data;
};
