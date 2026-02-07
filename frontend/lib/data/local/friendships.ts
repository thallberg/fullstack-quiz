import type { QuizDataSource } from '../QuizDataSource';
import {
  getCurrentUser,
  getNextId,
  isBrowser,
  loadFriendships,
  loadUsers,
  saveFriendships,
} from './storage';

export const friendshipHandlers: Pick<
  QuizDataSource,
  'sendFriendInvite' | 'acceptFriendInvite' | 'declineFriendInvite' | 'getPendingInvites' | 'getFriends' | 'removeFriend'
> = {
  async sendFriendInvite(data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = loadUsers();
    const addressee = users.find(u => u.email === data.email);
    if (!addressee) {
      throw new Error('Användare med denna e-post finns inte');
    }
    if (addressee.id === currentUser.userId) {
      throw new Error('Du kan inte bjuda in dig själv');
    }

    const friendships = loadFriendships();
    const existing = friendships.find(f =>
      (f.requesterId === currentUser.userId && f.addresseeId === addressee.id) ||
      (f.requesterId === addressee.id && f.addresseeId === currentUser.userId)
    );

    if (existing) {
      if (existing.status === 'Pending') {
        throw new Error('Inbjudan finns redan');
      }
      if (existing.status === 'Accepted') {
        throw new Error('Ni är redan vänner');
      }
    }

    const friendshipId = getNextId('friendship');
    const friendship = {
      id: friendshipId,
      requesterId: currentUser.userId,
      requesterUsername: currentUser.username,
      requesterEmail: currentUser.email,
      addresseeId: addressee.id,
      addresseeUsername: addressee.username,
      addresseeEmail: addressee.email,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    friendships.push(friendship);
    saveFriendships(friendships);
    return friendship;
  },

  async acceptFriendInvite(id) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const friendships = loadFriendships();
    const friendship = friendships.find(f => f.id === id && f.addresseeId === currentUser.userId);
    if (!friendship) {
      throw new Error('Inbjudan hittades inte');
    }
    if (friendship.status !== 'Pending') {
      throw new Error('Inbjudan är inte längre giltig');
    }

    friendship.status = 'Accepted';
    friendship.acceptedAt = new Date().toISOString();
    saveFriendships(friendships);
    return friendship;
  },

  async declineFriendInvite(id) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const friendships = loadFriendships();
    const index = friendships.findIndex(f => f.id === id && f.addresseeId === currentUser.userId);
    if (index === -1) {
      throw new Error('Inbjudan hittades inte');
    }

    friendships.splice(index, 1);
    saveFriendships(friendships);
  },

  async getPendingInvites() {
    if (!isBrowser()) return [];
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const friendships = loadFriendships();
    return friendships.filter(f => f.addresseeId === currentUser.userId && f.status === 'Pending');
  },

  async getFriends() {
    if (!isBrowser()) return [];
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const friendships = loadFriendships();
    return friendships.filter(f =>
      f.status === 'Accepted' &&
      (f.requesterId === currentUser.userId || f.addresseeId === currentUser.userId)
    );
  },

  async removeFriend(id) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const friendships = loadFriendships();
    const index = friendships.findIndex(f =>
      f.id === id &&
      (f.requesterId === currentUser.userId || f.addresseeId === currentUser.userId)
    );
    if (index === -1) {
      throw new Error('Vänskap hittades inte');
    }

    friendships.splice(index, 1);
    saveFriendships(friendships);
  },
};
