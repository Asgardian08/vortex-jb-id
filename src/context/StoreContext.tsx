import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { store } from '../services/storeManager';
import { useToast } from './ToastContext';

interface StoreContextValue {
  settings: StoreSettings;
  updateSettings: (partial: Partial<StoreSettings>) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string) => boolean;
  register: (name: string, email: string, phone?: string) => boolean;
  logout: () => void;
  products: Product[];
  refreshProducts: () => void;
  getProduct: (id: string) => Product | null;
  createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'salesCount'>) => Product;
  updateProduct: (id: string, partial: Partial<Product>) => Product | null;
  archiveProduct: (id: string) => boolean;
  duplicateProduct: (id: string) => Product | null;
  recordProductView: (id: string) => void;
  vouchers: Voucher[];
  createVoucher: (data: Omit<Voucher, 'id' | 'usedCount'>) => Voucher;
  updateVoucher: (id: string, partial: Partial<Voucher>) => Voucher | null;
  deleteVoucher: (id: string) => boolean;
  validateVoucher: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
  orders: Order[];
  refreshOrders: () => void;
  getOrder: (idOrNumber: string) => Order | null;
  createOrder: (input: {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    paymentMethod: 'QRIS' | 'BANK_TRANSFER';
    voucherCode?: string;
    notes?: string;
  }) => Order;
  uploadPaymentProof: (orderId: string, proofUrl: string, note?: string) => Order | null;
  verifyOrder: (orderId: string, internalNote?: string) => Order | null;
  cancelOrder: (orderId: string, reason: string) => Order | null;
  auditLogs: AuditLog[];
  refreshAuditLogs: () => void;
  analytics: AnalyticsSummary & {
    dailyRevenue: { date: string; revenue: number; orders: number }[];
    topProducts: { product: Product; revenue: number; orders: number; views: number }[];
  };
  reviews: Review[];
  createReview: (data: Omit<Review, 'id' | 'createdAt'>) => Review;
  deleteReview: (reviewId: string) => void;
  getProductReviews: (productId: string) => Review[];
  averageRatings: { productAverage: number; serviceAverage: number; totalReviews: number };
  resetToFactory: () => void;
  resetToCleanSlate: () => void;
  resetProductsOnly: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, error, info } = useToast();
  const [settings, setSettings] = useState<StoreSettings>(store.getSettings());
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [vouchers, setVouchers] = useState<Voucher[]>(store.getVouchers());
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(store.getAuditLogs());
  const [analytics, setAnalytics] = useState(store.getAnalytics());
  const [reviews, setReviews] = useState<Review[]>(store.getReviews());

  const refreshAll = useCallback(() => {
    setSettings(store.getSettings());
    setProducts(store.getProducts());
    setVouchers(store.getVouchers());
    setOrders(store.getOrders());
    setAuditLogs(store.getAuditLogs());
    setAnalytics(store.getAnalytics());
    setReviews(store.getReviews());
  }, []);

  useEffect(() => {
    // Initial theme apply
    store.applyTheme(settings.themeSettings);
  }, [settings]);

  const updateSettings = useCallback(
    (partial: Partial<StoreSettings>) => {
      const updated = store.updateSettings(partial, currentUser || undefined);
      setSettings(updated);
      setAuditLogs(store.getAuditLogs());
      success('Pengaturan toko berhasil diperbarui.');
    },
    [currentUser, success]
  );

  const login = useCallback(
    (email: string) => {
      const res = store.login(email);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        success(`Selamat datang kembali, ${res.user.name}!`);
        return true;
      }
      error(res.message || 'Gagal masuk akun.');
      return false;
    },
    [error, success]
  );

  const register = useCallback(
    (name: string, email: string, phone?: string) => {
      const res = store.register(name, email, phone);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        success(`Akun berhasil dibuat. Selamat datang di ${settings.storeName}!`);
        return true;
      }
      error(res.message || 'Gagal mendaftar.');
      return false;
    },
    [error, success, settings.storeName]
  );

  const logout = useCallback(() => {
    store.setCurrentUser(null);
    setCurrentUser(null);
    info('Anda telah keluar dari akun.');
  }, [info]);

  const refreshProducts = useCallback(() => {
    setProducts(store.getProducts());
  }, []);

  const getProduct = useCallback((id: string) => {
    return store.getProductById(id);
  }, []);

  const createProduct = useCallback(
    (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'salesCount'>) => {
      const p = store.createProduct(data, currentUser || undefined);
      refreshAll();
      success('Produk berhasil ditambahkan.');
      return p;
    },
    [currentUser, refreshAll, success]
  );

  const updateProduct = useCallback(
    (id: string, partial: Partial<Product>) => {
      const p = store.updateProduct(id, partial, currentUser || undefined);
      refreshAll();
      if (p) success('Data produk berhasil diperbarui.');
      return p;
    },
    [currentUser, refreshAll, success]
  );

  const archiveProduct = useCallback(
    (id: string) => {
      const res = store.archiveProduct(id, currentUser || undefined);
      refreshAll();
      if (res) success('Produk berhasil diarsipkan.');
      return res;
    },
    [currentUser, refreshAll, success]
  );

  const duplicateProduct = useCallback(
    (id: string) => {
      const p = store.duplicateProduct(id, currentUser || undefined);
      refreshAll();
      if (p) success('Produk berhasil diduplikasi.');
      return p;
    },
    [currentUser, refreshAll, success]
  );

  const recordProductView = useCallback((id: string) => {
    store.incrementProductView(id);
  }, []);

  const createVoucher = useCallback(
    (data: Omit<Voucher, 'id' | 'usedCount'>) => {
      const v = store.createVoucher(data, currentUser || undefined);
      setVouchers(store.getVouchers());
      setAuditLogs(store.getAuditLogs());
      success(`Voucher ${v.code} berhasil dibuat.`);
      return v;
    },
    [currentUser, success]
  );

  const updateVoucher = useCallback(
    (id: string, partial: Partial<Voucher>) => {
      const v = store.updateVoucher(id, partial, currentUser || undefined);
      setVouchers(store.getVouchers());
      setAuditLogs(store.getAuditLogs());
      if (v) success(`Voucher ${v.code} diperbarui.`);
      return v;
    },
    [currentUser, success]
  );

  const deleteVoucher = useCallback(
    (id: string) => {
      const ok = store.deleteVoucher(id, currentUser || undefined);
      setVouchers(store.getVouchers());
      setAuditLogs(store.getAuditLogs());
      if (ok) success('Voucher berhasil dihapus.');
      return ok;
    },
    [currentUser, success]
  );

  const validateVoucher = useCallback(
    (code: string, subtotal: number) => {
      return store.validateVoucher(code, subtotal, currentUser?.id);
    },
    [currentUser?.id]
  );

  const refreshOrders = useCallback(() => {
    setOrders(store.getOrders());
  }, []);

  const getOrder = useCallback((idOrNumber: string) => {
    return store.getOrderById(idOrNumber);
  }, []);

  const createOrder = useCallback(
    (input: {
      productId: string;
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      paymentMethod: 'QRIS' | 'BANK_TRANSFER';
      voucherCode?: string;
      notes?: string;
    }) => {
      try {
        const order = store.createOrder({
          ...input,
          userId: currentUser?.id,
        });
        refreshAll();
        success('Pesanan berhasil dibuat! Silakan selesaikan pembayaran.');
        return order;
      } catch (err: any) {
        error(err.message || 'Gagal membuat pesanan.');
        throw err;
      }
    },
    [currentUser?.id, error, refreshAll, success]
  );

  const uploadPaymentProof = useCallback(
    (orderId: string, proofUrl: string, note?: string) => {
      const order = store.uploadPaymentProof(orderId, proofUrl, note);
      refreshAll();
      if (order) {
        success('Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.');
      }
      return order;
    },
    [refreshAll, success]
  );

  const verifyOrder = useCallback(
    (orderId: string, internalNote?: string) => {
      const order = store.verifyPaymentAndCompleteOrder(orderId, { internalNote }, currentUser || undefined);
      refreshAll();
      if (order) {
        success(`Pembayaran ${order.orderNumber} berhasil diverifikasi! Order selesai.`);
      }
      return order;
    },
    [currentUser, refreshAll, success]
  );

  const cancelOrder = useCallback(
    (orderId: string, reason: string) => {
      try {
        const order = store.cancelOrder(orderId, reason, currentUser || undefined);
        refreshAll();
        if (order) {
          info(`Pesanan ${order.orderNumber} telah dibatalkan.`);
        }
        return order;
      } catch (err: any) {
        error(err.message || 'Gagal membatalkan pesanan.');
        throw err;
      }
    },
    [currentUser, error, info, refreshAll]
  );

  const refreshAuditLogs = useCallback(() => {
    setAuditLogs(store.getAuditLogs());
  }, []);

  const resetToFactory = useCallback(() => {
    store.resetToFactory();
    refreshAll();
    setCurrentUser(store.getCurrentUser());
    info('Data toko telah direset ke pengaturan default demo.');
  }, [info, refreshAll]);

  const resetToCleanSlate = useCallback(() => {
    store.resetToCleanSlate();
    refreshAll();
    info('Semua data produk, pesanan, dan voucher telah dikosongkan. Toko siap untuk input stok baru!');
  }, [info, refreshAll]);

  const resetProductsOnly = useCallback(() => {
    store.resetProductsOnly();
    refreshAll();
    info('Seluruh stok produk telah dikosongkan (0 Akun). Silakan mulai input stok baru!');
  }, [info, refreshAll]);

  const createReview = useCallback(
    (data: Omit<Review, 'id' | 'createdAt'>) => {
      const rev = store.createReview(data);
      refreshAll();
      success('Terima kasih! Ulasan dan rating Anda berhasil dikirim.');
      return rev;
    },
    [refreshAll, success]
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      store.deleteReview(reviewId);
      refreshAll();
      info('Ulasan pelanggan telah dihapus.');
    },
    [info, refreshAll]
  );

  const getProductReviews = useCallback((productId: string) => {
    return store.getProductReviews(productId);
  }, []);

  const averageRatings = store.getAverageRatings();

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        products,
        refreshProducts,
        getProduct,
        createProduct,
        updateProduct,
        archiveProduct,
        duplicateProduct,
        recordProductView,
        vouchers,
        createVoucher,
        updateVoucher,
        deleteVoucher,
        validateVoucher,
        orders,
        refreshOrders,
        getOrder,
        createOrder,
        uploadPaymentProof,
        verifyOrder,
        cancelOrder,
        auditLogs,
        refreshAuditLogs,
        analytics,
        reviews,
        createReview,
        deleteReview,
        getProductReviews,
        averageRatings,
        resetToFactory,
        resetToCleanSlate,
        resetProductsOnly,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
