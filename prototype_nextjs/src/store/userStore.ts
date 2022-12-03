import create from 'zustand';

import type { ExposedUser } from '~/types';

// add any other mutators - we don't want setUser
export type UserStore = {
  user: ExposedUser
  setName: (name: string) => void
};

// when the store is used, `user` should NEVER be null because it is set in `_app`
const useUserStore = create<UserStore>((set) => ({
  user: null as unknown as ExposedUser,
  setName: (name: string) => set((state) => ({
    user: {
      ...state.user,
      name,
    },
  })),
}));

export default useUserStore;
