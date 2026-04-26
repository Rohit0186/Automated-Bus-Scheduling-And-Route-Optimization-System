import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import SearchResults from './pages/SearchResults';
import SeatSelection from './pages/SeatSelection';
import UserDashboard from './pages/UserDashboard';
import Tracking from './pages/Tracking';
import TrackBus from './pages/TrackBus';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccessDenied from './pages/AccessDenied';
import AdminDashboard from './pages/AdminDashboard';
import ScheduleManagement from './pages/ScheduleManagement';
import RouteManagement from './pages/RouteManagement';
import AdminRouteManagement from './pages/AdminRouteManagement';
import RouteBooking from './pages/RouteBooking';
import BusManagement from './pages/BusManagement';
import DriverPanel from './pages/DriverPanel';
import SeatAnalyticsDashboard from './pages/SeatAnalyticsDashboard';
import SeatConfiguration from './pages/SeatConfiguration';
import AdminLiveMap from './pages/AdminLiveMap';
import TripPlayback from './pages/TripPlayback';
import ErpDashboard from './pages/ErpDashboard';
import MaintenanceTracking from './pages/MaintenanceTracking';
import FuelManagement from './pages/FuelManagement';
import DepotStations from './pages/DepotStations';
import BusTypes from './pages/BusTypes';
import FareEnquiry from './pages/FareEnquiry';
import PaymentSimulator from './pages/PaymentSimulator';
import RouteDetails from './pages/RouteDetails';
import TicketPage from './pages/TicketPage';
import ScanPage from './pages/ScanPage';
import PassApplyPage from './pages/PassApplyPage';
import PassStatusPage from './pages/PassStatusPage';
import AdminPassManagement from './pages/AdminPassManagement';
import ContactPage from './pages/ContactPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Router>
        <div className="app" style={{ paddingTop: '80px' }}>
          <Toaster position="top-right" />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portal" element={<Home />} />
            <Route path="/journey-planner" element={<BookingPage />} />
            <Route path="/route-booking" element={<RouteBooking />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/seats/:scheduleId" element={<SeatSelection />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />

            {/* Public Access to tracking */}
            <Route path="/tracking/:scheduleId" element={<Tracking />} />
            <Route path="/track-bus" element={<TrackBus />} />
            <Route path="/depots-stations" element={<DepotStations />} />
            <Route path="/bus-types" element={<BusTypes />} />
            <Route path="/route-details/:id" element={<RouteDetails />} />
            <Route path="/fare-enquiry" element={<FareEnquiry />} />
            <Route path="/payment" element={<PaymentSimulator />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/ticket/:id" element={<TicketPage />} />
            <Route path="/conductor/scan" element={<ScanPage />} />
            <Route path="/passes/apply" element={<PassApplyPage />} />
            <Route path="/passes/status" element={<PassStatusPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/schedules" element={
              <ProtectedRoute requiredRole="ADMIN">
                <ScheduleManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/routes" element={
              <ProtectedRoute requiredRole="ADMIN">
                <RouteManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/route-management" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminRouteManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/buses" element={
              <ProtectedRoute requiredRole="ADMIN">
                <BusManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/seat-analytics" element={
              <ProtectedRoute requiredRole="ADMIN">
                <SeatAnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/seats/:busId" element={
              <ProtectedRoute requiredRole="ADMIN">
                <SeatConfiguration />
              </ProtectedRoute>
            } />
            <Route path="/admin/playback/:scheduleId" element={
              <ProtectedRoute requiredRole="ADMIN">
                <TripPlayback />
              </ProtectedRoute>
            } />
            <Route path="/admin/live-tracking" element={
              <ProtectedRoute requiredRole="ADMIN">
                <div className="container animate-fade" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
                  <h2 style={{ marginBottom: '24px', color: '#1a2a4b', fontWeight: '800' }}>
                    🗺️ Live Fleet Tracking
                  </h2>
                  <div className="glass-morphism" style={{ padding: '24px' }}>
                    <AdminLiveMap />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/admin/erp" element={
              <ProtectedRoute requiredRole="ADMIN">
                <ErpDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/passes" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPassManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/maintenance" element={
              <ProtectedRoute requiredRole="ADMIN">
                <MaintenanceTracking />
              </ProtectedRoute>
            } />
            <Route path="/admin/fuel" element={
              <ProtectedRoute requiredRole="ADMIN">
                <FuelManagement />
              </ProtectedRoute>
            } />

            {/* Driver Routes (Protected) */}
            <Route path="/driver" element={
              <ProtectedRoute requiredRole="DRIVER">
                <DriverPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
