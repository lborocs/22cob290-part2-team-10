import create from 'zustand';

export type ColorModeStore = {
  mode: 'light' | 'dark'
  toggleColorMode: () => void
  setColorMode: (mode: ColorModeStore['mode']) => void
};

const useColorMode = create<ColorModeStore>((set) => ({
  mode: 'dark',
  toggleColorMode: () => set((state) => ({
    mode: state.mode === 'dark' ? 'light' : 'dark',
  })),
  setColorMode: (mode: ColorModeStore['mode']) => set((state) => ({
    mode,
  })),
}));

export default useColorMode;
