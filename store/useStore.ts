
import { create } from 'zustand';
import { EditorState, Block, ViewportMode, PageSettings, BlockType, EditingMode, AppView, DashboardSection, Page } from '../types';
import { savePage } from '../services/supabase';

interface EditorActions {
  setBlocks: (blocks: Block[]) => void;
  addBlock: (type: BlockType, afterId?: string, parentId?: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  duplicateBlock: (id: string) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  setViewport: (mode: ViewportMode) => void;
  toggleSettings: () => void;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  undo: () => void;
  redo: () => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  persistToSupabase: () => Promise<void>;
  setEditingMode: (mode: EditingMode) => void;
  
  // Dashboard Actions
  setView: (view: AppView) => void;
  setDashboardSection: (section: DashboardSection) => void;

  // Page Actions
  addPage: () => void;
  deletePage: (id: string) => void;
  setActivePage: (id: string) => void;
  updatePageTitle: (id: string, title: string) => void;
}

const INITIAL_PAGE_SETTINGS: PageSettings = {
  backgroundColor: '#ffffff',
  maxWidth: 1200,
  fontFamily: 'Inter',
  title: 'Home',
  description: '',
  featuredImage: '',
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
};

const generateId = () => `blk_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

const getDefaultBlockContent = (type: BlockType) => {
  switch (type) {
    case 'text': return { text: '', placeholder: 'Add text here', tag: 'p' };
    case 'heading': return { text: '', placeholder: 'Heading', tag: 'h2' };
    case 'button': return { text: 'Click me', link: '#' };
    case 'header': return { template: 'default' }; 
    case 'footer': return { template: 'default' };
    case 'navigation': return {
      links: [
        { label: 'Home', url: '#' },
        { label: 'About', url: '#' },
        { label: 'Services', url: '#' }
      ],
      hamburger: {
        icon: 'Menu',
        color: '#64748B',
        size: 24,
        drawer: {
          isOpen: false,
          backgroundColor: '#ffffff'
        }
      }
    };
    case 'image': return { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop', alt: 'Tap to edit image' };
    case 'layout': return { columns: 2, childrenIds: [] };
    case 'form': return { title: 'Contact Us', fields: [{ type: 'email', placeholder: 'your@email.com', label: 'Email' }], buttonText: 'Submit' };
    case 'marquee': return { text: 'RADICALLY SIMPLE • MOBILE FIRST • BEAUTIFUL • ', speed: 5, direction: 'left' };
    case 'carousel': return { slides: [{ url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', title: 'Slide 1' }, { url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80', title: 'Slide 2' }] };
    case 'booking': return { 
      heading: 'Schedule a Call',
      subtext: '30 min session',
      buttonText: 'Confirm Reservation',
      serviceId: 'default', 
      icon: 'Calendar'
    };
    case 'ecommerce': return { title: 'Product Name', price: '$99.00', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', buttonText: 'Buy Now' };
    default: return { text: `New ${type} block` };
  }
};

const DEFAULT_HEADER_BLOCKS: Block[] = [
  {
    id: 'header_logo',
    type: 'image',
    content: { url: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', alt: 'Logo' },
    styles: { width: 40, height: 40, padding: { top:0, bottom:0, left:0, right:0 }, margin: { top:0, bottom:0, left:0, right:0 } },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 0
  },
  {
    id: 'header_title',
    type: 'heading',
    content: { text: 'Woovla', tag: 'h1' },
    styles: { fontSize: 20, fontWeight: '900', color: '#FF7575', padding: { top:0, bottom:0, left:0, right:0 }, margin: { top:0, bottom:0, left:0, right:0 } },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 1
  },
  {
    id: 'header_nav',
    type: 'navigation',
    content: getDefaultBlockContent('navigation'),
    styles: { padding: { top:0, bottom:0, left:0, right:0 }, margin: { top:0, bottom:0, left:0, right:0 } },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 2
  }
];

const DEFAULT_FOOTER_BLOCKS: Block[] = [
  {
    id: 'footer_logo',
    type: 'heading',
    content: { text: 'Woovla', tag: 'h3' },
    styles: { fontSize: 24, fontWeight: '900', textAlign: 'center', color: '#FF7575', padding: {top:0,bottom:10,left:0,right:0}, margin: {top:0,bottom:0,left:0,right:0} },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 0
  },
  {
    id: 'footer_text',
    type: 'text',
    content: { text: '© 2024 Woovla Builder. All rights reserved.', tag: 'p' },
    styles: { fontSize: 10, textAlign: 'center', color: '#94a3b8', padding: {top:0,bottom:0,left:0,right:0}, margin: {top:0,bottom:0,left:0,right:0} },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 1
  }
];

const DEFAULT_OFFCANVAS_BLOCKS: Block[] = [
  {
    id: 'offcanvas_title',
    type: 'heading',
    content: { text: 'Menu', tag: 'h2' },
    styles: { fontSize: 24, fontWeight: '900', color: '#1e293b', padding: {top:0,bottom:20,left:0,right:0}, margin: {top:0,bottom:0,left:0,right:0} },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 0
  },
  {
    id: 'offcanvas_link1',
    type: 'text',
    content: { text: 'Home', tag: 'p' },
    styles: { fontSize: 18, fontWeight: '600', color: '#334155', padding: {top:10,bottom:10,left:0,right:0} },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 1
  },
  {
    id: 'offcanvas_link2',
    type: 'text',
    content: { text: 'Features', tag: 'p' },
    styles: { fontSize: 18, fontWeight: '600', color: '#334155', padding: {top:10,bottom:10,left:0,right:0} },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 2
  },
  {
    id: 'offcanvas_cta',
    type: 'button',
    content: { text: 'Get Started', link: '#' },
    styles: { backgroundColor: '#FF7575', color: '#fff', padding: {top:20,bottom:0,left:0,right:0}, margin: {top:20,bottom:0,left:0,right:0} },
    visibility: { mobile: true, tablet: true, desktop: true },
    order: 3
  }
];

// Initial Page Setup
const INITIAL_PAGES: Page[] = [
  {
    id: 'home',
    title: 'Home',
    slug: '/',
    blocks: [], // Empty initially, populated by logic if needed or empty canvas
    lastModified: Date.now()
  }
];

// Mock Data
const MOCK_DASHBOARD_DATA = {
  bookings: [
    { id: '1', customerName: 'Alice Smith', service: 'Consultation', date: '2024-10-24', time: '10:00 AM', status: 'confirmed' as const, price: '$50.00' },
    { id: '2', customerName: 'John Doe', service: 'Haircut', date: '2024-10-25', time: '02:00 PM', status: 'pending' as const, price: '$35.00' },
    { id: '3', customerName: 'Emma Wilson', service: 'Manicure', date: '2024-10-26', time: '11:00 AM', status: 'confirmed' as const, price: '$45.00' },
  ],
  submissions: [
    { id: '1', formName: 'Contact Us', email: 'alice@example.com', date: '2024-10-22', message: 'Hi, do you offer gift cards?', status: 'new' as const },
    { id: '2', formName: 'Feedback', email: 'john@example.com', date: '2024-10-21', message: 'Great service yesterday!', status: 'read' as const },
  ],
  products: [
    { id: '1', name: 'Premium Watch', price: '$299.00', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80', stock: 12, category: 'Accessories', status: 'active' as const },
    { id: '2', name: 'Leather Bag', price: '$149.00', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80', stock: 5, category: 'Accessories', status: 'active' as const },
    { id: '3', name: 'Sunglasses', price: '$89.00', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80', stock: 0, category: 'Accessories', status: 'draft' as const },
  ],
  subscribers: [
    { id: '1', email: 'fan@woovla.com', status: 'subscribed' as const, date: '2024-10-20' },
    { id: '2', email: 'user@gmail.com', status: 'subscribed' as const, date: '2024-10-18' },
    { id: '3', email: 'old@yahoo.com', status: 'unsubscribed' as const, date: '2024-09-12' },
  ]
};

const pushHistory = (state: EditorState, newBlocks: Block[]) => {
  if (state.editingMode !== 'page') return {}; 

  const newHistory = state.history.slice(0, state.historyIndex + 1);
  if (newHistory.length > 50) newHistory.shift();
  
  return {
    history: [...newHistory, newBlocks],
    historyIndex: newHistory.length
  };
};

let saveTimeout: any = null;
const debouncedPersist = (blocks: Block[]) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await savePage('default-project', 'default-page', blocks);
    } catch (e) {
      console.warn('Auto-save failed', e);
    }
  }, 2000);
};

const getActiveListKey = (mode: EditingMode): keyof Pick<EditorState, 'blocks' | 'headerBlocks' | 'footerBlocks' | 'offCanvasBlocks'> => {
  if (mode === 'header') return 'headerBlocks';
  if (mode === 'footer') return 'footerBlocks';
  if (mode === 'offcanvas') return 'offCanvasBlocks';
  return 'blocks';
};

// Helper to sync current blocks to the active page in pages array
const syncBlocksToPage = (state: EditorState, newBlocks: Block[]) => {
  if (state.editingMode !== 'page') return state.pages;
  
  return state.pages.map(p => 
    p.id === state.activePageId ? { ...p, blocks: newBlocks, lastModified: Date.now() } : p
  );
};

export const useStore = create<EditorState & EditorActions>((set, get) => ({
  pages: INITIAL_PAGES,
  activePageId: 'home',
  blocks: [], // Initially empty, or should load active page's blocks
  headerBlocks: DEFAULT_HEADER_BLOCKS,
  footerBlocks: DEFAULT_FOOTER_BLOCKS,
  offCanvasBlocks: DEFAULT_OFFCANVAS_BLOCKS,
  editingMode: 'page',
  view: 'canvas',
  dashboardSection: 'overview',
  dashboardData: MOCK_DASHBOARD_DATA,
  
  selectedBlockId: null,
  viewport: 'mobile',
  isSettingsOpen: false,
  pageSettings: INITIAL_PAGE_SETTINGS,
  history: [[]],
  historyIndex: 0,

  // --- Page Management Actions ---

  addPage: () => set((state) => {
    const newId = `page_${Date.now()}`;
    const newPage: Page = {
      id: newId,
      title: 'New Page',
      slug: `/new-page-${state.pages.length}`,
      blocks: [],
      lastModified: Date.now()
    };
    
    // Switch to new page immediately?
    const updatedPages = [...state.pages, newPage];
    
    return {
      pages: updatedPages,
      activePageId: newId,
      blocks: [], // New page starts empty
      history: [[]],
      historyIndex: 0,
      selectedBlockId: null
    };
  }),

  deletePage: (id) => set((state) => {
    if (state.pages.length <= 1) return state; // Prevent deleting last page
    
    const newPages = state.pages.filter(p => p.id !== id);
    // If we deleted the active page, switch to the first one
    let newActiveId = state.activePageId;
    let newBlocks = state.blocks;
    
    if (id === state.activePageId) {
      newActiveId = newPages[0].id;
      newBlocks = newPages[0].blocks;
    }

    return {
      pages: newPages,
      activePageId: newActiveId,
      blocks: newBlocks,
      selectedBlockId: null
    };
  }),

  setActivePage: (id) => set((state) => {
    // Save current blocks to current page before switching
    const savedPages = syncBlocksToPage(state, state.blocks);
    
    const targetPage = savedPages.find(p => p.id === id);
    if (!targetPage) return { pages: savedPages };

    // When switching pages, we should likely update the pageSettings to match that page if we had a full backend
    // For now, we'll just update the title in the settings to match the page name
    const newPageSettings = { ...state.pageSettings, title: targetPage.title };

    return {
      pages: savedPages,
      activePageId: id,
      blocks: targetPage.blocks,
      pageSettings: newPageSettings,
      history: [targetPage.blocks], // Reset history for new page session
      historyIndex: 0,
      selectedBlockId: null,
      editingMode: 'page' // Reset to page mode
    };
  }),

  updatePageTitle: (id, title) => set((state) => {
    const newPages = state.pages.map(p => 
      p.id === id ? { ...p, title } : p
    );
    
    // If editing current page, also update settings
    const newSettings = id === state.activePageId ? { ...state.pageSettings, title } : state.pageSettings;
    
    return { pages: newPages, pageSettings: newSettings };
  }),


  // --- Block Actions ---

  setBlocks: (blocks) => set((state) => {
    const updatedPages = syncBlocksToPage(state, blocks);
    return { blocks, pages: updatedPages, ...pushHistory(state, blocks) };
  }),

  setEditingMode: (mode) => set({ editingMode: mode, selectedBlockId: null }),
  setView: (view) => set({ view, selectedBlockId: null, isSettingsOpen: false }),
  setDashboardSection: (section) => set({ dashboardSection: section }),

  addBlock: (type, afterId, parentId) => {
    set((state) => {
      const listKey = getActiveListKey(state.editingMode);
      const currentList = state[listKey];

      const newBlock: Block = {
        id: generateId(),
        type,
        content: getDefaultBlockContent(type),
        styles: { 
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          textAlign: type === 'button' || type === 'heading' ? 'center' : 'left',
          color: (type === 'text' || type === 'heading' || type === 'booking' || type === 'form' || type === 'ecommerce') ? '#1e293b' : undefined,
          accentColor: (type === 'booking' || type === 'form' || type === 'ecommerce' || type === 'carousel') ? '#FF7575' : undefined,
          mutedColor: (type === 'booking' || type === 'form' || type === 'ecommerce') ? '#94a3b8' : undefined,
          backgroundColor: (type === 'booking' || type === 'ecommerce') ? '#ffffff' : (type === 'form' ? 'transparent' : undefined),
          sectionColor: (type === 'booking' || type === 'form') ? '#F8FAFC' : undefined,
          fontWeight: type === 'heading' ? '700' : '400',
          fontSize: type === 'heading' ? 32 : 16,
          cornerRadii: (type === 'booking' || type === 'ecommerce') ? { topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 } : { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 }
        },
        visibility: { mobile: true, tablet: true, desktop: true },
        parentId,
        order: currentList.length
      };
      
      let newBlocks = [...currentList];
      if (afterId) {
        const idx = newBlocks.findIndex(b => b.id === afterId);
        newBlocks.splice(idx + 1, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      
      const updated = newBlocks.map((b, i) => ({ ...b, order: i }));
      const changes: Partial<EditorState> = { [listKey]: updated, selectedBlockId: newBlock.id };
      
      // If editing main page blocks, sync to pages array
      if (state.editingMode === 'page') {
        const updatedPages = syncBlocksToPage(state, updated);
        changes.pages = updatedPages;
        debouncedPersist(updated);
        Object.assign(changes, pushHistory(state, updated));
      }

      return changes;
    });
  },

  updateBlock: (id, updates) => {
    set((state) => {
      const listKey = getActiveListKey(state.editingMode);
      const currentList = state[listKey];
      
      const newBlocks = currentList.map((b) => (b.id === id ? { ...b, ...updates } : b));
      
      const changes: Partial<EditorState> = { [listKey]: newBlocks };
      
      if (state.editingMode === 'page') {
        const updatedPages = syncBlocksToPage(state, newBlocks);
        changes.pages = updatedPages;
        debouncedPersist(newBlocks);
      }
      
      return changes;
    });
  },

  duplicateBlock: (id) => {
    set((state) => {
      const listKey = getActiveListKey(state.editingMode);
      const currentList = state[listKey];
      
      const original = currentList.find(b => b.id === id);
      if (!original) return state;
      
      const copy = JSON.parse(JSON.stringify(original));
      copy.id = generateId();
      const idx = currentList.findIndex(b => b.id === id);
      const newBlocks = [...currentList];
      newBlocks.splice(idx + 1, 0, copy);
      const updated = newBlocks.map((b, i) => ({ ...b, order: i }));
      
      const changes: Partial<EditorState> = { [listKey]: updated, selectedBlockId: copy.id };
      if (state.editingMode === 'page') {
        const updatedPages = syncBlocksToPage(state, updated);
        changes.pages = updatedPages;
        debouncedPersist(updated);
        Object.assign(changes, pushHistory(state, updated));
      }
      return changes;
    });
  },

  deleteBlock: (id) => {
    set((state) => {
      const listKey = getActiveListKey(state.editingMode);
      const currentList = state[listKey];
      
      const newBlocks = currentList.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i }));
      
      const changes: Partial<EditorState> = { [listKey]: newBlocks, selectedBlockId: null };
      if (state.editingMode === 'page') {
        const updatedPages = syncBlocksToPage(state, newBlocks);
        changes.pages = updatedPages;
        debouncedPersist(newBlocks);
        Object.assign(changes, pushHistory(state, newBlocks));
      }
      return changes;
    });
  },

  selectBlock: (id) => {
    set({ selectedBlockId: id, isSettingsOpen: false });
  },

  setViewport: (viewport) => set({ viewport }),
  toggleSettings: () => set(state => ({ isSettingsOpen: !state.isSettingsOpen, selectedBlockId: null })),
  updatePageSettings: (pageSettings) => {
    set((state) => {
      // If we update the title in settings, we should also update the page in the list
      let extraUpdates = {};
      if (pageSettings.title) {
         const newPages = state.pages.map(p => 
          p.id === state.activePageId ? { ...p, title: pageSettings.title! } : p
        );
        extraUpdates = { pages: newPages };
      }

      const newSettings = { ...state.pageSettings, ...pageSettings };
      return { pageSettings: newSettings, ...extraUpdates };
    });
  },

  undo: () => set((state) => {
    if (state.editingMode !== 'page') return state;
    if (state.historyIndex > 0) {
      const prevIndex = state.historyIndex - 1;
      const prevBlocks = state.history[prevIndex];
      const updatedPages = syncBlocksToPage(state, prevBlocks);
      debouncedPersist(prevBlocks);
      return { blocks: prevBlocks, pages: updatedPages, historyIndex: prevIndex, selectedBlockId: null };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.editingMode !== 'page') return state;
    if (state.historyIndex < state.history.length - 1) {
      const nextIndex = state.historyIndex + 1;
      const nextBlocks = state.history[nextIndex];
      const updatedPages = syncBlocksToPage(state, nextBlocks);
      debouncedPersist(nextBlocks);
      return { blocks: nextBlocks, pages: updatedPages, historyIndex: nextIndex, selectedBlockId: null };
    }
    return state;
  }),

  reorderBlocks: (fromIndex, toIndex) => set((state) => {
    const listKey = getActiveListKey(state.editingMode);
    const currentList = state[listKey];

    const newBlocks = [...currentList];
    const [removed] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, removed);
    const updatedBlocks = newBlocks.map((b, i) => ({ ...b, order: i }));
    
    const changes: Partial<EditorState> = { [listKey]: updatedBlocks };
    if (state.editingMode === 'page') {
      const updatedPages = syncBlocksToPage(state, updatedBlocks);
      changes.pages = updatedPages;
      debouncedPersist(updatedBlocks);
      Object.assign(changes, pushHistory(state, updatedBlocks));
    }
    return changes;
  }),

  persistToSupabase: async () => {
    const { blocks } = get();
    try {
      await savePage('default-project', 'default-page', blocks);
    } catch (e) {
      console.warn('Persist failed', e);
    }
  }
}));
