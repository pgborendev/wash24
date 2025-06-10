// userStore.ts
import { defineStore } from 'pinia';

interface User {
  username: string;
  avatar: string,
  email: '',
  roles: [],
  accessToken: string | null;
  refreshToken: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): User => {
    const storedUser = localStorage.getItem('user');
    const initialState: User = storedUser ? JSON.parse(storedUser) : {
      username: '',
      email: '',
      avatar: '',
      roles: [],
      accessToken: null,
      refreshToken: null,
    };
    return initialState;
  },
  getters: {
    isLoggedIn: (state) => state.accessToken !== null,
    currentUser: (state) => state
  },
  actions: {
    setUser(user: User) {
      localStorage.setItem('user', JSON.stringify(user));
      Object.assign(this, user);
    },
    clearUser() {
      localStorage.removeItem('user');
      Object.assign(this, {
        username: '',
        email: '',
        roles: [],
        accessToken: null,
        refreshToken: null,
      });
    },
  },
});