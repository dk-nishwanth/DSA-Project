import { api } from '@/lib/api';

export type TopicProgressStatus = 'not-started' | 'in-progress' | 'completed';

export interface ProgressResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const progressService = {
  // GET /api/progress
  getProgress() {
    return api.get<ProgressResponse>('/api/progress');
  },

  // POST /api/progress/topic
  updateTopicProgress(payload: { topicId: string | number; status: TopicProgressStatus; timeSpent?: number }) {
    return api.post<ProgressResponse>('/api/progress/topic', {
      topicId: String(payload.topicId),
      status: payload.status,
      timeSpent: payload.timeSpent ?? 0,
    });
  },
};
