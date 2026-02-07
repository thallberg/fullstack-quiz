import type { FriendshipInviteDto, FriendshipResponseDto } from '@/types';
import { request } from './client';

export async function sendFriendInvite(
  data: FriendshipInviteDto
): Promise<FriendshipResponseDto> {
  return request<FriendshipResponseDto>('/friendship/invite', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function acceptFriendInvite(id: number): Promise<FriendshipResponseDto> {
  return request<FriendshipResponseDto>(`/friendship/${id}/accept`, {
    method: 'POST',
  });
}

export async function declineFriendInvite(id: number): Promise<void> {
  return request<void>(`/friendship/${id}/decline`, {
    method: 'POST',
  });
}

export async function getPendingInvites(): Promise<FriendshipResponseDto[]> {
  try {
    return await request<FriendshipResponseDto[]>('/friendship/pending');
  } catch (err) {
    if (err instanceof Error && err.message.includes('400')) {
      return [];
    }
    throw err;
  }
}

export async function getFriends(): Promise<FriendshipResponseDto[]> {
  try {
    return await request<FriendshipResponseDto[]>('/friendship/friends');
  } catch (err) {
    if (err instanceof Error && err.message.includes('400')) {
      return [];
    }
    throw err;
  }
}

export async function removeFriend(id: number): Promise<void> {
  return request<void>(`/friendship/${id}`, {
    method: 'DELETE',
  });
}
