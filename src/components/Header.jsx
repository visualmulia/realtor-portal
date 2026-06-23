import React from "react";

export default function Header({ currentView, onNavigate, realtorConfig }) {
  const brandName = realtorConfig?.realtorName?.toUpperCase() || "REALTOR";
  const tagline = realtorConfig?.realtorTitle?.toUpperCase() || "PORTFOLIO";

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-section" onClick={() => onNavigate("")} style={{ cursor: "pointer" }}>
          <span className="logo-brand">{brandName}</span>
          <span className="logo-divider">|</span>
          <span className="logo-tagline">{tagline}</span>
        </div>
        <nav className="header-nav">
          <button 
            className={`nav-link ${currentView === "" || currentView === "showcase" ? "active" : ""}`}
            onClick={() => onNavigate("")}
          >
            Showcase
          </button>
          <button 
            className={`nav-link nav-link-admin ${currentView === "admin" || currentView === "admin-properties" ? "active" : ""}`}
            onClick={() => onNavigate("admin")}
          >
            Agent Panel
          </button>
        </nav>
      </div>
    </header>
  );
}
