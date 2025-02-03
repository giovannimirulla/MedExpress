import {create} from "zustand";

// Define the store state and actions types
interface DialogState {
    dialogOpened: boolean;
    openDialog: () => void;
    closeDialog: () => void;
    toggleDialog: () => void;
  }
  
  // Create the Zustand store
  export const useDialogStore = create<DialogState>((set) => ({
    dialogOpened: false,
    openDialog: () => set({ dialogOpened: true }),
    closeDialog: () => set({ dialogOpened: false }),
    toggleDialog: () => set((state) => ({ dialogOpened: !state.dialogOpened })),
  }));