export interface ProblemsFilter {
  search?: string;
  tags?: number[];
  difficulty?: number | null;
  status?: number | null;
  ordering?: string | null;
  lang?: string | null;
  category?: number | null;
  favorites?: boolean;
}

export interface ProblemsListParams extends ProblemsFilter {
  page?: number;
  pageSize?: number;
}
