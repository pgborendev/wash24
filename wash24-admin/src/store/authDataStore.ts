// userStore.ts
import { defineStore } from 'pinia';

interface AuthData {
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
}

export const authDataStore = 
defineStore('auth_data', {
  state: (): AuthData => {
    const authData = localStorage.getItem('auth_data');
    const initialState: AuthData = authData ? JSON.parse(authData) : {
      userId: '',
      accessToken: null,
      refreshToken: null,
    };
    return initialState;
  },
  getters: {
    isLoggedIn: (state) => state.accessToken !== null,
    authData: (state) => state
  },
  actions: {
    setData(authData: AuthData) {
      localStorage.setItem('auth_data', JSON.stringify(authData));
      Object.assign(this, authData);
    },
    clearData() {
      localStorage.removeItem('auth_data');
      Object.assign(this, {
        userId: '',
        accessToken: null,
        refreshToken: null,
      });
    },
  },
});