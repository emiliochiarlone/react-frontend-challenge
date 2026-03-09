import { useUIStore } from '../uiStore'

function resetStore() {
  useUIStore.setState({
    searchQuery: '',
    isQuickViewOpen: false,
    quickViewProductId: null,
    isMobileMenuOpen: false,
  })
}

describe('uiStore', () => {
  beforeEach(resetStore)

  it('starts with default values', () => {
    const state = useUIStore.getState()
    expect(state.searchQuery).toBe('')
    expect(state.isQuickViewOpen).toBe(false)
    expect(state.quickViewProductId).toBeNull()
    expect(state.isMobileMenuOpen).toBe(false)
  })

  it('sets search query', () => {
    useUIStore.getState().setSearchQuery('laptop')
    expect(useUIStore.getState().searchQuery).toBe('laptop')
  })

  it('opens quick view with product id', () => {
    useUIStore.getState().openQuickView(42)
    const state = useUIStore.getState()
    expect(state.isQuickViewOpen).toBe(true)
    expect(state.quickViewProductId).toBe(42)
  })

  it('closes quick view and resets product id', () => {
    useUIStore.getState().openQuickView(42)
    useUIStore.getState().closeQuickView()
    const state = useUIStore.getState()
    expect(state.isQuickViewOpen).toBe(false)
    expect(state.quickViewProductId).toBeNull()
  })

  it('toggles mobile menu', () => {
    useUIStore.getState().toggleMobileMenu()
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true)
    useUIStore.getState().toggleMobileMenu()
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false)
  })

  it('closes mobile menu', () => {
    useUIStore.getState().toggleMobileMenu()
    useUIStore.getState().closeMobileMenu()
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false)
  })
})
