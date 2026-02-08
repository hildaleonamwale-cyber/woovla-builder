
export type BlockType = 'text' | 'heading' | 'button' | 'image' | 'layout' | 'form' | 'marquee' | 'header' | 'footer' | 'carousel' | 'booking' | 'ecommerce' | 'navigation';

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BorderRadius {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface VisibilitySettings {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}

export interface BlockStyles {
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string; // Primary Text
  backgroundColor?: string;
  accentColor?: string; // New: For buttons, active states
  mutedColor?: string; // New: For secondary text
  sectionColor?: string; // New: For inner containers like calendar/slots
  borderRadius?: number; // Legacy support
  cornerRadii?: BorderRadius; // New granular support
  padding?: Spacing;
  margin?: Spacing;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animation?: string;
  opacity?: number;
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  gap?: number;
  columns?: number;
  sticky?: boolean;
  hideOnScroll?: boolean;
  borderBottom?: boolean;
  maxWidthContainer?: boolean;
  // Breakpoint overrides
  tablet?: Partial<BlockStyles>;
  desktop?: Partial<BlockStyles>;
}

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  styles: BlockStyles;
  visibility: VisibilitySettings;
  parentId?: string;
  order: number;
}

export interface PageSettings {
  backgroundColor: string;
  maxWidth: number;
  fontFamily: string;
  title: string;
  description: string;
  featuredImage?: string;
  padding?: Spacing;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  lastModified: number;
}

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';
export type EditingMode = 'page' | 'header' | 'footer' | 'offcanvas';
export type AppView = 'canvas' | 'dashboard';
export type DashboardSection = 'overview' | 'bookings' | 'forms' | 'newsletter' | 'store' | 'cards';

// Dashboard Data Types
export interface BookingItem {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: string;
}

export interface FormSubmission {
  id: string;
  formName: string;
  email: string;
  date: string;
  message: string;
  status: 'new' | 'read';
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  stock: number;
  category: string;
  status: 'active' | 'draft';
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed';
  date: string;
}

export interface EditorState {
  pages: Page[]; // List of all pages
  activePageId: string; // Currently edited page
  blocks: Block[];        // Main page blocks (linked to activePage)
  headerBlocks: Block[];  // Header template blocks
  footerBlocks: Block[];  // Footer template blocks
  offCanvasBlocks: Block[]; // Off-canvas menu blocks
  
  editingMode: EditingMode;
  view: AppView; // Toggle between Builder and Dashboard
  dashboardSection: DashboardSection;
  
  // Mock Dashboard Data
  dashboardData: {
    bookings: BookingItem[];
    submissions: FormSubmission[];
    products: Product[];
    subscribers: Subscriber[];
  };

  selectedBlockId: string | null;
  viewport: ViewportMode;
  isSettingsOpen: boolean;
  pageSettings: PageSettings;
  history: any[][]; // Simplified history typing for now
  historyIndex: number;
}
