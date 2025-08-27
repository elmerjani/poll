export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  pollId: string;
  id?: string; // For backward compatibility with components
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  createdOn?: string; // For backward compatibility with components
  PK?: string; // DynamoDB partition key
}

export interface CreatePollRequest {
  question: string;
  options: string[]; // Lambda expects array of strings, not objects
  createdBy?: string; // Optional, will be set by Lambda from auth
}

export interface CreatePollResponse {
  pollId: string;
  message: string;
}

export interface ListPollsParams {
  limit?: number;
  lastKey?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListPollsResponse {
  items: Poll[];
  lastKey: string | null;
}

export interface VotePollRequest {
  optionId: string;
}
