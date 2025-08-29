import { api } from "./baseApi";
import type { PollExample, PollWithVotes } from "../types/poll";

// Get a single poll by ID
export const getPoll = async (pollId: string): Promise<PollWithVotes> => {
  const response = await api.get(`/polls/${pollId}`);
  return response.data;
};
export const getPollAuth = async ({
  pollId,
  idToken,
}: {
  pollId: string;
  idToken: string;
}): Promise<PollWithVotes> => {
  const response = await api.get(`/pollsAuth/${pollId}`, {
    headers: {
      Authorization: idToken,
    },
  });
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

// Get all polls (simplified for current use - fetches first page)
export const getAllPolls = async ({
  limit = 10,
  lastKey,
}: {
  limit?: number;
  lastKey?: any;
}): Promise<{
  items: PollExample[];
  lastKey?: string;
}> => {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
  });
  if (lastKey) {
    queryParams.append("lastKey", JSON.stringify(lastKey));
  }
  const response = await api.get(`/polls?${queryParams}`);
  return response.data;
};

export const getAllPollsAuth = async ({
  idToken,
  limit = 10,
  lastKey,
}: {
  idToken: string;
  limit?: number;
  lastKey?: any;
}): Promise<{ items: PollExample[]; lastKey?: string }> => {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
  });
  if (lastKey) {
    queryParams.append("lastKey", JSON.stringify(lastKey));
  }
  const response = await api.get(`/pollsAuth?${queryParams}`, {
    headers: {
      Authorization: idToken,
    },
  });
  return response.data;
};

export const getMyPolls = async ({
  idToken,
  limit = 10,
  lastKey,
}: {
  idToken: string;
  limit?: number;
  lastKey?: string;
}): Promise<{ items: PollExample[]; lastKey?: string }> => {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
  });
  if (lastKey) {
    queryParams.append("lastKey", JSON.stringify(lastKey));
  }
  const response = await api.get(`/myPolls?${queryParams}`, {
    headers: {
      Authorization: idToken,
    },
  });
  return response.data;
};

export const deletePollApi = async ({
  pollId,
  idToken,
}: {
  pollId: string;
  idToken: string;
}) => {
  const response = await api.delete(`/polls/${pollId}`, {
    headers: {
      Authorization: idToken,
    },
  });
  return response.data;
};
