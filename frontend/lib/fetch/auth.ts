import type {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from '@/types';
import { request } from './client';

export async function register(data: RegisterDto): Promise<AuthResponseDto> {
  return request<AuthResponseDto>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginDto): Promise<AuthResponseDto> {
  return request<AuthResponseDto>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProfile(data: UpdateProfileDto): Promise<AuthResponseDto> {
  return request<AuthResponseDto>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: ChangePasswordDto): Promise<void> {
  // Map to backend format (camelCase to PascalCase)
  const backendData = {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  };

  return request<void>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
}
