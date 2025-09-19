import { api } from '@/lib/api';

export interface HealthResponse {
  status: string;
  message?: string;
  timestamp?: string;
}

export const backendService = {
  async health(): Promise<HealthResponse> {
    return api.get<HealthResponse>('/api/health');
  },
};
