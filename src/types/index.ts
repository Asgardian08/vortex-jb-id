export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export type ProductStatus = 'AVAILABLE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';
export type ProductBadge = 'NEW' | 'HOT' | 'DISCOUNT' | 'AVAILABLE' | 'SOLD';

export interface ProductCredentials {
  loginType?: string; // e.g. Moonton ID, Google Play, Steam, VK
  username?: string;
  password?: string;
  emailRecovery?: string;
  handoverNotes?: string;
}

export interface Product {
  id: string;
  name: string;
  game: string;
  category: string;
  platform: string;
  rank: string;
  level: number;
  skinCount: number;
  premiumSkins?: string[];
  limitedSkins?: string[];
  description: string;
  price: number;
  discountType: 'NONE' | 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  finalPrice: number;
  status: ProductStatus;
  badge?: ProductBadge;
  images: string[];
  views: number;
  salesCount: number;
  checkoutCount?: number;
  rating?: number;
  reviewCount?: number;
  internalNotes?: string;
  credentials?: ProductCredentials;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type PaymentMethod = 'QRIS' | 'BANK_TRANSFER';
export type PaymentStatus = 'UNPAID' | 'WAITING_VERIFICATION' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productNameSnapshot: string;
  priceSnapshot: number;
  discountSnapshot: number;
  finalPriceSnapshot: number;
  quantity: number;
  productGameSnapshot: string;
  productRankSnapshot: string;
  productImageSnapshot?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. VX-20261002-0001
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  productDiscount: number;
  voucherCode?: string;
  voucherDiscount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProofUrl?: string;
  paymentProofNote?: string;
  cancellationReason?: string;
  internalNote?: string;
  credentialsReleased?: boolean;
  releasedCredentials?: ProductCredentials;
  reviewSubmitted?: boolean;
  reviewId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumPurchase: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startAt: string;
  expiresAt: string;
  active: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardColor: string;
  textColor: string;
  borderRadius: number;
  buttonStyle: 'solid' | 'gradient' | 'glow';
  mode: 'dark' | 'light';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logo: string;
  favicon: string;
  banner: string;
  qrisImage: string;
  qrisActive: boolean;
  themeSettings: ThemeSettings;
  contact: {
    whatsapp: string;
    telegram: string;
    instagram: string;
    tiktok: string;
    email: string;
  };
  paymentInstructions: string;
  invoicePrefix: string;
  invoiceFooterText: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  availableProducts: number;
  soldProducts: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface Review {
  id: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productRating: number; // 1 to 5
  serviceRating: number; // 1 to 5
  comment: string;
  type: 'PRODUCT' | 'SERVICE' | 'COMBINED';
  createdAt: string;
}
