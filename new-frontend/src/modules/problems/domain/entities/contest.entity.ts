export interface ContestProblemPreview {
  id: number;
  symbol: string;
  title: string;
}

export interface ContestPreview {
  id: number;
  title: string;
  problems: ContestProblemPreview[];
}
