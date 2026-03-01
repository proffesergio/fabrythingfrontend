import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import BecomeVendorPage from './pages/BecomeVendorPage';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import VendorDashboard from './pages/VendorDashboard';
import VendorProductList from './pages/VendorProductList';
import VendorOrders from './pages/VendorOrders';
import AddProduct from './pages/AddProduct';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import UserDashboard from './pages/UserDashboard';
import ProfileSettings from './pages/ProfileSettings';
import AddressBookPage from './pages/AddressBookPage';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './App.css';

// import { useEffect, useState } from 'react';
// import store from './redux/store/store';
// import { useDispatch } from 'react-redux';
// import { Provider } from 'react-redux';
// import { fetchSidebar } from './redux/reducer/sidebardata';

function App() {
  // const { status, error, items } = useSelector(state=>state.sidebardata);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (status === 'idle') {
  //     dispatch(fetchSidebar());
  //   }
  // }, [status, dispatch])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* Public Routes with Layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductListPage />} />
                  <Route path="product/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="become-vendor" element={<BecomeVendorPage />} />
                  <Route path="orders" element={<OrderHistoryPage />} />
                  <Route path="order/:id" element={<OrderDetailPage />} />
                  <Route path="account" element={<UserDashboard />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="addresses" element={<AddressBookPage />} />
                </Route>

                {/* Auth Routes (without main layout) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Checkout - allows guest checkout */}
                <Route
                  path="/checkout"
                  element={
                    <Layout>
                      <CheckoutPage />
                    </Layout>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Vendor Routes - All protected */}
                <Route
                  path="/vendor/apply"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BecomeVendorPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/status"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ApplicationStatusPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <VendorDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/products"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <VendorProductList />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/products/add"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AddProduct />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/products/edit/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AddProduct />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/orders"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <VendorOrders />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* 404 - Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
