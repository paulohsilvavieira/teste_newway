import api from '../../lib/api';

interface LoginPayload {
  email: string;
  password: string;
}
interface CreateUserByAdmin {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface CreateUserCommon {
  email: string;
  password: string;
  name: string;
}
interface LoginResponse {
  token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

export async function registerAdmin(
  payload: CreateUserByAdmin
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/auth/register/admin',
    payload
  );
  return response.data;
}

export async function registerFirstAdmin(
  payload: CreateUserByAdmin
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/auth/register/first/admin',
    payload
  );
  return response.data;
}

export async function registerCommon(
  payload: CreateUserCommon
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/auth/register/common',
    payload
  );
  return response.data;
}
