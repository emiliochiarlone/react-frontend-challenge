import { create } from 'zustand'

interface UIState {
  searchQuery: string
  isQuickViewOpen: boolean
  quickViewProductId: number | null
  isMobileMenuOpen: boolean
  setSearchQuery: (query: string) => void
  openQuickView: (productId: number) => void
  closeQuickView: () => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  searchQuery: '',
  isQuickViewOpen: false,
  quickViewProductId: null,
  isMobileMenuOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  openQuickView: (productId) => set({ isQuickViewOpen: true, quickViewProductId: productId }),

  closeQuickView: () => set({ isQuickViewOpen: false, quickViewProductId: null }),

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}))
