import type { ProblemDetails } from '../types';
import axios from 'axios';

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ProblemDetails | undefined;

    if (data?.errors) {
      const messages = Object.values(data.errors).flat();
      if (messages.length > 0) return messages.join(' ');
    }

    if (data?.detail) return data.detail;
    if (data?.title) return data.title;

    if (error.response) {
      switch (error.response.status) {
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'A conflict occurred. The resource may already exist.';
        default:
          return `Server error (${error.response.status}). Please try again.`;
      }
    }

    if (error.request) {
      return 'Unable to reach the server. Please check your connection.';
    }
  }

  if (error instanceof Error) return error.message;

  return 'An unexpected error occurred.';
}
