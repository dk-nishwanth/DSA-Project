import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { NotificationProvider } from "@/contexts/notification-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProtectedRoute, AdminRoute } from "@/components/auth/protected-route";
import Dashboard from "./pages/Dashboard";
import TopicDetail from "./pages/TopicDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";
import Authorization from "./pages/Authorization";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Assignments from "./pages/Assignments";
import AssignmentDetail from "./pages/AssignmentDetail";
import AdminAssignmentCreator from "./pages/AdminAssignmentCreator";
import { WorkingAssignmentCreator } from "./components/assignments/working-assignment-creator";
import SubscriptionPayment from "./pages/SubscriptionPayment";
import PaymentSuccess from "./pages/PaymentSuccess";
import { VoiceSpeedTest } from "./components/voice-speed-test";
import TestAuth from "./pages/TestAuth";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="dsa-theme">
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/authorization" element={<Authorization />} />
            
            {/* Payment Routes */}
            <Route path="/subscription-payment" element={<SubscriptionPayment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <div className="min-h-screen bg-gray-50">
                  <AdminDashboard />
                </div>
              </AdminRoute>
            } />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <div className="min-h-screen bg-gray-50">
                  <AdminDashboard />
                </div>
              </AdminRoute>
            } />
            <Route path="/admin/profile" element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } />
            
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Test Routes */}
            <Route path="/voice-test" element={<VoiceSpeedTest />} />
            <Route path="/test-auth" element={<TestAuth />} />
            
            {/* Main App Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/topic/:topicId" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                      <TopicDetail />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                      <Profile />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                      <Assignments />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/assignment/:assignmentId" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                      <AssignmentDetail />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/admin/assignments/create" element={
              <AdminRoute>
                <WorkingAssignmentCreator />
              </AdminRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
