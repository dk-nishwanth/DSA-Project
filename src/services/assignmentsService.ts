import { api } from '@/lib/api';

export interface AssignmentPayload {
  title: string;
  description?: string;
  difficulty?: string;
  category?: string;
  isPublished?: boolean;
}

export const assignmentsService = {
  list() {
    return api.get<any[]>('/api/assignments');
  },
  getById(id: string | number) {
    return api.get<any>(`/api/assignments/${id}`);
  },
  create(payload: AssignmentPayload) {
    return api.post<any>('/api/assignments', payload);
  },
  update(id: string | number, payload: AssignmentPayload) {
    return api.put<any>(`/api/assignments/${id}`, payload);
  },
  remove(id: string | number) {
    return api.delete<any>(`/api/assignments/${id}`);
  },
  togglePublish(id: string | number) {
    return api.patch<any>(`/api/assignments/${id}/publish`);
  },
  submitSolution(id: string | number, solution: { code: string; language?: string }) {
    return api.post<any>(`/api/assignments/${id}/submit`, solution);
  },
};
