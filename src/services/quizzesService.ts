import { api } from '@/lib/api';

export interface QuizPayload {
  title: string;
  description?: string;
  difficulty?: string;
  category?: string;
  isPublished?: boolean;
  questions?: any[];
}

export const quizzesService = {
  list() {
    return api.get<any[]>('/api/quizzes');
  },
  getById(id: string | number) {
    return api.get<any>(`/api/quizzes/${id}`);
  },
  create(payload: QuizPayload) {
    return api.post<any>('/api/quizzes', payload);
  },
  update(id: string | number, payload: QuizPayload) {
    return api.put<any>(`/api/quizzes/${id}`, payload);
  },
  remove(id: string | number) {
    return api.delete<any>(`/api/quizzes/${id}`);
  },
  togglePublish(id: string | number) {
    return api.patch<any>(`/api/quizzes/${id}/publish`);
  },
  submitAnswers(id: string | number, answers: Record<string, any>) {
    return api.post<any>(`/api/quizzes/${id}/submit`, answers);
  },
};
