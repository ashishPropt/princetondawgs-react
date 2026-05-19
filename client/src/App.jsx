import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Leagues from './pages/Leagues'
import Tournament from './pages/Tournament'
import Team from './pages/Team'
import Sponsors from './pages/Sponsors'
import UstaRegister from './pages/UstaRegister'
import { ForgotPassword, ResetPassword } from './pages/PasswordReset'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth — full page, no nav/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Public — with layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/leagues" element={<Layout><Leagues /></Layout>} />
        <Route path="/tournament" element={<Layout><Tournament /></Layout>} />
        <Route path="/team" element={<Layout><Team /></Layout>} />
        <Route path="/sponsors" element={<Layout><Sponsors /></Layout>} />
        <Route path="/usta-register" element={<Layout><UstaRegister /></Layout>} />

        {/* Protected */}
        <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
        <Route path="/admin/*" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}
