import type { QuizDataSource } from '../QuizDataSource';
import {
  generateToken,
  getCurrentUser,
  getNextId,
  isBrowser,
  loadUsers,
  saveUsers,
  setAuthToken,
} from './storage';

export const authHandlers: Pick<
  QuizDataSource,
  'register' | 'login' | 'updateProfile' | 'changePassword'
> = {
  async register(data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const users = loadUsers();
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }

    const userId = getNextId('user');
    const user = {
      id: userId,
      username: data.username,
      email: data.email,
      passwordHash: btoa(data.password),
    };

    users.push(user);
    saveUsers(users);

    const token = generateToken(userId, data.username, data.email);
    setAuthToken(token);

    return {
      token,
      userId,
      username: data.username,
      email: data.email,
    };
  },

  async login(data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const users = loadUsers();
    const user = users.find(u => u.email === data.email);

    if (!user || atob(user.passwordHash) !== data.password) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user.id, user.username, user.email);
    setAuthToken(token);

    return {
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
    };
  },

  async updateProfile(data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== users[userIndex].email) {
      if (users.find(u => u.email === data.email && u.id !== currentUser.userId)) {
        throw new Error('Email already in use');
      }
    }

    if (data.username) users[userIndex].username = data.username;
    if (data.email) users[userIndex].email = data.email;

    saveUsers(users);

    const updatedUser = users[userIndex];
    const token = generateToken(updatedUser.id, updatedUser.username, updatedUser.email);
    setAuthToken(token);

    return {
      token,
      userId: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    };
  },

  async changePassword(data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = loadUsers();
    const user = users.find(u => u.id === currentUser.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (atob(user.passwordHash) !== data.currentPassword) {
      throw new Error('Current password is incorrect');
    }

    user.passwordHash = btoa(data.newPassword);
    saveUsers(users);
  },
};
