'use client';
import React, { useEffect, useState } from 'react';
import RegisterForm from '../form/register-form';
import LoginForm from '../form/login-form';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { logout } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  totalAmount: number;
  createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://muhalcartbackend-production.up.railway.app';

const LoginArea = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'track'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Tracking state
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState('');

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        console.error(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchUserOrders();
    }
  }, [userInfo]);

  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderId.trim()) {
      setTrackError('Please enter a valid Order ID');
      setTrackedOrder(null);
      return;
    }

    const order = orders.find(
      (o) => o.orderId.toLowerCase() === trackOrderId.trim().toLowerCase()
    );

    if (order) {
      setTrackedOrder(order);
      setTrackError('');
    } else {
      setTrackedOrder(null);
      setTrackError('No order found with this ID in your history');
    }
  };

  const startTrackDirectly = (orderId: string) => {
    setTrackOrderId(orderId);
    const order = orders.find((o) => o.orderId === orderId);
    if (order) {
      setTrackedOrder(order);
      setTrackError('');
      setActiveTab('track');
    }
  };

  const getStatusStepClass = (currentStatus: string, stepStatus: string) => {
    const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (currentIndex >= stepIndex) {
      return 'step-active';
    }
    return '';
  };

  // If user is not logged in, show normal login and sign up
  if (!userInfo) {
    return (
      <section className="track-area pb-40">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-sm-12">
              <div className="tptrack__product mb-40">
                <div className="tptrack__content grey-bg">
                  <div className="tptrack__item d-flex mb-20">
                    <div className="tptrack__item-icon">
                      <i className="fal fa-user-unlock"></i>
                    </div>
                    <div className="tptrack__item-content">
                      <h4 className="tptrack__item-title">Login Here</h4>
                      <p>Your personal data will be used to support your experience throughout this website, to manage access to your account.</p>
                    </div>
                  </div>
                  <LoginForm />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="tptrack__product mb-40">
                <div className="tptrack__content grey-bg">
                  <div className="tptrack__item d-flex mb-20">
                    <div className="tptrack__item-icon">
                      <i className="fal fa-lock"></i>
                    </div>
                    <div className="tptrack__item-content">
                      <h4 className="tptrack__item-title">Sign Up</h4>
                      <p>Your personal data will be used to support your experience throughout this website, to manage access to your account.</p>
                    </div>
                  </div>
                  <RegisterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Logged in user dashboard
  return (
    <section className="dashboard-area pb-60 pt-20">
      <div className="container">
        <div className="row">
          {/* Sidebar Tabs */}
          <div className="col-lg-3 col-md-4">
            <div className="dashboard-sidebar grey-bg p-4 rounded mb-30">
              <div className="user-profile-info text-center mb-30">
                <div className="user-avatar-placeholder mb-15 mx-auto d-flex align-items-center justify-content-center bg-white rounded-circle" style={{ width: '80px', height: '80px', border: '3px solid #f1a90a' }}>
                  <i className="fal fa-user fa-2x text-warning"></i>
                </div>
                <h5 className="mb-5">{userInfo.name}</h5>
                <span className="text-muted small">{userInfo.email}</span>
              </div>
              <div className="dashboard-menu list-group">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`list-group-item list-group-item-action border-0 px-3 py-2 rounded mb-2 text-start ${activeTab === 'profile' ? 'active theme-bg-1 text-white' : 'bg-transparent text-dark'}`}
                >
                  <i className="fal fa-user-circle me-2"></i> Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`list-group-item list-group-item-action border-0 px-3 py-2 rounded mb-2 text-start ${activeTab === 'orders' ? 'active theme-bg-1 text-white' : 'bg-transparent text-dark'}`}
                >
                  <i className="fal fa-shopping-bag me-2"></i> Order History
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className={`list-group-item list-group-item-action border-0 px-3 py-2 rounded mb-2 text-start ${activeTab === 'track' ? 'active theme-bg-1 text-white' : 'bg-transparent text-dark'}`}
                >
                  <i className="fal fa-truck me-2"></i> Track My Order
                </button>
                <button
                  onClick={handleLogout}
                  className="list-group-item list-group-item-action border-0 px-3 py-2 rounded bg-transparent text-danger text-start"
                >
                  <i className="fal fa-sign-out me-2"></i> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Area */}
          <div className="col-lg-9 col-md-8">
            <div className="dashboard-content p-4 border rounded white-bg" style={{ minHeight: '380px' }}>
              
              {/* Tab 1: Profile Details */}
              {activeTab === 'profile' && (
                <div>
                  <h4 className="mb-20 pb-10 border-bottom">My Profile Details</h4>
                  <div className="row">
                    <div className="col-md-6 mb-15">
                      <label className="text-muted small d-block">Full Name</label>
                      <strong className="fs-6">{userInfo.name}</strong>
                    </div>
                    <div className="col-md-6 mb-15">
                      <label className="text-muted small d-block">Email Address</label>
                      <strong className="fs-6">{userInfo.email}</strong>
                    </div>
                    <div className="col-md-6 mb-15">
                      <label className="text-muted small d-block">Account Type</label>
                      <strong className="fs-6 text-capitalize">Customer</strong>
                    </div>
                    <div className="col-md-6 mb-15">
                      <label className="text-muted small d-block">Total Orders Placed</label>
                      <strong className="fs-6">{orders.length}</strong>
                    </div>
                  </div>
                  <div className="welcome-banner mt-30 p-3 rounded alert-warning d-flex align-items-center">
                    <i className="fal fa-info-circle fa-lg me-3 text-warning"></i>
                    <div>
                      Welcome back, <strong>{userInfo.name.split(' ')[0]}</strong>! You can view your recent order history or track delivery status of your orders using the menu on the left.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Order History */}
              {activeTab === 'orders' && (
                <div>
                  <h4 className="mb-20 pb-10 border-bottom">Order History</h4>
                  {loadingOrders ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-warning" role="status"></div>
                      <p className="mt-10">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fal fa-shopping-basket fa-3x text-muted mb-15"></i>
                      <h5>No orders found</h5>
                      <p className="text-muted mb-20">You have not placed any orders yet.</p>
                      <Link href="/shop" className="tp-btn-2">Go Shopping</Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td><strong>{order.orderId}</strong></td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                              <td>₹{order.totalAmount.toFixed(2)}</td>
                              <td>
                                <span className={`badge px-2 py-1 ${
                                  order.deliveryStatus === 'Delivered' ? 'bg-success' :
                                  order.deliveryStatus === 'Shipped' ? 'bg-info' :
                                  order.deliveryStatus === 'Processing' ? 'bg-purple bg-opacity-75' : 'bg-warning text-dark'
                                }`}>
                                  {order.deliveryStatus}
                                </span>
                              </td>
                              <td>
                                <button
                                  onClick={() => startTrackDirectly(order.orderId)}
                                  className="btn btn-sm btn-outline-warning"
                                  style={{ padding: '2px 8px', fontSize: '12px' }}
                                >
                                  Track
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Track My Order */}
              {activeTab === 'track' && (
                <div>
                  <h4 className="mb-20 pb-10 border-bottom">Track My Order</h4>
                  <p className="text-muted mb-20">Enter your Order ID to track the real-time shipment status of your package.</p>
                  
                  <form onSubmit={handleTrackOrder} className="row g-3 align-items-center mb-30">
                    <div className="col-md-6 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Order ID (e.g. MC-123456)"
                        value={trackOrderId}
                        onChange={(e) => setTrackOrderId(e.target.value)}
                        style={{ height: '45px' }}
                      />
                    </div>
                    <div className="col-md-3 col-sm-4">
                      <button type="submit" className="tp-btn-2 w-100" style={{ height: '45px' }}>
                        Track Now
                      </button>
                    </div>
                  </form>

                  {trackError && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fal fa-exclamation-triangle me-2"></i> {trackError}
                    </div>
                  )}

                  {/* Tracking Detail Display */}
                  {trackedOrder && (
                    <div className="order-tracking-result border rounded p-4 bg-light">
                      <div className="d-flex justify-content-between flex-wrap border-bottom pb-3 mb-4">
                        <div>
                          <span className="text-muted small d-block">ORDER ID</span>
                          <h5>{trackedOrder.orderId}</h5>
                        </div>
                        <div>
                          <span className="text-muted small d-block">PLACED ON</span>
                          <h5>{new Date(trackedOrder.createdAt).toLocaleDateString()}</h5>
                        </div>
                        <div>
                          <span className="text-muted small d-block">TOTAL AMOUNT</span>
                          <h5>₹{trackedOrder.totalAmount.toFixed(2)}</h5>
                        </div>
                        <div>
                          <span className="text-muted small d-block">STATUS</span>
                          <span className={`badge px-3 py-2 ${
                            trackedOrder.deliveryStatus === 'Delivered' ? 'bg-success' :
                            trackedOrder.deliveryStatus === 'Shipped' ? 'bg-info' :
                            trackedOrder.deliveryStatus === 'Processing' ? 'bg-purple bg-opacity-75' : 'bg-warning text-dark'
                          }`}>
                            {trackedOrder.deliveryStatus}
                          </span>
                        </div>
                      </div>

                      {/* Stepper Timeline */}
                      <div className="order-track-stepper d-flex justify-content-between mb-40 p-relative" style={{ zIndex: 1 }}>
                        <div className="track-line" style={{
                          position: 'absolute',
                          top: '20px',
                          left: '5%',
                          right: '5%',
                          height: '4px',
                          backgroundColor: '#e4e4e4',
                          zIndex: -1
                        }}></div>
                        
                        {/* Calculate progress bar width */}
                        <div className="track-line-progress" style={{
                          position: 'absolute',
                          top: '20px',
                          left: '5%',
                          width: trackedOrder.deliveryStatus === 'Delivered' ? '90%' :
                                 trackedOrder.deliveryStatus === 'Shipped' ? '60%' :
                                 trackedOrder.deliveryStatus === 'Processing' ? '30%' : '0%',
                          height: '4px',
                          backgroundColor: '#f1a90a',
                          zIndex: -1,
                          transition: 'width 0.4s ease'
                        }}></div>

                        {/* Step 1: Pending */}
                        <div className="track-step text-center">
                          <div className={`step-icon mx-auto rounded-circle d-flex align-items-center justify-content-center bg-white ${getStatusStepClass(trackedOrder.deliveryStatus, 'Pending')}`} style={{ width: '42px', height: '42px', border: '3px solid #e4e4e4', color: '#888' }}>
                            <i className="fal fa-file-invoice"></i>
                          </div>
                          <span className="small mt-10 d-block fw-bold">Order Placed</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="track-step text-center">
                          <div className={`step-icon mx-auto rounded-circle d-flex align-items-center justify-content-center bg-white ${getStatusStepClass(trackedOrder.deliveryStatus, 'Processing')}`} style={{ width: '42px', height: '42px', border: '3px solid #e4e4e4', color: '#888' }}>
                            <i className="fal fa-cog"></i>
                          </div>
                          <span className="small mt-10 d-block fw-bold">Processing</span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="track-step text-center">
                          <div className={`step-icon mx-auto rounded-circle d-flex align-items-center justify-content-center bg-white ${getStatusStepClass(trackedOrder.deliveryStatus, 'Shipped')}`} style={{ width: '42px', height: '42px', border: '3px solid #e4e4e4', color: '#888' }}>
                            <i className="fal fa-truck"></i>
                          </div>
                          <span className="small mt-10 d-block fw-bold">Shipped</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="track-step text-center">
                          <div className={`step-icon mx-auto rounded-circle d-flex align-items-center justify-content-center bg-white ${getStatusStepClass(trackedOrder.deliveryStatus, 'Delivered')}`} style={{ width: '42px', height: '42px', border: '3px solid #e4e4e4', color: '#888' }}>
                            <i className="fal fa-check-circle"></i>
                          </div>
                          <span className="small mt-10 d-block fw-bold">Delivered</span>
                        </div>
                      </div>

                      {/* Items and Address Details */}
                      <div className="row mt-4">
                        <div className="col-md-7 mb-3">
                          <h6 className="border-bottom pb-2">Items Ordered</h6>
                          <div className="track-items-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {trackedOrder.items.map((item, idx) => (
                              <div key={idx} className="d-flex align-items-center py-2 border-bottom">
                                <div className="item-thumbnail me-3 bg-white border rounded p-1" style={{ width: '50px', height: '50px', position: 'relative' }}>
                                  <img src={item.thumbnail} alt={item.title} className="w-100 h-100 object-fit-contain" style={{ width: '40px', height: '40px' }} />
                                </div>
                                <div className="flex-grow-1">
                                  <span className="small fw-medium d-block text-truncate" style={{ maxWidth: '250px' }}>{item.title}</span>
                                  <span className="text-muted small">{item.quantity} x ₹{item.price.toFixed(2)}</span>
                                </div>
                                <div className="fw-semibold text-end">
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-md-5">
                          <h6 className="border-bottom pb-2">Shipping Information</h6>
                          <div className="small">
                            <p className="mb-2"><strong>Name:</strong> {trackedOrder.shippingAddress.name}</p>
                            <p className="mb-2"><strong>Phone:</strong> {trackedOrder.shippingAddress.phone}</p>
                            <p className="mb-2"><strong>Address:</strong> {trackedOrder.shippingAddress.address}</p>
                            <p className="mb-2"><strong>City:</strong> {trackedOrder.shippingAddress.city}</p>
                            <p className="mb-2"><strong>Country:</strong> {trackedOrder.shippingAddress.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      
      {/* Inline styles for tracking stepper */}
      <style jsx>{`
        .step-active {
          border-color: #f1a90a !important;
          background-color: #f1a90a !important;
          color: white !important;
        }
        .bg-purple {
          background-color: #7952b3 !important;
          color: white !important;
        }
      `}</style>
    </section>
  );
};

export default LoginArea;