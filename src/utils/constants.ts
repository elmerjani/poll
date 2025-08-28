import type { OptionExample } from "../types/poll";
export function getTotalVotes(options: OptionExample[]) {
  return options.reduce((sum, opt) => sum + opt.votesCount, 0);
}

export function sortOptionsByVotes(options: {id: number; text: string; votesCount: number}[]) {
  return [...options].sort((a, b) => b.votesCount - a.votesCount);
}
