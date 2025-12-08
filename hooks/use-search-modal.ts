import { create } from "zustand";

interface SearchModalState {
  isOpen: boolean;
  onOpen: () => void;
  onCLose: () => void;
}

const useSearchModal = create<SearchModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onCLose: () => set({ isOpen: false }),
}));

export default useSearchModal;
