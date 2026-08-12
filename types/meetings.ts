export interface MeetingRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  start_at: string;
  end_at: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  expires_at: string | null;
  created_at: string;
}

export interface ApiErrorBody {
  error: string;
  message: string;
  retryAfterSeconds?: number;
  details?: Record<string, string[]>;
}
