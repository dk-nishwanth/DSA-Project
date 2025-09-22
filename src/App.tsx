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
import { AdvancedLearningDashboard } from "./components/advanced-learning-dashboard";
import { InterviewSimulator } from "./components/interview-simulator";
import { EnhancedCodeEditor } from "./components/enhanced-code-editor";
import { AdvancedFeaturesIntegration } from "./services/advanced-features-integration";
import { AdvancedFeaturesTest } from "./components/advanced-features-test";
import { DebugInfo } from "./components/debug-info";
import { GamificationTest } from "./components/gamification-test";

const queryClient = new QueryClient();

// Initialize advanced features
const advancedFeatures = AdvancedFeaturesIntegration.getInstance();
advancedFeatures.initializeForAllTopics().then(() => {
  console.log('🚀 Advanced features initialized successfully');
  advancedFeatures.validateAdvancedFeatures();
}).catch((error) => {
  console.error('❌ Advanced features initialization failed:', error);
});

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
            <Route path="/test-advanced-features" element={<AdvancedFeaturesTest />} />
            <Route path="/debug" element={<DebugInfo />} />
            <Route path="/test-gamification" element={<GamificationTest />} />
            
            {/* Advanced Learning Features */}
            <Route path="/advanced-dashboard" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <AdvancedLearningDashboard />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/interview-simulator" element={
              <ProtectedRoute>
                <InterviewSimulator />
              </ProtectedRoute>
            } />
            
            <Route path="/code-editor" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
                  <EnhancedCodeEditor />
                </div>
              </ProtectedRoute>
            } />
            
            {/* Main App Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <div className="hidden lg:block">
                    <Sidebar />
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/topic/:topicId" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <div className="hidden lg:block">
                    <Sidebar />
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                      <TopicDetail />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <div className="hidden lg:block">
                    <Sidebar />
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                      <Profile />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <div className="hidden lg:block">
                    <Sidebar />
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                      <Assignments />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/assignment/:assignmentId" element={
              <ProtectedRoute>
                <div className="flex h-screen w-full bg-background">
                  <div className="hidden lg:block">
                    <Sidebar />
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
