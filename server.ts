import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_VOUCHERS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
} from './src/data/seedData';
import {
  StoreSettings,
  User,
  Product,
  Voucher,
  Order,
  AuditLog,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// In-Memory Database for backend
let dbSettings: StoreSettings = { ...INITIAL_SETTINGS };
let dbUsers: User[] = [...INITIAL_USERS];
let dbProducts: Product[] = [...INITIAL_PRODUCTS];
let dbVouchers: Voucher[] = [...INITIAL_VOUCHERS];
let dbOrders: Order[] = [...INITIAL_ORDERS];
let dbAuditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

function addAuditLog(entry: Omit<AuditLog, 'id' | 'createdAt'>) {
  const newLog: AuditLog = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  dbAuditLogs.unshift(newLog);
  if (dbAuditLogs.length > 300) dbAuditLogs.pop();
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', store: dbSettings.storeName, time: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json(dbSettings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    dbSettings = {
      ...dbSettings,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    addAuditLog({
      userId: req.body.adminId || 'admin',
      userName: req.body.adminName || 'Admin',
      action: 'STORE_SETTINGS_UPDATED',
      targetType: 'STORE_SETTINGS',
      targetId: 'vortex-settings',
      details: 'Pengaturan toko / tema / branding berhasil diperbarui.',
    });
    res.json(dbSettings);
  });

  // Products
  app.get('/api/products', (req: Request, res: Response) => {
    const { query, game, rank, status, badge, sort } = req.query as Record<string, string>;
    let list = dbProducts.filter((p) => {
      if (status !== 'ARCHIVED' && p.status === 'ARCHIVED') return false;
      if (status && status !== 'ALL' && p.status !== status) return false;
      if (game && game !== 'ALL' && p.game !== game) return false;
      if (badge && badge !== 'ALL' && p.badge !== badge) return false;
      if (rank && rank !== 'ALL' && !p.rank.toLowerCase().includes(rank.toLowerCase())) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.game.toLowerCase().includes(q) ||
          p.rank.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sort === 'price_asc') list.sort((a, b) => a.finalPrice - b.finalPrice);
    else if (sort === 'price_desc') list.sort((a, b) => b.finalPrice - a.finalPrice);
    else if (sort === 'popular') list.sort((a, b) => (b.views || 0) - (a.views || 0));
    else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(list);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const p = dbProducts.find((item) => item.id === req.params.id);
    if (!p) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    // Mask sensitive credentials for public view
    const safeProduct = { ...p };
    delete safeProduct.credentials;
    res.json(safeProduct);
  });

  app.post('/api/products/:id/view', (req: Request, res: Response) => {
    const p = dbProducts.find((item) => item.id === req.params.id);
    if (p) {
      p.views = (p.views || 0) + 1;
    }
    res.json({ success: true, views: p ? p.views : 0 });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const body = req.body;
    let finalPrice = Number(body.price) || 0;
    if (body.discountType === 'PERCENTAGE' && body.discountValue > 0) {
      finalPrice = Math.max(0, Math.round(finalPrice * (1 - body.discountValue / 100)));
    } else if (body.discountType === 'FIXED' && body.discountValue > 0) {
      finalPrice = Math.max(0, finalPrice - body.discountValue);
    }

    const newProduct: Product = {
      ...body,
      id: `prod-${Date.now().toString(36)}`,
      finalPrice,
      views: 0,
      salesCount: 0,
      checkoutCount: 0,
      status: body.status || 'AVAILABLE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbProducts.unshift(newProduct);
    addAuditLog({
      userId: body.creatorId || 'admin',
      userName: body.creatorName || 'Admin',
      action: 'PRODUCT_CREATED',
      targetType: 'PRODUCT',
      targetId: newProduct.id,
      details: `Produk baru "${newProduct.name}" berhasil ditambahkan.`,
    });

    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const idx = dbProducts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const current = dbProducts[idx];
    const price = req.body.price !== undefined ? Number(req.body.price) : current.price;
    const discountType = req.body.discountType || current.discountType;
    const discountValue = req.body.discountValue !== undefined ? Number(req.body.discountValue) : current.discountValue;

    let finalPrice = price;
    if (discountType === 'PERCENTAGE' && discountValue > 0) {
      finalPrice = Math.max(0, Math.round(price * (1 - discountValue / 100)));
    } else if (discountType === 'FIXED' && discountValue > 0) {
      finalPrice = Math.max(0, price - discountValue);
    }

    const updated: Product = {
      ...current,
      ...req.body,
      price,
      discountType,
      discountValue,
      finalPrice,
      updatedAt: new Date().toISOString(),
    };

    dbProducts[idx] = updated;
    addAuditLog({
      userId: req.body.userId || 'admin',
      userName: req.body.userName || 'Admin',
      action: 'PRODUCT_UPDATED',
      targetType: 'PRODUCT',
      targetId: updated.id,
      details: `Produk "${updated.name}" diperbarui.`,
    });

    res.json(updated);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const idx = dbProducts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Soft delete requirement
    dbProducts[idx].status = 'ARCHIVED';
    dbProducts[idx].deletedAt = new Date().toISOString();
    dbProducts[idx].updatedAt = new Date().toISOString();

    addAuditLog({
      userId: (req.query.userId as string) || 'admin',
      userName: (req.query.userName as string) || 'Admin',
      action: 'PRODUCT_ARCHIVED',
      targetType: 'PRODUCT',
      targetId: dbProducts[idx].id,
      details: `Produk "${dbProducts[idx].name}" diarsipkan (soft delete).`,
    });

    res.json({ success: true, message: 'Produk berhasil diarsipkan' });
  });

  // Vouchers
  app.get('/api/vouchers', (_req: Request, res: Response) => {
    res.json(dbVouchers);
  });

  app.post('/api/vouchers/validate', (req: Request, res: Response) => {
    const { code, subtotal, userId } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();
    const v = dbVouchers.find((item) => item.code.toUpperCase() === cleanCode);

    if (!v) {
      res.status(400).json({ valid: false, message: 'Kode voucher tidak ditemukan.' });
      return;
    }
    if (!v.active) {
      res.status(400).json({ valid: false, message: 'Voucher tidak aktif.' });
      return;
    }
    if (v.expiresAt && new Date(v.expiresAt) < new Date()) {
      res.status(400).json({ valid: false, message: 'Voucher sudah kedaluwarsa.' });
      return;
    }
    if (v.usageLimit && v.usedCount >= v.usageLimit) {
      res.status(400).json({ valid: false, message: 'Kuota penggunaan voucher sudah habis.' });
      return;
    }
    if (subtotal < v.minimumPurchase) {
      res.status(400).json({
        valid: false,
        message: `Minimal belanja Rp ${v.minimumPurchase.toLocaleString('id-ID')}`,
      });
      return;
    }

    let discount = 0;
    if (v.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * v.discountValue) / 100);
      if (v.maximumDiscount && discount > v.maximumDiscount) discount = v.maximumDiscount;
    } else {
      discount = Math.min(subtotal, v.discountValue);
    }

    res.json({
      valid: true,
      voucher: v,
      discount,
      message: `Voucher diskon Rp ${discount.toLocaleString('id-ID')} berhasil diterapkan!`,
    });
  });

  // Orders
  app.get('/api/orders', (req: Request, res: Response) => {
    const { userId, status, paymentStatus } = req.query as Record<string, string>;
    let list = [...dbOrders];
    if (userId) list = list.filter((o) => o.userId === userId);
    if (status && status !== 'ALL') list = list.filter((o) => o.orderStatus === status);
    if (paymentStatus && paymentStatus !== 'ALL') list = list.filter((o) => o.paymentStatus === paymentStatus);

    // Mask passwords for general query
    const safeList = list.map((o) => {
      const copy = { ...o };
      if (copy.releasedCredentials) {
        copy.releasedCredentials = {
          ...copy.releasedCredentials,
          password: '[TERKIRIM KE EMAIL PEMBELI]',
        };
      }
      return copy;
    });

    res.json(safeList);
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const o = dbOrders.find((item) => item.id === req.params.id || item.orderNumber === req.params.id);
    if (!o) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    const safeOrder = { ...o };
    if (safeOrder.releasedCredentials) {
      safeOrder.releasedCredentials = {
        ...safeOrder.releasedCredentials,
        password: '[TERKIRIM KE EMAIL PEMBELI]',
      };
    }
    res.json(safeOrder);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { productId, customerName, customerPhone, customerEmail, paymentMethod, voucherCode, userId } = req.body;
    const product = dbProducts.find((p) => p.id === productId);

    if (!product || product.status === 'SOLD' || product.status === 'ARCHIVED') {
      res.status(400).json({ error: 'Produk tidak tersedia untuk dibeli.' });
      return;
    }

    // Backend-authoritative calculation
    const subtotal = product.price;
    const productDiscount = Math.max(0, product.price - product.finalPrice);
    const subtotalAfterProductDiscount = product.finalPrice;

    let voucherDiscount = 0;
    let appliedVoucher: Voucher | undefined;

    if (voucherCode) {
      const v = dbVouchers.find((item) => item.code.toUpperCase() === voucherCode.trim().toUpperCase());
      if (v && v.active && subtotalAfterProductDiscount >= v.minimumPurchase) {
        if (v.discountType === 'PERCENTAGE') {
          voucherDiscount = Math.round((subtotalAfterProductDiscount * v.discountValue) / 100);
          if (v.maximumDiscount && voucherDiscount > v.maximumDiscount) voucherDiscount = v.maximumDiscount;
        } else {
          voucherDiscount = Math.min(subtotalAfterProductDiscount, v.discountValue);
        }
        appliedVoucher = v;
        v.usedCount = (v.usedCount || 0) + 1;
      }
    }

    const total = Math.max(0, subtotalAfterProductDiscount - voucherDiscount);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const counter = (dbOrders.length + 1).toString().padStart(4, '0');
    const orderNumber = `${dbSettings.invoicePrefix || 'VX'}-${dateStr}-${counter}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      userId: userId || 'guest-user',
      customerName,
      customerPhone,
      customerEmail,
      items: [
        {
          id: `item-${Date.now()}`,
          orderId: `order-${Date.now()}`,
          productId: product.id,
          productNameSnapshot: product.name,
          priceSnapshot: product.price,
          discountSnapshot: productDiscount,
          finalPriceSnapshot: product.finalPrice,
          quantity: 1,
          productGameSnapshot: product.game,
          productRankSnapshot: product.rank,
          productImageSnapshot: product.images[0] || '',
        },
      ],
      subtotal,
      productDiscount,
      voucherCode: appliedVoucher?.code,
      voucherDiscount,
      total,
      paymentMethod: paymentMethod || 'QRIS',
      paymentStatus: 'UNPAID',
      orderStatus: 'PENDING',
      credentialsReleased: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    product.checkoutCount = (product.checkoutCount || 0) + 1;
    dbOrders.unshift(newOrder);

    addAuditLog({
      userId: userId || 'guest',
      userName: customerName,
      action: 'ORDER_CREATED',
      targetType: 'ORDER',
      targetId: newOrder.id,
      details: `Pesanan ${newOrder.orderNumber} senilai Rp ${newOrder.total.toLocaleString('id-ID')} dibuat.`,
    });

    res.status(201).json(newOrder);
  });

  // Analytics
  app.get('/api/analytics', (_req: Request, res: Response) => {
    const completed = dbOrders.filter((o) => o.paymentStatus === 'PAID' || o.orderStatus === 'COMPLETED');
    const totalRevenue = completed.reduce((sum, o) => sum + o.total, 0);

    res.json({
      totalRevenue,
      totalOrders: dbOrders.length,
      completedOrders: completed.length,
      pendingOrders: dbOrders.filter((o) => o.orderStatus === 'PENDING').length,
      cancelledOrders: dbOrders.filter((o) => o.orderStatus === 'CANCELLED').length,
      totalProducts: dbProducts.length,
      availableProducts: dbProducts.filter((p) => p.status === 'AVAILABLE').length,
      soldProducts: dbProducts.filter((p) => p.status === 'SOLD').length,
    });
  });

  // Audit Logs
  app.get('/api/audit-logs', (_req: Request, res: Response) => {
    res.json(dbAuditLogs);
  });

  // Reset endpoints for admin
  app.post('/api/reset/products', (_req: Request, res: Response) => {
    dbProducts = [];
    addAuditLog({
      userId: 'admin',
      userName: 'Admin Vortex Official',
      action: 'PRODUCTS_WIPED_TO_EMPTY',
      targetType: 'PRODUCT',
      targetId: 'all',
      details: 'Semua data produk di-reset ke 0 pada server.',
    });
    res.json({ success: true, message: 'Produk berhasil dikosongkan ke 0' });
  });

  app.post('/api/reset/clean', (_req: Request, res: Response) => {
    dbProducts = [];
    dbOrders = [];
    dbVouchers = [];
    addAuditLog({
      userId: 'admin',
      userName: 'Admin Vortex Official',
      action: 'STORE_RESET_TO_EMPTY',
      targetType: 'SYSTEM',
      targetId: 'all',
      details: 'Semua produk, pesanan, dan kupon di-reset total ke 0 pada server.',
    });
    res.json({ success: true, message: 'Seluruh data toko berhasil dikosongkan ke 0' });
  });

  app.post('/api/reset/factory', (_req: Request, res: Response) => {
    dbSettings = { ...INITIAL_SETTINGS };
    dbUsers = [...INITIAL_USERS];
    dbProducts = [...INITIAL_PRODUCTS];
    dbVouchers = [...INITIAL_VOUCHERS];
    dbOrders = [...INITIAL_ORDERS];
    dbAuditLogs = [...INITIAL_AUDIT_LOGS];
    res.json({ success: true, message: 'Data toko dikembalikan ke setelan demo default' });
  });

  // Mount Vite or static build
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vortex ID] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('[Vortex ID] Failed to start server:', err);
});
