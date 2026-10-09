import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Retailers from "./pages/Retailers";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import FactoryDashboardLayout from "./dashboard/factory/FactoryDashboardLayout";
import FactoryOverview from "./dashboard/factory/FactoryOverview";
import FactoryProducts from "./dashboard/factory/FactoryProducts";
import FactoryInquiries from "./dashboard/factory/FactoryInquiries";
import FactoryDealers from "./dashboard/factory/FactoryDealers";
import FactoryReports from "./dashboard/factory/FactoryReports";

import RetailerDashboard from "./dashboard/retailer/RetailerDashboard";
import CustomerDashboard from "./dashboard/customer/CustomerDashboard";

const FACTORY_ROLES = ["factory_owner", "factory_manager", "sales_manager"];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/retailers" element={<Retailers />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route
            path="/factory/dashboard"
            element={
              <ProtectedRoute roles={FACTORY_ROLES}>
                <FactoryDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FactoryOverview />} />
            <Route path="products" element={<FactoryProducts />} />
            <Route path="inquiries" element={<FactoryInquiries />} />
            <Route path="dealers" element={<FactoryDealers />} />
            <Route path="reports" element={<FactoryReports />} />
          </Route>

          <Route
            path="/retailer/dashboard"
            element={
              <ProtectedRoute roles={["retailer"]}>
                <RetailerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute roles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <h1 className="font-display text-4xl text-charcoal">404</h1>
      <p className="text-fleck">Page not found.</p>
      <a href="/" className="text-deep-blue text-sm font-medium">Back to home</a>
    </div>
  );
}
