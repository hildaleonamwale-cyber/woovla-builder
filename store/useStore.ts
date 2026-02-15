
import { create } from 'zustand';
import { 
  Profile, AppState, Highlight, StorySlide, Badge, LinkedProfile, 
  Block, ViewportMode, DashboardSection, PageSettings, Page, 
  Service, Product, EventEntity, Property, FormEntity, Payout, PopupSettings
} from '../types';

interface Actions {
  setHasCompletedOnboarding: (val: boolean) => void;
  setView: (view: AppState['view']) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  setStoryIndex: (index: number | null) => void;
  setHighlightId: (id: string | null) => void;
  setEditingHighlightId: (id: string | null) => void;
  updateHighlight: (id: string, updates: Partial<Highlight>) => void;
  addHighlight: (highlight: Highlight) => void;
  removeHighlight: (id: string) => void;
  addStory: (slide: StorySlide) => void;
  removeStory: (id: string) => void;
  
  // Builder Actions
  setViewport: (mode: ViewportMode) => void;
  selectBlock: (id: string | null) => void;
  setEditingMode: (mode: AppState['editingMode']) => void;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  toggleSettings: () => void;
  setAddMenuOpen: (isOpen: boolean, parentId?: string | null) => void;
  
  // Content Actions
  addBlock: (type: Block['type'], afterId?: string, parentId?: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks: (from: number, to: number) => void;
  
  // Dashboard Entity Actions
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addEvent: (event: EventEntity) => void;
  updateEvent: (id: string, updates: Partial<EventEntity>) => void;
  deleteEvent: (id: string) => void;

  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  addForm: (form: FormEntity) => void;
  updateForm: (id: string, updates: Partial<FormEntity>) => void;
  deleteForm: (id: string) => void;

  // History & Pages
  undo: () => void;
  redo: () => void;
  setActivePage: (id: string) => void;
  addPage: () => void;
  deletePage: (id: string) => void;
  updatePageTitle: (id: string, title: string) => void;
  
  // Dashboard
  setDashboardSection: (section: DashboardSection) => void;
  
  // Persistence
  persistToSupabase: () => Promise<void>;
  
  // Popup
  setPopupEditorOpen: (isOpen: boolean) => void;
  updatePopup: (settings: Partial<PopupSettings>) => void;
}

const INITIAL_SERVICES: Service[] = [
    {
        id: 's1',
        title: 'Strategy Session',
        duration: 45,
        price: '$150',
        description: 'Deep dive into your brand strategy.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
        availability: {
            days: [1, 2, 3, 4, 5], // Mon-Fri
            startTime: '09:00',
            endTime: '17:00'
        }
    },
    {
        id: 's2',
        title: 'Quick Consultation',
        duration: 15,
        price: 'Free',
        description: 'Initial discovery call.',
        image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1000&auto=format&fit=crop',
        availability: {
            days: [2, 4], // Tue, Thu
            startTime: '13:00',
            endTime: '16:00'
        }
    }
];

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'prod1',
        title: 'Digital Presets Pack',
        price: '$49',
        description: 'The complete editorial collection for Lightroom.',
        images: ['https://images.unsplash.com/photo-1542038782534-36757130edd0?q=80&w=1000&auto=format&fit=crop'],
        features: ['Lightroom Mobile', '15 Presets', 'User Guide', 'Instant Download'],
        buttonText: 'Buy Now'
    },
    {
        id: 'prod2',
        title: 'Brand Kit Template',
        price: '$29',
        description: 'Canva templates for social media.',
        images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'],
        features: ['Canva Ready', '30 Templates', 'Fonts Included'],
        buttonText: 'Get Template'
    }
];

const INITIAL_EVENTS: EventEntity[] = [
    {
        id: 'evt1',
        title: 'Creator Summit 2024',
        date: 'Oct 24, 2024',
        time: '6:00 PM',
        location: 'Soho House, NYC',
        description: 'Join us for an exclusive evening of networking and insights.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
        features: ['Networking', 'Keynote', 'Drinks'],
        buttonText: 'RSVP Now'
    }
];

const INITIAL_PROPERTIES: Property[] = [
    {
        id: 'prop1',
        title: 'Modern Townhouse',
        price: '$850,000',
        location: 'Avondale Heights',
        beds: 3,
        baths: 2,
        description: 'A stunning modern home with garden and garage.',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop'],
        features: ['Garden', 'Garage', 'Renovated'],
        buttonText: 'Schedule Viewing'
    }
];

const INITIAL_FORMS: FormEntity[] = [
    {
        id: 'form1',
        title: 'Custom Cake Order',
        fields: [
            { id: 'f1', label: 'Preferred Flavor', type: 'text', placeholder: 'e.g. Vanilla Bean, Red Velvet' },
            { id: 'f2', label: 'Size (Tiers)', type: 'select', options: ['One Tier (6")', 'Two Tiers (6" + 8")', 'Three Tiers (6" + 8" + 10")', 'Sheet Cake'] },
            { id: 'f3', label: 'Event Date', type: 'date', placeholder: '' },
            { id: 'f4', label: 'Design Requests', type: 'textarea', placeholder: 'Describe theme, colors, or special instructions...' }
        ],
        buttonText: 'Request Quote',
        confirmationMessage: 'Thanks! We will send a quote shortly.'
    }
];

const INITIAL_PAYOUTS: Payout[] = [
    { id: 'pay1', amount: '$4,250.00', status: 'paid', date: 'Oct 24, 2024', method: 'Bank Transfer •••• 4242' },
    { id: 'pay2', amount: '$1,850.00', status: 'paid', date: 'Oct 10, 2024', method: 'Bank Transfer •••• 4242' },
    { id: 'pay3', amount: '$320.00', status: 'processing', date: 'Oct 25, 2024', method: 'Bank Transfer •••• 4242' },
];

const INITIAL_PROFILE: Profile = {
  id: 'user_1',
  name: 'Woovla Official',
  handle: 'woovla_hq',
  bio: 'The mobile-first visual builder for creators. Swipe to explore our ecosystem.',
  banner: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
  badges: [
    { id: '1', label: 'Verified' },
    { id: '2', label: 'Pro' }
  ],
  links: [
    { id: '1', platform: 'instagram', url: '#' },
    { id: '2', platform: 'website', url: '#' },
    { id: '3', platform: 'twitter', url: '#' }
  ],
  stories: [
    { id: 's1', type: 'image', content: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=1000&auto=format&fit=crop', title: 'Welcome' },
  ],
  highlights: [
      // 1. PRODUCT - Default Variant
      {
          id: 'h_product',
          type: 'product',
          title: 'Signature Ceramics',
          subtitle: 'Hand-thrown porcelain vases.',
          image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=500&auto=format&fit=crop',
          price: '$85',
          isFeatured: true,
          buttonText: 'Shop Collection',
          styles: { 
            variant: 'default',
            backgroundColor: '#ffffff', 
            showTags: true, 
            buttonColor: '#A8683E',
            accentColor: '#A8683E',
            showAccent: true
          },
          modalData: { 
            tagline: 'Ceramic Art',
            features: ['Handmade', 'Limited Edition', 'Vase'], 
            slides: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=500&auto=format&fit=crop'] 
          }
      },
      // 2. SERVICE - Minimal Variant
      {
          id: 'h_service',
          type: 'service',
          title: 'Brand Audit',
          subtitle: '1-on-1 strategy session.',
          image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=500&auto=format&fit=crop',
          price: '$250',
          isFeatured: false,
          buttonText: 'Book Session',
          styles: { 
            variant: 'minimal',
            backgroundColor: '#F8FAFC', 
            showTags: true, 
            buttonColor: '#1e293b',
            accentColor: '#1e293b',
            showAccent: false
          },
          modalData: { 
            tagline: 'Consultancy',
            features: ['60 Mins', 'Video Call', 'Strategy'],
            serviceId: 's1'
          }
      },
      // 3. EVENT - Bold Variant
      {
          id: 'h_event',
          type: 'event',
          title: 'Design Summit',
          subtitle: 'Join us in NYC this October.',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500&auto=format&fit=crop',
          isFeatured: false,
          buttonText: 'Get Tickets',
          styles: { 
            variant: 'bold',
            backgroundColor: '#FF7575', 
            textColor: '#ffffff',
            showTags: true, 
            buttonColor: '#000000',
            accentColor: '#ffffff',
            tagBackgroundColor: 'rgba(255,255,255,0.2)',
            tagTextColor: '#ffffff'
          },
          modalData: { 
            tagline: 'Live Event',
            date: 'Oct 24', 
            time: '10:00 AM', 
            location: 'Soho House',
            features: ['Networking', 'Workshop', 'NYC']
          }
      },
      // 4. PROPERTY - Default Variant with Custom Accent
      {
          id: 'h_property',
          type: 'property',
          title: 'The Glass House',
          subtitle: 'Modern living in the hills.',
          image: 'https://images.unsplash.com/photo-1600596542815-2a4f9f4ad6c6?q=80&w=500&auto=format&fit=crop',
          price: '$1.2M',
          isFeatured: true,
          buttonText: 'View Listing',
          styles: { 
            variant: 'default',
            backgroundColor: '#ffffff', 
            showTags: true, 
            buttonColor: '#10b981',
            accentColor: '#10b981',
            showAccent: true
          },
          modalData: { 
            tagline: 'Real Estate',
            features: ['3 Bed', '2 Bath', 'Pool'],
            propertyId: 'prop1'
          }
      },
      // 5. MEDIA - Minimal Dark
      {
          id: 'h_media',
          type: 'media',
          title: '2024 Showreel',
          subtitle: 'Highlights from our recent work.',
          image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=500&auto=format&fit=crop',
          isFeatured: false,
          buttonText: 'Watch Video',
          styles: { 
            variant: 'minimal',
            backgroundColor: '#0f172a', 
            textColor: '#ffffff',
            showTags: true, 
            buttonColor: '#ffffff',
            buttonTextColor: '#000000',
            accentColor: '#ffffff',
            tagBackgroundColor: '#1e293b',
            tagTextColor: '#94a3b8'
          },
          modalData: { 
            tagline: 'Film',
            contentType: 'video',
            features: ['4K Video', 'Portfolio', 'Cinematic'],
            styles: {
                buttonColor: '#000000',
                buttonTextColor: '#ffffff'
            }
          }
      },
      // 6. FORM - Default
      {
          id: 'h_form',
          type: 'form',
          title: 'Cake Inquiry',
          subtitle: 'Custom cake orders for events.',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop',
          isFeatured: false,
          buttonText: 'Get Quote',
          styles: { 
            variant: 'default',
            backgroundColor: '#ffffff', 
            showTags: true, 
            buttonColor: '#6366f1',
            accentColor: '#6366f1',
            showAccent: true
          },
          modalData: { 
            tagline: 'Orders',
            features: ['Custom', 'Weddings', 'Birthdays'],
            formId: 'form1'
          }
      }
  ],
  popup: {
    isEnabled: false,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '#',
    style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        buttonColor: '#000000',
        buttonTextColor: '#ffffff',
        cornerRadius: 'large'
    }
  }
};

const INITIAL_PAGE_SETTINGS: PageSettings = {
  title: 'Home',
  backgroundColor: '#FFFFFF',
  fontFamily: 'Inter',
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  backgroundPattern: 'polka'
};

export const useStore = create<AppState & Actions>((set, get) => ({
  // Initial State
  hasCompletedOnboarding: false, // Set to false to trigger onboarding
  view: 'public',
  profile: INITIAL_PROFILE,
  
  // Entities
  services: INITIAL_SERVICES,
  products: INITIAL_PRODUCTS,
  events: INITIAL_EVENTS,
  properties: INITIAL_PROPERTIES,
  forms: INITIAL_FORMS,
  payouts: INITIAL_PAYOUTS,

  activeStoryIndex: null,
  activeHighlightId: null,
  editingHighlightId: null,
  
  viewport: 'mobile',
  blocks: [],
  headerBlocks: [],
  footerBlocks: [],
  offCanvasBlocks: [],
  selectedBlockId: null,
  editingMode: 'page',
  pageSettings: INITIAL_PAGE_SETTINGS,
  isSettingsOpen: false,
  
  history: [[]],
  historyIndex: 0,
  pages: [{ id: 'p1', title: 'Home', slug: 'home' }],
  activePageId: 'p1',
  
  dashboardSection: 'overview',
  dashboardData: { bookings: [], submissions: [], subscribers: [] },
  
  isAddMenuOpen: false,
  addMenuParentId: null,
  
  isPopupEditorOpen: false,

  // Actions
  setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
  setView: (view) => set({ view }),
  updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),
  setStoryIndex: (index) => set({ activeStoryIndex: index }),
  setHighlightId: (id) => set({ activeHighlightId: id }),
  setEditingHighlightId: (id) => set({ editingHighlightId: id }),
  
  updateHighlight: (id, updates) => set((state) => ({
    profile: {
      ...state.profile,
      highlights: state.profile.highlights.map(h => h.id === id ? { ...h, ...updates, styles: { ...h.styles, ...updates.styles } } : h)
    }
  })),

  addHighlight: (highlight) => set((state) => ({ profile: { ...state.profile, highlights: [...state.profile.highlights, highlight] } })),
  removeHighlight: (id) => set((state) => ({ profile: { ...state.profile, highlights: state.profile.highlights.filter(h => h.id !== id) } })),
  addStory: (slide) => set((state) => ({ profile: { ...state.profile, stories: [...state.profile.stories, slide] } })),
  removeStory: (id) => set((state) => ({ profile: { ...state.profile, stories: state.profile.stories.filter(s => s.id !== id) } })),

  setViewport: (viewport) => set({ viewport }),
  selectBlock: (selectedBlockId) => set({ selectedBlockId }),
  setEditingMode: (editingMode) => set({ editingMode, selectedBlockId: null }),
  updatePageSettings: (updates) => set((state) => ({ pageSettings: { ...state.pageSettings, ...updates } })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setAddMenuOpen: (isAddMenuOpen, addMenuParentId = null) => set({ isAddMenuOpen, addMenuParentId }),

  addBlock: (type, afterId, parentId) => {},
  updateBlock: (id, updates) => {},
  deleteBlock: (id) => {},
  duplicateBlock: (id) => {},
  reorderBlocks: (from: number, to: number) => {},

  // Entity CRUD Actions
  addService: (service) => set((state) => ({ services: [...state.services, service] })),
  updateService: (id, updates) => set((state) => ({ services: state.services.map(s => s.id === id ? { ...s, ...updates } : s) })),
  deleteService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),

  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updates) => set((state) => ({ products: state.products.map(p => p.id === id ? { ...p, ...updates } : p) })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) => set((state) => ({ events: state.events.map(e => e.id === id ? { ...e, ...updates } : e) })),
  deleteEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),

  addProperty: (property) => set((state) => ({ properties: [...state.properties, property] })),
  updateProperty: (id, updates) => set((state) => ({ properties: state.properties.map(p => p.id === id ? { ...p, ...updates } : p) })),
  deleteProperty: (id) => set((state) => ({ properties: state.properties.filter(p => p.id !== id) })),

  addForm: (form) => set((state) => ({ forms: [...state.forms, form] })),
  updateForm: (id, updates) => set((state) => ({ forms: state.forms.map(f => f.id === id ? { ...f, ...updates } : f) })),
  deleteForm: (id) => set((state) => ({ forms: state.forms.filter(f => f.id !== id) })),

  undo: () => {},
  redo: () => {},
  setActivePage: (id) => set({ activePageId: id }),
  addPage: () => {},
  deletePage: (id) => {},
  updatePageTitle: (id, title) => {},

  setDashboardSection: (dashboardSection) => set({ dashboardSection }),

  persistToSupabase: async () => {},
  
  setPopupEditorOpen: (isOpen) => set({ isPopupEditorOpen: isOpen }),
  updatePopup: (settings) => set((state) => ({ 
      profile: { 
          ...state.profile, 
          popup: { ...state.profile.popup!, ...settings } 
      } 
  })),
}));