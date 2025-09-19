import { api } from '@/lib/api';

export interface TopicPayload {
  title: string;
  slug?: string;
  content?: string;
  published?: boolean;
}

export const topicsService = {
  list() {
    return api.get<any[]>('/api/topics');
  },
  getBySlug(slug: string) {
    return api.get<any>(`/api/topics/${encodeURIComponent(slug)}`);
  },
  create(payload: TopicPayload) {
    return api.post<any>('/api/topics', payload);
  },
  update(id: string | number, payload: TopicPayload) {
    return api.put<any>(`/api/topics/${id}`, payload);
  },
  remove(id: string | number) {
    return api.delete<any>(`/api/topics/${id}`);
  },
  togglePublish(id: string | number) {
    return api.patch<any>(`/api/topics/${id}/publish`);
  },
};
