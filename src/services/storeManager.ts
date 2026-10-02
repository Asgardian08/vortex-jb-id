import {
  StoreSettings,
  User,
  Product,
  Voucher,
  Order,
  AuditLog,
  AnalyticsSummary,
  Review,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_VOUCHERS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_REVIEWS,
} from '../data/seedData';

const STORAGE_KEYS = {
  SETTINGS: 'vortex_settings_v1',
  USERS: 'vortex_users_v1',
  PRODUCTS: 'vortex_products_v1',
  VOUCHERS: 'vortex_vouchers_v1',
  ORDERS: 'vortex_orders_v1',
  AUDIT_LOGS: 'vortex_audit_logs_v1',
  CURRENT_USER: 'vortex_current_user_v1',
  REVIEWS: 'vortex_reviews_v1',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

class StoreManager {
  private settings: StoreSettings;
  private users: User[];
  private products: Product[];
  private vouchers: Voucher[];
  private orders: Order[];
  private auditLogs: AuditLog[];
  private reviews: Review[];
  private currentUser: User | null;

  constructor() {
    this.settings = safeGet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    // Ensure active WhatsApp is always the user's requested number 085819822250
    if (this.settings.contact.whatsapp !== '085819822250') {
      this.settings.contact.whatsapp = '085819822250';
      safeSet(STORAGE_KEYS.SETTINGS, this.settings);
    }
    this.users = safeGet(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.products = safeGet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.vouchers = safeGet(STORAGE_KEYS.VOUCHERS, INITIAL_VOUCHERS);
    this.orders = safeGet(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    this.auditLogs = safeGet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.reviews = safeGet(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    // Default to Customer mode for authentic customer storefront experience
    this.currentUser = safeGet(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1]);

    this.applyTheme(this.settings.themeSettings);
  }

  // --- THEME & APPEARANCE ---
  public applyTheme(theme: StoreSettings['themeSettings']) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-bg', theme.bgColor);
    root.style.setProperty('--theme-card', theme.cardColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-radius', `${theme.borderRadius}px`);

    if (theme.mode === 'light') {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    } else {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }

  // --- STORE SETTINGS ---
  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<StoreSettings>, user?: User): StoreSettings {
    this.settings = {
      ...this.settings,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    safeSet(STORAGE_KEYS.SETTINGS, this.settings);
    if (partial.themeSettings) {
      this.applyTheme(this.settings.themeSettings);
    }
    this.logAudit({
      userId: user?.id || 'system',
      userName: user?.name || 'Administrator',
      action: 'SETTINGS_UPDATED',
      targetType: 'STORE_SETTINGS',
      targetId: 'vortex-settings',
      details: 'Pengaturan toko / tampilan diperbarui.',
      metadata: partial,
    });
    return { ...this.settings };
  }

  // --- AUTHENTICATION ---
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public setCurrentUser(user: User | null): void {
    this.currentUser = user;
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
  }

  public login(email: string): { success: boolean; user?: User; message?: string } {
    const found = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.setCurrentUser(found);
      return { success: true, user: found };
    }
    // If not found, create a customer user for demo convenience
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    safeSet(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  public register(name: string, email: string, phone?: string): { success: boolean; user?: User; message?: string } {
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    safeSet(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  // --- PRODUCTS ---
  public getProducts(options?: {
    query?: string;
    game?: string;
    rank?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    badge?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'discount_desc';
    includeArchived?: boolean;
  }): Product[] {
    let list = this.products.filter((p) => {
      if (!options?.includeArchived && p.status === 'ARCHIVED') return false;
      if (options?.query) {
        const q = options.query.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesGame = p.game.toLowerCase().includes(q);
        const matchesRank = p.rank.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesGame && !matchesRank && !matchesDesc) return false;
      }
      if (options?.game && options.game !== 'ALL' && p.game !== options.game) return false;
      if (options?.rank && options.rank !== 'ALL' && !p.rank.toLowerCase().includes(options.rank.toLowerCase())) return false;
      if (options?.minPrice !== undefined && p.finalPrice < options.minPrice) return false;
      if (options?.maxPrice !== undefined && p.finalPrice > options.maxPrice) return false;
      if (options?.status && options.status !== 'ALL' && p.status !== options.status) return false;
      if (options?.badge && options.badge !== 'ALL' && p.badge !== options.badge) return false;
      return true;
    });

    if (options?.sort) {
      switch (options.sort) {
        case 'price_asc':
          list.sort((a, b) => a.finalPrice - b.finalPrice);
          break;
        case 'price_desc':
          list.sort((a, b) => b.finalPrice - a.finalPrice);
          break;
        case 'popular':
          list.sort((a, b) => (b.views || 0) + (b.salesCount || 0) * 10 - ((a.views || 0) + (a.salesCount || 0) * 10));
          break;
        case 'discount_desc':
          list.sort((a, b) => (b.price - b.finalPrice) - (a.price - a.finalPrice));
          break;
        case 'newest':
        default:
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }
    return list;
  }

  public getProductById(id: string): Product | null {
    const p = this.products.find((item) => item.id === id);
    return p ? { ...p } : null;
  }

  public incrementProductView(id: string): void {
    const idx = this.products.findIndex((item) => item.id === id);
    if (idx !== -1) {
      this.products[idx].views = (this.products[idx].views || 0) + 1;
      safeSet(STORAGE_KEYS.PRODUCTS, this.products);
    }
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'salesCount'>, user?: User): Product {
    // Calculate final price strictly on backend/server logic
    let finalPrice = data.price;
    if (data.discountType === 'PERCENTAGE' && data.discountValue > 0) {
      finalPrice = Math.max(0, Math.round(data.price * (1 - data.discountValue / 100)));
    } else if (data.discountType === 'FIXED' && data.discountValue > 0) {
      finalPrice = Math.max(0, data.price - data.discountValue);
    }

    const newProduct: Product = {
      ...data,
      finalPrice,
      id: `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      views: 0,
      salesCount: 0,
      checkoutCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.unshift(newProduct);
    safeSet(STORAGE_KEYS.PRODUCTS, this.products);

    this.logAudit({
      userId: user?.id || 'admin',
      userName: user?.name || 'Admin',
      action: 'PRODUCT_CREATED',
      targetType: 'PRODUCT',
      targetId: newProduct.id,
      details: `Produk baru ditambahkan: ${newProduct.name} (${newProduct.game}) seharga Rp ${newProduct.finalPrice.toLocaleString('id-ID')}`,
    });

    return newProduct;
  }

  public updateProduct(id: string, partial: Partial<Product>, user?: User): Product | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const current = this.products[idx];
    const price = partial.price !== undefined ? partial.price : current.price;
    const discountType = partial.discountType !== undefined ? partial.discountType : current.discountType;
    const discountValue = partial.discountValue !== undefined ? partial.discountValue : current.discountValue;

    let finalPrice = price;
    if (discountType === 'PERCENTAGE' && discountValue > 0) {
      finalPrice = Math.max(0, Math.round(price * (1 - discountValue / 100)));
    } else if (discountType === 'FIXED' && discountValue > 0) {
      finalPrice = Math.max(0, price - discountValue);
    }

    const updated: Product = {
      ...current,
      ...partial,
      price,
      discountType,
      discountValue,
      finalPrice,
      updatedAt: new Date().toISOString(),
    };

    this.products[idx] = updated;
    safeSet(STORAGE_KEYS.PRODUCTS, this.products);

    this.logAudit({
      userId: user?.id || 'admin',
      userName: user?.name || 'Admin',
      action: 'PRODUCT_UPDATED',
      targetType: 'PRODUCT',
      targetId: id,
      details: `Produk "${updated.name}" diperbarui. Status: ${updated.status}`,
    });

    return updated;
  }

  public archiveProduct(id: string, user?: User): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    // Soft delete / archive system
    this.products[idx].status = 'ARCHIVED';
    this.products[idx].deletedAt = new Date().toISOString();
    this.products[idx].updatedAt = new Date().toISOString();
    safeSet(STORAGE_KEYS.PRODUCTS, this.products);

    this.logAudit({
      userId: user?.id || 'admin',
      userName: user?.name || 'Admin',
      action: 'PRODUCT_ARCHIVED',
      targetType: 'PRODUCT',
      targetId: id,
      details: `Produk "${this.products[idx].name}" diarsipkan (soft delete).`,
    });

    return true;
  }

  public duplicateProduct(id: string, user?: User): Product | null {
    const orig = this.getProductById(id);
    if (!orig) return null;

    const dup = this.createProduct(
      {
        ...orig,
        name: `${orig.name} (Copy)`,
        status: 'AVAILABLE',
        badge: 'NEW',
      },
      user
    );

    return dup;
  }

  // --- VOUCHERS ---
  public getVouchers(): Voucher[] {
    return [...this.vouchers];
  }

  public validateVoucher(
    code: string,
    subtotal: number,
    userId?: string
  ): { valid: boolean; voucher?: Voucher; discount: number; message: string } {
    const cleanCode = code.trim().toUpperCase();
    const v = this.vouchers.find((item) => item.code.toUpperCase() === cleanCode);

    if (!v) {
      return { valid: false, discount: 0, message: 'Kode voucher tidak ditemukan.' };
    }

    if (!v.active) {
      return { valid: false, discount: 0, message: 'Voucher sedang tidak aktif.' };
    }

    const now = new Date();
    if (v.expiresAt && new Date(v.expiresAt) < now) {
      return { valid: false, discount: 0, message: 'Masa berlaku voucher sudah habis.' };
    }

    if (v.startAt && new Date(v.startAt) > now) {
      return { valid: false, discount: 0, message: 'Voucher belum dapat digunakan.' };
    }

    if (v.usageLimit && v.usedCount >= v.usageLimit) {
      return { valid: false, discount: 0, message: 'Kuota penggunaan voucher sudah habis.' };
    }

    if (subtotal < v.minimumPurchase) {
      return {
        valid: false,
        discount: 0,
        message: `Minimal pembelian Rp ${v.minimumPurchase.toLocaleString('id-ID')} untuk menggunakan voucher ini.`,
      };
    }

    // Check per user usage limit in order history
    if (userId && v.perUserLimit) {
      const userUses = this.orders.filter(
        (o) => o.userId === userId && o.voucherCode?.toUpperCase() === cleanCode && o.orderStatus !== 'CANCELLED'
      ).length;
      if (userUses >= v.perUserLimit) {
        return {
          valid: false,
          discount: 0,
          message: `Anda sudah mencapai batas penggunaan voucher ini (${v.perUserLimit}x).`,
        };
      }
    }

    // Calculate discount
    let discount = 0;
    if (v.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * v.discountValue) / 100);
      if (v.maximumDiscount && discount > v.maximumDiscount) {
        discount = v.maximumDiscount;
      }
    } else {
      discount = Math.min(subtotal, v.discountValue);
    }

    return {
      valid: true,
      voucher: v,
      discount,
      message: `Voucher berhasil digunakan! Diskon: Rp ${discount.toLocaleString('id-ID')}`,
    };
  }

  public createVoucher(data: Omit<Voucher, 'id' | 'usedCount'>, user?: User): Voucher {
    const newV: Voucher = {
      ...data,
      code: data.code.toUpperCase().trim(),
      id: `voucher-${Date.now().toString(36)}`,
      usedCount: 0,
    };
    this.vouchers.push(newV);
    safeSet(STORAGE_KEYS.VOUCHERS, this.vouchers);

    this.logAudit({
      userId: user?.id || 'admin',
      userName: user?.name || 'Admin',
      action: 'VOUCHER_CREATED',
      targetType: 'VOUCHER',
      targetId: newV.id,
      details: `Voucher baru dibuat: ${newV.code} (${newV.name})`,
    });

    return newV;
  }

  public updateVoucher(id: string, partial: Partial<Voucher>, user?: User): Voucher | null {
    const idx = this.vouchers.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.vouchers[idx] = { ...this.vouchers[idx], ...partial };
    safeSet(STORAGE_KEYS.VOUCHERS, this.vouchers);

    this.logAudit({
      userId: user?.id || 'admin',
      userName: user?.name || 'Admin',
      action: 'VOUCHER_UPDATED',
      targetType: 'VOUCHER',
      targetId: id,
      details: `Voucher ${this.vouchers[idx].code} diperbarui.`,
    });

    return this.vouchers[idx];
  }

  public deleteVoucher(id: string, user?: User): boolean {
    const v = this.vouchers.find((item) => item.id === id);
    if (!v) return false;
    this.vouchers = this.vouchers.filter((item) => item.id !== id);
    safeSet(STORAGE_KEYS.VOUCHERS, this.vouchers);

    this.logAudit({
      userId: user?.id || 'admin',
      userName: user?.name || 'Admin',
      action: 'VOUCHER_DELETED',
      targetType: 'VOUCHER',
      targetId: id,
      details: `Voucher ${v.code} dihapus.`,
    });

    return true;
  }

  // --- ORDERS & TRANSACTIONS ---
  public getOrders(filters?: {
    status?: string;
    paymentStatus?: string;
    dateRange?: 'today' | 'week' | 'month' | 'all';
    userId?: string;
    query?: string;
  }): Order[] {
    let list = [...this.orders];

    if (filters?.userId) {
      list = list.filter((o) => o.userId === filters.userId);
    }

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((o) => o.orderStatus === filters.status);
    }

    if (filters?.paymentStatus && filters.paymentStatus !== 'ALL') {
      list = list.filter((o) => o.paymentStatus === filters.paymentStatus);
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.items.some((i) => i.productNameSnapshot.toLowerCase().includes(q))
      );
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (filters.dateRange === 'today') {
        cutoff.setHours(0, 0, 0, 0);
      } else if (filters.dateRange === 'week') {
        cutoff.setDate(now.getDate() - 7);
      } else if (filters.dateRange === 'month') {
        cutoff.setDate(now.getDate() - 30);
      }
      list = list.filter((o) => new Date(o.createdAt) >= cutoff);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  public getOrderById(idOrNumber: string): Order | null {
    const o = this.orders.find((item) => item.id === idOrNumber || item.orderNumber === idOrNumber);
    return o ? { ...o } : null;
  }

  public createOrder(input: {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    paymentMethod: 'QRIS' | 'BANK_TRANSFER';
    voucherCode?: string;
    notes?: string;
    userId?: string;
  }): Order {
    const product = this.getProductById(input.productId);
    if (!product) {
      throw new Error('Produk tidak ditemukan atau sudah tidak tersedia.');
    }

    if (product.status === 'SOLD' || product.status === 'ARCHIVED') {
      throw new Error('Maaf, produk ini sudah terjual atau tidak aktif.');
    }

    // Server-side financial calculations: NEVER TRUST CLIENT TOTALS!
    const subtotal = product.price;
    const productDiscount = Math.max(0, product.price - product.finalPrice);
    const subtotalAfterProductDiscount = product.finalPrice;

    let voucherDiscount = 0;
    let validatedVoucher: Voucher | undefined;

    if (input.voucherCode) {
      const vResult = this.validateVoucher(input.voucherCode, subtotalAfterProductDiscount, input.userId);
      if (vResult.valid && vResult.voucher) {
        voucherDiscount = vResult.discount;
        validatedVoucher = vResult.voucher;
      }
    }

    const total = Math.max(0, subtotalAfterProductDiscount - voucherDiscount);

    // Generate formal Order ID: VX-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const counter = (this.orders.length + 1).toString().padStart(4, '0');
    const prefix = this.settings.invoicePrefix || 'VX';
    const orderNumber = `${prefix}-${dateStr}-${counter}`;

    const orderId = `order-${Date.now()}`;
    const orderItem = {
      id: `item-${Date.now()}`,
      orderId,
      productId: product.id,
      productNameSnapshot: product.name,
      priceSnapshot: product.price,
      discountSnapshot: productDiscount,
      finalPriceSnapshot: product.finalPrice,
      quantity: 1,
      productGameSnapshot: product.game,
      productRankSnapshot: product.rank,
      productImageSnapshot: product.images[0] || '',
    };

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: input.userId || this.currentUser?.id || 'guest-user',
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerEmail: input.customerEmail.trim(),
      items: [orderItem],
      subtotal,
      productDiscount,
      voucherCode: validatedVoucher ? validatedVoucher.code : undefined,
      voucherDiscount,
      total,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'UNPAID',
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      credentialsReleased: false,
    };

    this.orders.unshift(newOrder);
    safeSet(STORAGE_KEYS.ORDERS, this.orders);

    // Update voucher usage count
    if (validatedVoucher) {
      this.updateVoucher(validatedVoucher.id, {
        usedCount: (validatedVoucher.usedCount || 0) + 1,
      });
    }

    // Increment checkout count for product analytics
    const pIdx = this.products.findIndex((p) => p.id === product.id);
    if (pIdx !== -1) {
      this.products[pIdx].checkoutCount = (this.products[pIdx].checkoutCount || 0) + 1;
      safeSet(STORAGE_KEYS.PRODUCTS, this.products);
    }

    this.logAudit({
      userId: input.userId || 'guest',
      userName: input.customerName,
      action: 'ORDER_CREATED',
      targetType: 'ORDER',
      targetId: newOrder.id,
      details: `Pesanan ${newOrder.orderNumber} dibuat untuk "${product.name}" senilai Rp ${newOrder.total.toLocaleString('id-ID')}`,
    });

    return newOrder;
  }

  public uploadPaymentProof(orderId: string, proofUrl: string, note?: string): Order | null {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;

    this.orders[idx].paymentProofUrl = proofUrl;
    this.orders[idx].paymentProofNote = note;
    this.orders[idx].paymentStatus = 'WAITING_VERIFICATION';
    this.orders[idx].orderStatus = 'PROCESSING';
    this.orders[idx].updatedAt = new Date().toISOString();

    safeSet(STORAGE_KEYS.ORDERS, this.orders);

    this.logAudit({
      userId: this.orders[idx].userId,
      userName: this.orders[idx].customerName,
      action: 'PAYMENT_PROOF_UPLOADED',
      targetType: 'ORDER',
      targetId: orderId,
      details: `Bukti transfer diunggah untuk order ${this.orders[idx].orderNumber}. Menunggu verifikasi admin.`,
    });

    return this.orders[idx];
  }

  public verifyPaymentAndCompleteOrder(
    orderId: string,
    options?: { releaseCredentials?: boolean; internalNote?: string },
    user?: User
  ): Order | null {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;

    const order = this.orders[idx];
    order.paymentStatus = 'PAID';
    order.orderStatus = 'COMPLETED';
    order.completedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    if (options?.internalNote) order.internalNote = options.internalNote;

    // Securely release credentials to customer
    if (options?.releaseCredentials !== false) {
      const prod = this.getProductById(order.items[0].productId);
      if (prod && prod.credentials) {
        order.credentialsReleased = true;
        order.releasedCredentials = { ...prod.credentials };
      }
    }

    // Mark product as SOLD
    const pIdx = this.products.findIndex((p) => p.id === order.items[0].productId);
    if (pIdx !== -1) {
      this.products[pIdx].status = 'SOLD';
      this.products[pIdx].badge = 'SOLD';
      this.products[pIdx].salesCount = (this.products[pIdx].salesCount || 0) + 1;
      safeSet(STORAGE_KEYS.PRODUCTS, this.products);
    }

    safeSet(STORAGE_KEYS.ORDERS, this.orders);

    this.logAudit({
      userId: user?.id || 'admin',
      userName: user?.name || 'Admin',
      action: 'PAYMENT_VERIFIED',
      targetType: 'ORDER',
      targetId: orderId,
      details: `Pembayaran ${order.orderNumber} diverifikasi sah. Status order: COMPLETED. Kredensial akun diserahkan.`,
    });

    return order;
  }

  public cancelOrder(orderId: string, reason: string, user?: User): Order | null {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;

    const order = this.orders[idx];
    // Rule: COMPLETED order cannot be cancelled
    if (order.orderStatus === 'COMPLETED') {
      throw new Error('Pesanan yang sudah COMPLETED tidak dapat dibatalkan.');
    }

    // Customer can only cancel when PENDING
    if (user?.role === 'CUSTOMER' && order.orderStatus !== 'PENDING') {
      throw new Error('Pesanan yang sedang diproses hanya dapat dibatalkan oleh Admin.');
    }

    order.orderStatus = 'CANCELLED';
    order.cancellationReason = reason;
    order.updatedAt = new Date().toISOString();

    safeSet(STORAGE_KEYS.ORDERS, this.orders);

    this.logAudit({
      userId: user?.id || 'user',
      userName: user?.name || 'Customer',
      action: 'ORDER_CANCELLED',
      targetType: 'ORDER',
      targetId: orderId,
      details: `Order ${order.orderNumber} dibatalkan. Alasan: "${reason}"`,
    });

    return order;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private logAudit(entry: Omit<AuditLog, 'id' | 'createdAt'>): void {
    const newLog: AuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    safeSet(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- ANALYTICS ---
  public getAnalytics(): AnalyticsSummary & {
    dailyRevenue: { date: string; revenue: number; orders: number }[];
    topProducts: { product: Product; revenue: number; orders: number; views: number }[];
  } {
    const completedOrders = this.orders.filter((o) => o.paymentStatus === 'PAID' || o.orderStatus === 'COMPLETED');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = this.orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length;
    const cancelledOrders = this.orders.filter((o) => o.orderStatus === 'CANCELLED').length;
    const availableProducts = this.products.filter((p) => p.status === 'AVAILABLE').length;
    const soldProducts = this.products.filter((p) => p.status === 'SOLD').length;

    const totalViews = this.products.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalPurchases = completedOrders.length;
    const conversionRate = totalViews > 0 ? Number(((totalPurchases / totalViews) * 100).toFixed(2)) : 0;
    const averageOrderValue = totalPurchases > 0 ? Math.round(totalRevenue / totalPurchases) : 0;

    // Daily breakdown for the last 7 days
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10); // MM-DD
      dailyMap.set(key, { revenue: 0, orders: 0 });
    }

    completedOrders.forEach((o) => {
      const key = o.createdAt.slice(5, 10);
      if (dailyMap.has(key)) {
        const item = dailyMap.get(key)!;
        item.revenue += o.total;
        item.orders += 1;
      }
    });

    const dailyRevenue = Array.from(dailyMap.entries()).map(([date, val]) => ({
      date,
      revenue: val.revenue,
      orders: val.orders,
    }));

    // Top products
    const productStats = new Map<string, { revenue: number; orders: number }>();
    completedOrders.forEach((o) => {
      o.items.forEach((item) => {
        const current = productStats.get(item.productId) || { revenue: 0, orders: 0 };
        current.revenue += item.finalPriceSnapshot * item.quantity;
        current.orders += item.quantity;
        productStats.set(item.productId, current);
      });
    });

    const topProducts = this.products
      .map((p) => {
        const stat = productStats.get(p.id) || { revenue: 0, orders: 0 };
        return {
          product: p,
          revenue: stat.revenue,
          orders: stat.orders,
          views: p.views || 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue || b.orders - a.orders || b.views - a.views)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders: this.orders.length,
      completedOrders: completedOrders.length,
      pendingOrders,
      cancelledOrders,
      totalProducts: this.products.length,
      availableProducts,
      soldProducts,
      conversionRate,
      averageOrderValue,
      dailyRevenue,
      topProducts,
    };
  }

  // --- REVIEWS & RATINGS ---
  public getReviews(): Review[] {
    return [...this.reviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getProductReviews(productId: string): Review[] {
    return this.reviews.filter((r) => r.productId === productId);
  }

  public getServiceReviews(): Review[] {
    return this.reviews.filter((r) => r.type === 'SERVICE' || r.type === 'COMBINED');
  }

  public getAverageRatings(): {
    productAverage: number;
    serviceAverage: number;
    totalReviews: number;
  } {
    if (this.reviews.length === 0) {
      return { productAverage: 5.0, serviceAverage: 5.0, totalReviews: 0 };
    }
    const productReviews = this.reviews.filter((r) => r.productRating > 0);
    const serviceReviews = this.reviews.filter((r) => r.serviceRating > 0);

    const productAvg = productReviews.length
      ? Number((productReviews.reduce((sum, r) => sum + r.productRating, 0) / productReviews.length).toFixed(1))
      : 5.0;

    const serviceAvg = serviceReviews.length
      ? Number((serviceReviews.reduce((sum, r) => sum + r.serviceRating, 0) / serviceReviews.length).toFixed(1))
      : 5.0;

    return {
      productAverage: productAvg,
      serviceAverage: serviceAvg,
      totalReviews: this.reviews.length,
    };
  }

  public createReview(data: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);
    safeSet(STORAGE_KEYS.REVIEWS, this.reviews);

    // If linked to an order, mark the order as reviewed
    if (data.orderId) {
      const order = this.orders.find((o) => o.id === data.orderId);
      if (order) {
        order.reviewSubmitted = true;
        order.reviewId = newReview.id;
        safeSet(STORAGE_KEYS.ORDERS, this.orders);
      }
    }

    // Update product rating and review count if linked to product
    if (data.productId) {
      const prod = this.products.find((p) => p.id === data.productId);
      if (prod) {
        const prodReviews = this.reviews.filter((r) => r.productId === data.productId);
        const avg = Number((prodReviews.reduce((sum, r) => sum + r.productRating, 0) / prodReviews.length).toFixed(1));
        prod.rating = avg;
        prod.reviewCount = prodReviews.length;
        safeSet(STORAGE_KEYS.PRODUCTS, this.products);
      }
    }

    this.logAudit({
      userId: data.userId || 'guest',
      userName: data.userName || 'Customer',
      action: 'REVIEW_SUBMITTED',
      targetType: 'REVIEW',
      targetId: newReview.id,
      details: `Ulasan baru diberikan (Rating Produk: ${data.productRating}★, Layanan: ${data.serviceRating}★)`,
    });

    return newReview;
  }

  public deleteReview(reviewId: string): void {
    const rev = this.reviews.find((r) => r.id === reviewId);
    this.reviews = this.reviews.filter((r) => r.id !== reviewId);
    safeSet(STORAGE_KEYS.REVIEWS, this.reviews);

    // Recalculate product rating if applicable
    if (rev && rev.productId) {
      const prod = this.products.find((p) => p.id === rev.productId);
      if (prod) {
        const prodReviews = this.reviews.filter((r) => r.productId === rev.productId);
        if (prodReviews.length > 0) {
          prod.rating = Number((prodReviews.reduce((sum, r) => sum + r.productRating, 0) / prodReviews.length).toFixed(1));
          prod.reviewCount = prodReviews.length;
        } else {
          prod.rating = 5.0;
          prod.reviewCount = 0;
        }
        safeSet(STORAGE_KEYS.PRODUCTS, this.products);
      }
    }

    this.logAudit({
      userId: this.currentUser?.id || 'admin',
      userName: this.currentUser?.name || 'Administrator',
      action: 'REVIEW_DELETED',
      targetType: 'REVIEW',
      targetId: reviewId,
      details: `Ulasan pelanggan dengan ID ${reviewId} telah dihapus.`,
    });
  }

  // Reset only products to 0 / empty for fresh stock entry
  public resetProductsOnly(): void {
    this.products = [];
    safeSet(STORAGE_KEYS.PRODUCTS, this.products);
    this.logAudit({
      userId: this.currentUser?.id || 'admin',
      userName: this.currentUser?.name || 'Admin Vortex Official',
      action: 'PRODUCTS_WIPED_TO_EMPTY',
      targetType: 'PRODUCT',
      targetId: 'all',
      details: 'Seluruh stok produk game telah dikosongkan menjadi 0. Toko siap untuk input stok baru.',
    });
  }

  // Reset all data to 0 / empty for fresh production stock entry
  public resetToCleanSlate(): void {
    this.products = [];
    this.orders = [];
    this.vouchers = [];
    this.reviews = [];
    this.auditLogs = [
      {
        id: `log-${Date.now()}`,
        userId: 'admin',
        userName: 'Admin Vortex Official',
        action: 'STORE_RESET_TO_EMPTY',
        targetType: 'SYSTEM',
        targetId: 'all',
        details: 'Semua data produk, transaksi, voucher, dan ulasan telah dikosongkan ke 0. Toko siap untuk pengisian stok baru.',
        createdAt: new Date().toISOString(),
      },
    ];

    safeSet(STORAGE_KEYS.PRODUCTS, this.products);
    safeSet(STORAGE_KEYS.ORDERS, this.orders);
    safeSet(STORAGE_KEYS.VOUCHERS, this.vouchers);
    safeSet(STORAGE_KEYS.REVIEWS, this.reviews);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // Reset store to fresh seed data
  public resetToFactory(): void {
    this.settings = { ...INITIAL_SETTINGS };
    this.users = [...INITIAL_USERS];
    this.products = [...INITIAL_PRODUCTS];
    this.vouchers = [...INITIAL_VOUCHERS];
    this.orders = [...INITIAL_ORDERS];
    this.reviews = [...INITIAL_REVIEWS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.currentUser = { ...INITIAL_USERS[0] };

    safeSet(STORAGE_KEYS.SETTINGS, this.settings);
    safeSet(STORAGE_KEYS.USERS, this.users);
    safeSet(STORAGE_KEYS.PRODUCTS, this.products);
    safeSet(STORAGE_KEYS.VOUCHERS, this.vouchers);
    safeSet(STORAGE_KEYS.ORDERS, this.orders);
    safeSet(STORAGE_KEYS.REVIEWS, this.reviews);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    safeSet(STORAGE_KEYS.CURRENT_USER, this.currentUser);

    this.applyTheme(this.settings.themeSettings);
  }
}

export const store = new StoreManager();
