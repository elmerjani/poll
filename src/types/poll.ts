import type { Owner } from "./user";

export interface OptionExample {
  id: number;
  text: string;
  votesCount: number;
}
export interface PollExample {
  pollId: string;
  question: string;
  createdAt: string;
  owner: Owner;
  options: OptionExample[];
  userOption?: number;
  
}
export interface PollWithVotes extends PollExample{
  votes: {
    user: {
      name: string;
      email: string;
    };
    optionId: number;
    createdAt: string;
  }[];
}