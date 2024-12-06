export enum ConsultationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const getStatusText = (status: ConsultationStatus) => {
  switch (status) {
    case ConsultationStatus.PENDING:
      return 'Pending';
    case ConsultationStatus.IN_PROGRESS:
      return 'In Progress';
    case ConsultationStatus.COMPLETED:
      return 'Completed';
    case ConsultationStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status;
  }
};

export const getStatusColor = (status: ConsultationStatus) => {
  switch (status) {
    case ConsultationStatus.PENDING:
      return 'bg-yellow-100 text-yellow-600';
    case ConsultationStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-600';
    case ConsultationStatus.COMPLETED:
      return 'bg-green-100 text-green-600';
    case ConsultationStatus.CANCELLED:
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// 필터 옵션 타입 정의
export interface ConsultationFilters {
  status?: ConsultationStatus;
  sort?: 'latest' | 'oldest';
  teacher_id?: number;
  category_id?: number;
  topic_id?: number;
}
