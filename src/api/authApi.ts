import client from './client';
import type { AuthRequest, AuthResponse } from '../types';

export async function register(request: AuthRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/api/auth/register', request);
  return data;
}

export async function login(request: AuthRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/api/auth/login', request);
  return data;
}
