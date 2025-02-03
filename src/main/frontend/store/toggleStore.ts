import { create } from 'zustand'


interface BearState {
  theme: string
  onToggle: () => void
}

const useToggleStore = create<BearState>((set) => ({

    theme: 'dark',
    onToggle: () =>
      set((state) =>
        { 
            document.documentElement.setAttribute('theme', state.theme);
          return ({
        theme: state.theme === 'dark' ? 'light' : 'dark',
        
      }
    
    )   }
    
    ),

  }));
  
export default useToggleStore;