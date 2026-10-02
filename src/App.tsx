import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { InvoicePage } from './pages/InvoicePage';
import { OrdersHistoryPage } from './pages/OrdersHistoryPage';
import { HowToOrderPage } from './pages/HowToOrderPage';
import { FaqPage } from './pages/FaqPage';
import { AuthModal } from './pages/AuthModal';

// Admin views
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminVouchersPage } from './pages/admin/AdminVouchersPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminThemeSettingsPage } from './pages/admin/AdminThemeSettingsPage';
import { AdminPaymentSettingsPage } from './pages/admin/AdminPaymentSettingsPage';
import { AdminGeneralSettingsPage } from './pages/admin/AdminGeneralSettingsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

import { Product } from './types';

function MainApp() {
  const { products } = useStore();

  // Navigation states
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Admin tab navigation
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath, adminTab]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentPath(`/products/${product.id}`);
  };

  const handleQuickCheckout = (product: Product) => {
    setSelectedProductForCheckout(product);
    setCurrentPath('/checkout');
  };

  const handleOrderCreated = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCurrentPath(`/order/${orderId}`);
  };

  const handleViewInvoice = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCurrentPath(`/invoice/${orderId}`);
  };

  // Render Admin View
  if (currentPath.startsWith('/admin')) {
    return (
      <AdminLayout
        currentTab={adminTab}
        onNavigateTab={(tab) => {
          if (tab === 'products-new') {
            setEditingProductId(null);
            setAdminTab('products-form');
          } else {
            setAdminTab(tab);
          }
        }}
        onBackToStore={() => setCurrentPath('/')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboardPage
            onNavigateTab={(tab) => {
              if (tab === 'products-new') {
                setEditingProductId(null);
                setAdminTab('products-form');
              } else {
                setAdminTab(tab);
              }
            }}
            onSelectOrder={(id) => {
              setAdminTab('orders');
            }}
            onEditProduct={(id) => {
              setEditingProductId(id);
              setAdminTab('products-form');
            }}
          />
        )}

        {adminTab === 'products' && (
          <AdminProductsPage
            onAddNewProduct={() => {
              setEditingProductId(null);
              setAdminTab('products-form');
            }}
            onEditProduct={(id) => {
              setEditingProductId(id);
              setAdminTab('products-form');
            }}
          />
        )}

        {adminTab === 'products-form' && (
          <AdminProductFormPage
            productId={editingProductId || undefined}
            onBack={() => setAdminTab('products')}
            onSaved={() => setAdminTab('products')}
          />
        )}

        {adminTab === 'orders' && (
          <AdminOrdersPage
            onViewInvoice={(id) => {
              setCurrentOrderId(id);
              setCurrentPath(`/invoice/${id}`);
            }}
          />
        )}

        {adminTab === 'vouchers' && <AdminVouchersPage />}

        {adminTab === 'analytics' && <AdminAnalyticsPage />}

        {adminTab === 'appearance' && <AdminThemeSettingsPage />}

        {adminTab === 'payment' && <AdminPaymentSettingsPage />}

        {adminTab === 'settings' && <AdminGeneralSettingsPage />}

        {adminTab === 'audit-logs' && <AdminAuditLogsPage />}
      </AdminLayout>
    );
  }

  // Render Customer Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onCheckoutProduct={handleQuickCheckout}
          />
        )}

        {currentPath === '/products' && (
          <ProductsPage
            onSelectProduct={handleSelectProduct}
            onCheckoutProduct={handleQuickCheckout}
          />
        )}

        {currentPath.startsWith('/products/') && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => setCurrentPath('/products')}
            onCheckout={(prod) => {
              setSelectedProductForCheckout(prod);
              setCurrentPath('/checkout');
            }}
          />
        )}

        {currentPath === '/checkout' && (
          selectedProductForCheckout ? (
            <CheckoutPage
              product={selectedProductForCheckout}
              onBack={() => setCurrentPath(selectedProductId ? `/products/${selectedProductId}` : '/products')}
              onOrderCreated={handleOrderCreated}
            />
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
              <p className="text-sm font-semibold text-slate-300">Belum ada akun yang dipilih untuk checkout.</p>
              <button
                onClick={() => setCurrentPath('/products')}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500"
              >
                Pilih Akun di Katalog
              </button>
            </div>
          )
        )}

        {currentPath.startsWith('/order/') && currentOrderId && (
          <OrderDetailPage
            orderId={currentOrderId}
            onBack={() => setCurrentPath('/orders')}
            onViewInvoice={handleViewInvoice}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentPath.startsWith('/invoice/') && currentOrderId && (
          <InvoicePage
            orderId={currentOrderId}
            onBack={() => setCurrentPath(`/order/${currentOrderId}`)}
          />
        )}

        {currentPath === '/orders' && (
          <OrdersHistoryPage
            onSelectOrder={(id) => {
              setCurrentOrderId(id);
              setCurrentPath(`/order/${id}`);
            }}
            onViewInvoice={handleViewInvoice}
            onBrowseProducts={() => setCurrentPath('/products')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentPath === '/how-to-order' && (
          <HowToOrderPage onBrowseProducts={() => setCurrentPath('/products')} />
        )}

        {currentPath === '/faq' && <FaqPage />}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <MainApp />
      </StoreProvider>
    </ToastProvider>
  );
}
