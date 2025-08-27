import { api } from "./baseApi";
import type { 
  Poll, 
  CreatePollRequest, 
  CreatePollResponse, 
  ListPollsParams, 
  ListPollsResponse,
  VotePollRequest 
} from '../types/poll';

// List polls with pagination and sorting
export const getPolls = async (params: ListPollsParams = {}): Promise<ListPollsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.lastKey) queryParams.append('lastKey', params.lastKey);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  const response = await api.get(`/polls?${queryParams.toString()}`);
  return response.data;
};

// Get a single poll by ID
export const getPoll = async (pollId: string): Promise<Poll> => {
  const response = await api.get(`/polls/${pollId}`);
  return response.data;
};

// Create a new poll (requires authentication)
export const createPoll = async (pollData: CreatePollRequest): Promise<CreatePollResponse> => {
  const response = await api.post('/polls', pollData);
  return response.data;
};

// Vote on a poll option (if you implement voting endpoint)
export const votePoll = async (pollId: string, voteData: VotePollRequest): Promise<Poll> => {
  const response = await api.post(`/polls/${pollId}/vote`, voteData);
  return response.data;
};

// Get all polls (simplified for current use - fetches first page)
export const getAllPolls = async (): Promise<Poll[]> => {
  const response = await getPolls({ limit: 50, sortOrder: 'desc' });
  return response.items;
};
