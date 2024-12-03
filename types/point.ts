export interface PointHistory {
  point_id: number;
  user_id: number;
  points_change: number;
  change_reason: string;
  change_date: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  post_id: number | null;
}

export interface PointHistoryResponse {
  data: PointHistory[];
  total: number;
  page: number;
  limit: number;
}
