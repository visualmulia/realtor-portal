import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import PropertyShowcase from "./components/PropertyShowcase";
import BookingCalendar from "./components/BookingCalendar";
import ShowingApproval from "./components/ShowingApproval";
import AdminDashboard from "./components/AdminDashboard";
import SaaSLandingPage from "./components/SaaSLandingPage";
import PropertyDetail from "./components/PropertyDetail";
import { 
  getActiveAgentId, 
  getProperties, 
  getRealtorConfig, 
  isAgentRegistered 
} from "./utils/storage";

export default function App() {
  const [agentId, setAgentId] = useState(null);
  const [view, setView] = useState("showcase");
  const [params, setParams] = useState({});
  const [properties, setProperties] = useState([]);
  const [realtorConfig, setRealtorConfig] = useState(null);

  // Parse state from active URL
  const updateStateFromUrl = () => {
    const activeAgent = getActiveAgentId();
    setAgentId(activeAgent);

    const searchParams = new URLSearchParams(window.location.search);
    const viewParam = searchParams.get("view") || "showcase";
    const idParam = searchParams.get("id") || "";
    
    // Normalize administrative routes
    let currentView = viewParam;
    if (viewParam === "admin-properties") {
      currentView = "admin";
    }

    setView(currentView);
    setParams({ id: idParam });

    // Load tenant-specific configs and properties if agent is active
    if (activeAgent) {
      setProperties(getProperties());
      setRealtorConfig(getRealtorConfig());
    } else {
      setProperties([]);
      setRealtorConfig(null);
    }
  };

  // Initialize and listen to navigation pop events
  useEffect(() => {
    updateStateFromUrl();

    const handlePopState = () => {
      updateStateFromUrl();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Dynamic navigation function
  const navigate = (targetView, targetParams = {}) => {
    const searchParams = new URLSearchParams();
    
    // 1. Maintain active agent ID if we are navigating inside an agent page
    // Or set it if we are switching to a newly registered agent
    const activeAgent = targetParams.agent || agentId;
    if (activeAgent) {
      searchParams.set("agent", activeAgent);
    }

    // 2. Set active view
    if (targetView && targetView !== "showcase") {
      searchParams.set("view", targetView);
      if (targetParams.id) {
        searchParams.set("id", targetParams.id);
      }
    }

    const searchString = searchParams.toString();
    const newUrl = searchString ? `?${searchString}` : window.location.pathname;

    window.history.pushState(null, "", newUrl);
    updateStateFromUrl();
  };

  const handleRegisterSuccess = (newAgentId) => {
    // Redirect to the new agent's showcase
    navigate("showcase", { agent: newAgentId });
  };

  const handleBackToSaaS = () => {
    // Remove query params and go to root SaaS page
    window.history.pushState(null, "", window.location.pathname);
    updateStateFromUrl();
  };

  const refreshProperties = () => {
    setProperties(getProperties());
  };

  const selectedProperty = properties.find(p => p.id === params.id);

  // 1. SaaS LANDING PAGE MODE (No active agent)
  if (!agentId) {
    return (
      <div className="app-container">
        {/* Global SaaS Header */}
        <header className="site-header saas-header">
          <div className="header-container">
            <div className="logo-section" onClick={handleBackToSaaS} style={{ cursor: "pointer" }}>
              <span className="logo-brand" style={{ letterSpacing: "3px" }}>REALTOR</span>
              <span className="logo-divider">|</span>
              <span className="logo-tagline" style={{ letterSpacing: "1px" }}>ETALASE PROPERTI DALAM 1 KLIK</span>
            </div>
            <nav className="header-nav">
              <a href="#features-section" className="nav-link">Fitur</a>
              <a href="#signup-section" className="nav-link nav-link-admin">Buat Web Portofolio</a>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <SaaSLandingPage onRegisterSuccess={handleRegisterSuccess} />
        </main>

        <footer className="site-footer">
          <div className="footer-brand">REALTOR.WEB.ID</div>
          <p>© {new Date().getFullYear()} Realtor.web.id. Platform Booking Inspeksi Properti Otomatis & Pembuat Portofolio Broker.</p>
        </footer>
      </div>
    );
  }

  // 2. ERROR PAGE: Active agent ID is invalid/not registered
  if (!isAgentRegistered(agentId)) {
    return (
      <div className="app-container">
        <header className="site-header">
          <div className="header-container">
            <div className="logo-section" onClick={handleBackToSaaS} style={{ cursor: "pointer" }}>
              <span className="logo-brand">REALTOR</span>
            </div>
          </div>
        </header>
        <main className="main-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div className="empty-state" style={{ maxWidth: "500px", padding: "40px", borderStyle: "solid" }}>
            <div className="approval-icon-error" style={{ fontSize: "60px", marginBottom: "20px" }}>✗</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "12px" }}>Website Tidak Ditemukan</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              Subdomain atau profil agent "<strong>{agentId}</strong>" belum terdaftar di platform kami.
            </p>
            <button className="btn btn-primary" onClick={handleBackToSaaS}>
              Kembali ke Halaman Utama SaaS
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 3. TENANT PORTFOLIO MODE (Active agent)
  return (
    <div className="app-container">
      <Header currentView={view} onNavigate={navigate} realtorConfig={realtorConfig} />

      <main className="main-content">
        {/* Router Switch */}
        {view === "book-showing" && selectedProperty && (
          <BookingCalendar 
            property={selectedProperty} 
            onBack={() => navigate("showcase")} 
          />
        )}

        {view === "book-showing" && !selectedProperty && (
          <div className="empty-state" style={{ marginTop: "40px" }}>
            <h3>Property Not Found</h3>
            <p style={{ marginTop: "8px" }}>The listing you are attempting to book a showing for does not exist.</p>
            <button className="btn btn-primary" onClick={() => navigate("showcase")} style={{ marginTop: "16px" }}>
              Back to Catalog
            </button>
          </div>
        )}

        {view === "approve-showing" && (
          <ShowingApproval 
            bookingId={params.id} 
            onNavigate={navigate} 
          />
        )}

        {view === "admin" && (
          <AdminDashboard 
            onPropertyUpdated={refreshProperties} 
          />
        )}

        {view === "property-detail" && selectedProperty && (
          <PropertyDetail 
            property={selectedProperty}
            realtorConfig={realtorConfig}
            onBack={() => navigate("showcase")}
            onBook={(id) => navigate("book-showing", { id })}
          />
        )}

        {view === "property-detail" && !selectedProperty && (
          <div className="empty-state" style={{ marginTop: "40px" }}>
            <h3>Property Not Found</h3>
            <p style={{ marginTop: "8px" }}>The listing details you are attempting to view do not exist.</p>
            <button className="btn btn-primary" onClick={() => navigate("showcase")} style={{ marginTop: "16px" }}>
              Back to Catalog
            </button>
          </div>
        )}

        {view === "showcase" && (
          <PropertyShowcase 
            properties={properties} 
            realtorConfig={realtorConfig}
            onBookProperty={(id) => navigate("property-detail", { id })} 
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-brand" style={{ textTransform: "uppercase" }}>
          {realtorConfig?.realtorName || agentId} | {realtorConfig?.realtorTitle || "Broker"}
        </div>
        <p>© {new Date().getFullYear()} {realtorConfig?.realtorName || agentId}. Powered by <a href="#" onClick={(e) => { e.preventDefault(); handleBackToSaaS(); }} style={{ textDecoration: "underline", fontWeight: "600" }}>realtor.web.id</a></p>
      </footer>
    </div>
  );
}
