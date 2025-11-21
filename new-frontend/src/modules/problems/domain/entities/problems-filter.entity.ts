export interface ProblemsFilter {
  search?: string;
  ordering?: string;
  lang?: string;
  favorites?: boolean;
  category?: number | null;
  tags?: number[];
  difficulty?: number | null;
  status?: number | null;
  page?: number;
  pageSize?: number;
}
