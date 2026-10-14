import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Pricing from "./pages/Pricing.tsx";
import FreeTrial from "./pages/FreeTrial.tsx";
import Contact from "./pages/Contact.tsx";
import About from "./pages/About.tsx";
import DesignRequest from "./pages/DesignRequest.tsx";
import BrandGuidelines from "./pages/BrandGuidelines.tsx";
import OurWorks from "./pages/OurWorks.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Portal from "./pages/Portal.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import AdminBlog from "./pages/admin/AdminBlog.tsx";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminRequests from "./pages/admin/AdminRequests.tsx";
import AdminInbox from "./pages/admin/AdminInbox.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/free-trial" element={<FreeTrial />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/design-request" element={<DesignRequest />} />
          <Route path="/brand-guidelines" element={<BrandGuidelines />} />
          <Route path="/our-works" element={<OurWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="inbox" element={<AdminInbox />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="blog/:id" element={<AdminBlogEdit />} />
          </Route>


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
