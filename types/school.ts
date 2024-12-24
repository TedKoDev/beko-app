export interface School {
  school_id: number;
  country_code: string;
  region: string;
  name_ko: string;
  name_en: string;
  website_url: string;
  description: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface SchoolsResponse {
  items: School[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface PaginationParams {
  page?: number;
  limit?: number;
  country_code?: string; // 추가된 필터
  region?: string; // 추가된 필터
}
