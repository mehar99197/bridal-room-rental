import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import GuestRoute from './components/GuestRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RoomList from './pages/RoomList'
import RoomDetail from './pages/RoomDetail'
import DressList from './pages/DressList'
import DressDetail from './pages/DressDetail'
import BookingList from './pages/BookingList'
import AdminPanel from './pages/AdminPanel'
import EditProfile from './pages/EditProfile'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/dresses" element={<DressList />} />
              <Route path="/dresses/:id" element={<DressDetail />} />
              <Route path="/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/admin-panel" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
