
export type HighlightType = 'product' | 'service' | 'event' | 'form' | 'media' | 'property';

export interface Badge {
  id: string;
  label: string;
}

export interface LinkedProfile {
  id: string;
  platform: 'instagram' | 'whatsapp' | 'maps' | 'website' | 'linkedin' | 'twitter' | 'crunchbase' | 'trustpilot';
  url: string;
}

export interface StorySlide {
  id: string;
  type: 'image' | 'text' | 'video' | 'review';
  content: string; // URL or Text
  title?: string;
}

export interface HighlightStyles {
  backgroundColor?: string; // Solid color or Gradient Start
  gradientColor?: string; // Gradient End
  backgroundBlur?: number; // Blur amount in px
  
  rotation?: number;
  showImage?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showTags?: boolean;
  showPrice?: boolean;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  
  // New Customization Options
  variant?: 'default' | 'minimal' | 'bold'; // The card layout type
  accentColor?: string; // Controls the decorative elements (corner wash, svg lines)
  showAccent?: boolean; // Toggle for the decorative elements
  tagBackgroundColor?: string;
  tagTextColor?: string;

  // Background System
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;
}

export interface HighlightModalStyles {
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    featurePillColor?: string;
    featureTextColor?: string;
}

export interface PopupSettings {
    isEnabled: boolean;
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    style: {
        backgroundColor: string;
        textColor: string;
        buttonColor: string;
        buttonTextColor: string;
        cornerRadius: 'none' | 'small' | 'large';
    };
}

// --- DASHBOARD ENTITIES ---

export interface ServiceAvailability {
    days: number[]; // 0 = Sunday, 1 = Monday, etc.
    startTime: string; // "09:00" 24h format
    endTime: string; // "17:00" 24h format
}

export interface Service {
    id: string;
    title: string;
    duration: number; // in minutes
    price: string;
    description?: string;
    image?: string; // Image associated with the service
    availability: ServiceAvailability;
}

export interface Product {
    id: string;
    title: string;
    price: string;
    description: string;
    images: string[];
    features?: string[];
    buttonText?: string;
}

export interface EventEntity {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    features?: string[];
    buttonText?: string;
}

export interface Property {
    id: string;
    title: string;
    price: string;
    location: string;
    beds: number;
    baths: number;
    description: string;
    images: string[];
    features?: string[];
    buttonText?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'date' | 'select' | 'number';
  placeholder?: string;
  options?: string[]; // For select inputs
  required?: boolean;
}

export interface FormEntity {
    id: string;
    title: string;
    fields: FormField[];
    buttonText: string;
    confirmationMessage?: string;
}

export interface Payout {
    id: string;
    amount: string;
    status: 'pending' | 'paid' | 'processing';
    date: string;
    method: string;
}

// ---------------------------

export interface HighlightModalData {
    tagline?: string;
    description?: string; // New: Longer description for modal
    slides?: string[];
    
    // Linking Fields (Native Flow)
    productId?: string;
    serviceId?: string;
    eventId?: string;
    propertyId?: string;
    formId?: string;

    // Product Fields
    features?: string[]; // Used as bullets for products
    platform?: string; // e.g. "Shopify", "Mindbody"
    redirectUrl?: string;
    useExternalLink?: boolean; // Toggle for Native vs External
    
    // Service Fields (New Architecture)
    duration?: string; // Legacy fallback
    bookingSlots?: string[]; // Legacy fallback
    
    // Event Fields
    date?: string;
    time?: string;
    location?: string;
    
    // Form Fields
    formFields?: FormField[];
    confirmationMessage?: string;

    // Media Fields
    embedUrl?: string;
    contentType?: 'video' | 'gallery' | 'link';

    // Shared
    buttonText?: string;
    showPrice?: boolean;
    styles?: HighlightModalStyles;
}

export interface Highlight {
  id: string;
  type: HighlightType;
  title: string;
  subtitle: string;
  image: string;
  isFeatured: boolean;
  price?: string;
  externalLink?: string;
  buttonText?: string; // For the card button
  styles?: HighlightStyles;
  modalData?: HighlightModalData;
}

export interface Profile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  banner: string;
  avatar: string;
  badges: Badge[];
  links: LinkedProfile[];
  stories: StorySlide[];
  pinnedMessage?: {
    title: string;
    description: string;
    buttonLabel: string;
    url: string;
  };
  highlights: Highlight[];
  popup?: PopupSettings;
}

/**
 * Viewport modes for responsive design
 */
export type ViewportMode = 'mobile' | 'tablet' | 'desktop';

/**
 * Dashboard navigation sections
 */
export type DashboardSection = 'overview' | 'bookings' | 'events' | 'forms' | 'newsletter' | 'store' | 'properties' | 'cards';

/**
 * Visual styles for a block
 */
export interface BlockStyles {
  margin?: { top?: number; bottom?: number; left?: number; right?: number };
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  cornerRadii?: { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number };
  width?: string;
  height?: string;
  aspectRatio?: string;
  objectFit?: string;
  shadow?: string;
  gap?: number;
  sticky?: boolean;
  borderBottom?: boolean;
  accentColor?: string;
  sectionColor?: string;
  mutedColor?: string;
  cardBackgroundStart?: string;
  cardBackgroundEnd?: string;
  // Overrides for different viewports
  tablet?: Partial<BlockStyles>;
  desktop?: Partial<BlockStyles>;
  [key: string]: any;
}

/**
 * Represents a content block in the builder
 */
export interface Block {
  id: string;
  type: 'text' | 'heading' | 'button' | 'header' | 'image' | 'layout' | 'footer' | 'carousel' | 'form' | 'booking' | 'ecommerce' | 'navigation' | 'cover' | 'slot';
  parentId?: string;
  order: number;
  content: any;
  styles: BlockStyles;
  visibility?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
}

/**
 * Page settings for global look and feel
 */
export interface PageSettings {
  title: string;
  description?: string;
  featuredImage?: string;
  backgroundColor: string;
  fontFamily: string;
  padding?: { top: number; right: number; bottom: number; left: number };
  backgroundPattern?: 'none' | 'polka' | 'stars' | 'grid' | 'waves';
}

/**
 * Simple Page model
 */
export interface Page {
  id: string;
  title: string;
  slug?: string;
}

/**
 * Complete Application State
 */
export interface AppState {
  hasCompletedOnboarding: boolean;
  view: 'public' | 'admin' | 'canvas' | 'dashboard' | 'preview';
  profile: Profile;
  activeStoryIndex: number | null;
  activeHighlightId: string | null;
  editingHighlightId: string | null;
  
  // Data State
  services: Service[];
  products: Product[];
  events: EventEntity[];
  properties: Property[];
  forms: FormEntity[];
  payouts: Payout[];
  
  // Builder State
  viewport: ViewportMode;
  blocks: Block[];
  headerBlocks: Block[];
  footerBlocks: Block[];
  offCanvasBlocks: Block[];
  selectedBlockId: string | null;
  editingMode: 'page' | 'header' | 'footer' | 'offcanvas';
  pageSettings: PageSettings;
  isSettingsOpen: boolean;
  
  // History
  history: Block[][];
  historyIndex: number;
  pages: Page[];
  activePageId: string;
  
  // Dashboard
  dashboardSection: DashboardSection;
  dashboardData: any;
  
  // Add Menu
  isAddMenuOpen: boolean;
  addMenuParentId: string | null;
  
  isPopupEditorOpen: boolean;
}