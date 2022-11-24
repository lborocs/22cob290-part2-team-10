import { createContext, useContext } from 'react';
import { createStore } from 'zustand';

import type { UserInfo } from '~/types';

// using zustand with React context: https://github.com/pmndrs/zustand#react-context

// add any other mutators - we don't want setUser
type UserStore = {
  user: UserInfo
  setFirstName: (firstName: string) => void
  setLastName: (lastName: string) => void
};

// when the store is used, `user` should NEVER be null because it is passed as page prop by getServerSideProps
const userStore = createStore<UserStore>((set) => ({
  user: null as unknown as UserInfo,
  setFirstName: (firstName: string) => set((state) => ({
    user: {
      ...state.user,
      fname: firstName,
    },
  })),
  setLastName: (lastName: string) => set((state) => ({
    user: {
      ...state.user,
      lname: lastName,
    },
  })),
}));

const UserStoreContext = createContext<typeof userStore>(userStore);

export function UserStoreProvider({ user, children }: {
  user: UserInfo
  children: React.ReactNode
}) {
  userStore.setState((state) => ({
    ...state,
    user,
  }));

  return (
    <UserStoreContext.Provider value={userStore}>
      {children}
    </UserStoreContext.Provider>
  );
}

export function useUserStore(): typeof userStore {
  return useContext(UserStoreContext);
}
