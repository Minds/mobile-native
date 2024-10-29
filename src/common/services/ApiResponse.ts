import { FieldError } from './ApiErrors';

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  errors?: FieldError[];
  errorId?: string;
}
