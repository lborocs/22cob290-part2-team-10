import { create } from 'zustand';

import type { SessionUser } from '~/types';

// add any other mutators - we don't want setUser
export type UserStore = {
  user: SessionUser;
  setName: (name: string) => void;
  setImage: (image: string) => void;
};

// when the store is used, `user` should NEVER be null because it is set in `_app`
const useUserStore = create<UserStore>((set) => ({
  user: null as unknown as SessionUser,
  setName: (name: string) =>
    set((state) => ({
      user: {
        ...state.user,
        name,
      },
    })),
  setImage: (image: string) =>
    set((state) => ({
      user: {
        ...state.user,
        image,
      },
    })),
}));

export default useUserStore;
