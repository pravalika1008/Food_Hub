import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public & General Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import Restaurants from '../pages/customer/Restaurants';
import RestaurantDetails from '../pages/customer/RestaurantDetails';
import Menu from '../pages/customer/Menu';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Payment from '../pages/customer/Payment';
import MyOrders from '../pages/customer/MyOrders';
import OrderTracking from '../pages/customer/OrderTracking';

// Restaurant Pages
import RestaurantDashboard from '../pages/restaurant/RestaurantDashboard';
import ManageFood from '../pages/restaurant/ManageFood';
import AddFood from '../pages/restaurant/AddFood';
import EditFood from '../pages/restaurant/EditFood';
import RestaurantOrders from '../pages/restaurant/RestaurantOrders';

// Delivery Pages
import DeliveryDashboard from '../pages/delivery/DeliveryDashboard';
import AssignedOrders from '../pages/delivery/AssignedOrders';
import DeliveryHistory from '../pages/delivery/DeliveryHistory';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageRestaurants from '../pages/admin/ManageRestaurants';
import AdminManageFood from '../pages/admin/ManageFood';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageDelivery from '../pages/admin/ManageDelivery';

// Role-based Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to user's designated dashboard
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'RESTAURANT') return <Navigate to="/restaurant/dashboard" replace />;
    if (user?.role === 'DELIVERY') return <Navigate to="/delivery/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurants/:id" element={<RestaurantDetails />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />

      {/* Customer Pages */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders/:id/tracking"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'DELIVERY', 'RESTAURANT']}>
            <OrderTracking />
          </ProtectedRoute>
        }
      />

      {/* Restaurant Pages */}
      <Route
        path="/restaurant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
            <RestaurantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/food"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
            <ManageFood />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/food/add"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
            <AddFood />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/food/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
            <EditFood />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/orders"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
            <RestaurantOrders />
          </ProtectedRoute>
        }
      />

      {/* Delivery Pages */}
      <Route
        path="/delivery/dashboard"
        element={
          <ProtectedRoute allowedRoles={['DELIVERY', 'ADMIN']}>
            <DeliveryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery/orders"
        element={
          <ProtectedRoute allowedRoles={['DELIVERY', 'ADMIN']}>
            <AssignedOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery/history"
        element={
          <ProtectedRoute allowedRoles={['DELIVERY', 'ADMIN']}>
            <DeliveryHistory />
          </ProtectedRoute>
        }
      />

      {/* Admin Pages */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/restaurants"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManageRestaurants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/food"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminManageFood />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManageOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/delivery"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManageDelivery />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
