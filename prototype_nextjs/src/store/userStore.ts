import create from 'zustand';

import type { UserInfo } from '~/types';

// using zustand with React context: https://github.com/pmndrs/zustand#react-context

// add any other mutators - we don't want setUser
type UserStore = {
  user: UserInfo
  setFirstName: (firstName: string) => void
  setLastName: (lastName: string) => void
};

export type UserStoreState = UserStore;

// when the store is used, `user` should NEVER be null because it is set in `_app`
const useUserStore = create<UserStoreState>((set) => ({
  user: null as unknown as UserInfo,
  setFirstName: (firstName: string) => set((state) => ({
    user: {
      ...state.user,
      firstName,
    },
  })),
  setLastName: (lastName: string) => set((state) => ({
    user: {
      ...state.user,
      lastName,
    },
  })),
}));

export default useUserStore;
