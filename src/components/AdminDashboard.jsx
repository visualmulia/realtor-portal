import React, { useState, useEffect } from "react";
import PropertyForm from "./PropertyForm";
import { 
  getRealtorConfig, 
  getProperties, 
  saveProperty, 
  deleteProperty, 
  getBookings, 
  approveBooking,
  getActiveAgentId
} from "../utils/storage";

export default function AdminDashboard({ onPropertyUpdated }) {
  const [pinInput, setPinInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinError, setPinError] = useState("");
  
  const [activeTab, setActiveTab] = useState("showings"); // showings or properties
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [editingProperty, setEditingProperty] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [realtorConfig, setRealtorConfig] = useState(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      setProperties(getProperties());
      setBookings(getBookings());
      setRealtorConfig(getRealtorConfig());
    }
  }, [isAuthorized]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const activeConfig = getRealtorConfig();
    if (pinInput === activeConfig.adminPin) {
      setIsAuthorized(true);
      setPinError("");
    } else {
      setPinError("Incorrect security PIN. Please try again.");
      setPinInput("");
    }
  };

  const getRemainingTrialDays = () => {
    if (!realtorConfig || !realtorConfig.createdAt) return 14;
    const created = new Date(realtorConfig.createdAt);
    const now = new Date();
    const diffTime = now - created;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remaining = 14 - diffDays;
    return Math.max(0, remaining);
  };

  const remainingDays = getRemainingTrialDays();

  const simulateTrialDays = (daysElapsed) => {
    const agentId = getActiveAgentId();
    const updatedConfig = {
      ...realtorConfig,
      createdAt: new Date(Date.now() - daysElapsed * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem(`realtor_config_${agentId}`, JSON.stringify(updatedConfig));
    setRealtorConfig(updatedConfig);
  };

  const handleApproveBooking = (id) => {
    approveBooking(id);
    setBookings(getBookings());
    if (onPropertyUpdated) onPropertyUpdated(); // refresh other views if needed
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this showing record?")) {
      const allBookings = getBookings();
      const filtered = allBookings.filter(b => b.id !== id);
      localStorage.setItem("bookings", JSON.stringify(filtered));
      setBookings(filtered);
      if (onPropertyUpdated) onPropertyUpdated();
    }
  };

  const handleSaveProperty = (propData) => {
    saveProperty(propData);
    setProperties(getProperties());
    setIsFormOpen(false);
    setEditingProperty(null);
    if (onPropertyUpdated) onPropertyUpdated(); // trigger global listing update
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm("Are you sure you want to delete this property? This cannot be undone.")) {
      deleteProperty(id);
      setProperties(getProperties());
      if (onPropertyUpdated) onPropertyUpdated();
    }
  };

  const handleOpenEdit = (property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  // 1. Render PIN Gate if not authorized
  if (!isAuthorized) {
    return (
      <div className="admin-gate-overlay">
        <div className="pin-card">
          <h2 className="pin-title">Agent Authentication</h2>
          <p className="pin-subtitle">Enter your 4-digit PIN to access the showing dashboard and property list manager.</p>
          <form onSubmit={handlePinSubmit}>
            <input 
              type="password" 
              className="form-input pin-input" 
              maxLength="4"
              required 
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
            />
            {pinError && <p className="error-message">{pinError}</p>}
            <button type="submit" className="btn btn-primary btn-full">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Render Main Admin Dashboard
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title-group">
          <h1>Broker Console</h1>
          <p>{realtorConfig?.realtorName} • {realtorConfig?.realtorTitle}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setIsAuthorized(false)}>
          Lock Console
        </button>
      </div>

      {/* Trial Disclaimer Bar */}
      <div className="trial-disclaimer-bar" style={{ display: "flex", flexDirection: "column", gap: "10px", border: "1px solid var(--border-color)", padding: "16px 20px", marginBottom: "20px", background: "var(--bg-primary)", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <span>
            💡 Masa uji coba gratis <strong>Realtor.web.id</strong> berlaku 14 hari. Sisa trial Anda: <strong>{remainingDays} hari</strong>. Setelah masa free trial berakhir, Anda dapat menghubungi admin.
          </span>
          <button 
            onClick={() => setIsPricingModalOpen(true)} 
            className="btn btn-accent" 
            style={{ padding: "4px 12px", fontSize: "11px", height: "auto" }}
          >
            Tampilkan Paket & Perpanjang
          </button>
        </div>
        
        {/* Sandbox Simulation Controls */}
        <div style={{ borderTop: "1px dashed var(--border-color)", paddingTop: "10px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Demo Simulasi Pitch:</span>
          <button className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px", height: "auto" }} onClick={() => simulateTrialDays(11)}>Simulasi H-3</button>
          <button className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px", height: "auto" }} onClick={() => simulateTrialDays(12)}>Simulasi H-2</button>
          <button className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px", height: "auto" }} onClick={() => simulateTrialDays(13)}>Simulasi H-1</button>
          <button className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px", height: "auto" }} onClick={() => simulateTrialDays(14)}>Simulasi Habis (H-0)</button>
          <button className="btn btn-secondary" style={{ padding: "3px 8px", fontSize: "11px", height: "auto", borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }} onClick={() => simulateTrialDays(0)}>Reset Hari Ke-1</button>
        </div>
      </div>

      {/* Trial Warning Banner (Expiring soon) */}
      {remainingDays <= 3 && (
        <div className="trial-warning-banner" style={{ border: "1px solid var(--error-color)", padding: "20px", marginBottom: "20px", background: "#FFF5F5", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <strong style={{ color: "var(--error-color)", fontSize: "15px" }}>
              ⚠ Peringatan: Masa Uji Coba Gratis Anda Akan Berakhir
            </strong>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              {remainingDays === 0 
                ? "Masa uji coba gratis Anda telah HABIS hari ini. Silakan hubungi admin segera untuk melakukan perpanjangan agar web portofolio Anda tetap aktif."
                : `Masa uji coba gratis Anda akan berakhir dalam ${remainingDays} hari. Silakan hubungi admin untuk melakukan perpanjangan.`
              }
            </p>
          </div>
          <a 
            href={`https://wa.me/6281289653355?text=Halo%20Admin%20Realtor.web.id!%20Masa%20trial%20akun%20realtor%20saya%20(ID:%20${getActiveAgentId()})%20akan%20habis%20dalam%20${remainingDays}%20hari.%20Saya%20ingin%20melakukan%20perpanjangan.`}
            target="_blank" 
            rel="noreferrer"
            className="btn btn-primary"
            style={{ padding: "8px 16px", fontSize: "12px", height: "auto", backgroundColor: "var(--error-color)", borderColor: "var(--error-color)" }}
          >
            Hubungi Admin via WhatsApp
          </a>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === "showings" ? "active" : ""}`}
          onClick={() => setActiveTab("showings")}
        >
          Showing Schedule ({bookings.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          Manage Listings ({properties.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile & Settings
        </button>
      </div>

      {/* Showing Schedule Tab Content */}
      {activeTab === "showings" && (
        <div className="admin-table-container">
          {bookings.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Client / WhatsApp</th>
                  <th>Schedule</th>
                  <th>Pre-Screening Report</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td style={{ fontWeight: "500" }}>
                      {booking.propertyTitle}
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {booking.propertyLocation}
                      </div>
                    </td>
                    <td>
                      <div className="client-info-cell">
                        <span className="client-name">{booking.clientName}</span>
                        <span className="client-meta">{booking.clientEmail}</span>
                        <a 
                          href={`https://wa.me/${booking.clientPhone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ fontSize: "12px", color: "var(--accent-gold)", fontWeight: "500" }}
                        >
                          💬 {booking.clientPhone}
                        </a>
                      </div>
                    </td>
                    <td>
                      <div>{booking.date}</div>
                      <div style={{ fontWeight: "600", color: "var(--accent-gold)", fontSize: "12px" }}>
                        {booking.time}
                      </div>
                    </td>
                    <td>
                      <div className="questionnaire-summary">
                        <div>💵 Budget: <strong>{booking.budgetRange}</strong></div>
                        <div>📅 Timeline: <strong>{booking.timeline}</strong></div>
                        <div>💳 Funding: <strong>{booking.fundingStatus}</strong></div>
                      </div>
                    </td>
                    <td>
                      <span className={`booking-status-tag ${booking.status === "confirmed" ? "tag-confirmed" : "tag-pending"}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {booking.status === "pending" && (
                          <button 
                            className="btn btn-accent" 
                            style={{ padding: "6px 12px", fontSize: "11px" }}
                            onClick={() => handleApproveBooking(booking.id)}
                          >
                            Approve
                          </button>
                        )}
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: "6px 12px", fontSize: "11px", borderColor: "var(--error-color)", color: "var(--error-color)" }}
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>No Showing Appointments</h3>
              <p style={{ marginTop: "8px" }}>Scheduled show requests will appear here once submitted by clients.</p>
            </div>
          )}
        </div>
      )}

      {/* Manage Properties Tab Content */}
      {activeTab === "properties" && (
        <div>
          <div className="admin-props-header">
            <h2>Luxury Portfolio Listings</h2>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              + Add Property
            </button>
          </div>

          <div className="admin-table-container">
            {properties.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title & Location</th>
                    <th>Price</th>
                    <th>Specs</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(prop => (
                    <tr key={prop.id}>
                      <td>
                        <img 
                          src={prop.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"} 
                          alt={prop.title} 
                          style={{ width: "80px", height: "50px", objectFit: "cover", border: "1px solid var(--border-color)" }} 
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                      </td>
                      <td>
                        <span style={{ fontWeight: "500" }}>{prop.title}</span>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          📍 {prop.location}
                        </div>
                      </td>
                      <td style={{ fontWeight: "600" }}>
                        {formatPrice(prop.price)}
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {prop.bedrooms} Bed / {prop.bathrooms} Bath
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: "11px", 
                          textTransform: "uppercase", 
                          fontWeight: "600",
                          color: prop.status === "Available" ? "var(--success-color)" : prop.status === "Under Offer" ? "var(--accent-gold)" : "var(--text-muted)"
                        }}>
                          {prop.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: "6px 12px", fontSize: "11px" }}
                            onClick={() => handleOpenEdit(prop)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: "6px 12px", fontSize: "11px", borderColor: "var(--error-color)", color: "var(--error-color)" }}
                            onClick={() => handleDeleteProperty(prop.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No Properties Found</h3>
                <p style={{ marginTop: "8px" }}>Your property listing portfolio is currently empty.</p>
                <button className="btn btn-primary" onClick={handleOpenAdd} style={{ marginTop: "16px" }}>
                  Add First Property
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Settings Tab Content */}
      {activeTab === "profile" && realtorConfig && (
        <div style={{ maxWidth: "600px", margin: "0 auto", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: "30px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: "400", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>Realtor Profile Credentials</h2>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const agentId = getActiveAgentId();
            localStorage.setItem(`realtor_config_${agentId}`, JSON.stringify(realtorConfig));
            alert("Profile settings saved successfully!");
            if (onPropertyUpdated) onPropertyUpdated(); // triggers parent refresh
          }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  value={realtorConfig.realtorName}
                  onChange={(e) => setRealtorConfig({...realtorConfig, realtorName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title / Agency *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  value={realtorConfig.realtorTitle}
                  onChange={(e) => setRealtorConfig({...realtorConfig, realtorTitle: e.target.value})}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">WhatsApp Number *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  required
                  value={realtorConfig.realtorPhone}
                  onChange={(e) => setRealtorConfig({...realtorConfig, realtorPhone: e.target.value.replace(/[^0-9]/g, "")})}
                />
                <span className="form-input-helper">Without + or spaces.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Security PIN (4 Digits) *</label>
                <input 
                  type="password" 
                  className="form-input" 
                  maxLength="4"
                  required
                  value={realtorConfig.adminPin}
                  onChange={(e) => setRealtorConfig({...realtorConfig, adminPin: e.target.value.replace(/[^0-9]/g, "")})}
                />
              </div>
            </div>

            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "400", margin: "24px 0 16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>Social Media Channels</h3>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Instagram Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://instagram.com/username"
                  value={realtorConfig.instagram || ""}
                  onChange={(e) => setRealtorConfig({...realtorConfig, instagram: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">YouTube Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://youtube.com/@channel"
                  value={realtorConfig.youtube || ""}
                  onChange={(e) => setRealtorConfig({...realtorConfig, youtube: e.target.value})}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">TikTok Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://tiktok.com/@username"
                  value={realtorConfig.tiktok || ""}
                  onChange={(e) => setRealtorConfig({...realtorConfig, tiktok: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://linkedin.com/in/username"
                  value={realtorConfig.linkedin || ""}
                  onChange={(e) => setRealtorConfig({...realtorConfig, linkedin: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "20px" }}>
              Save Profile Settings
            </button>
          </form>
        </div>
      )}

      {/* Property Add/Edit Modal */}
      {isFormOpen && (
        <PropertyForm 
          property={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProperty(null);
          }}
        />
      )}

      {/* Pricing / Extension Options Modal */}
      {isPricingModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "550px", textAlign: "center" }}>
            <button className="modal-close-btn" onClick={() => setIsPricingModalOpen(false)}>×</button>
            <h2 className="modal-title">Paket Layanan & Perpanjangan</h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Pilih paket perpanjangan setelah masa uji coba berakhir. Hubungi kami via WhatsApp untuk aktivasi.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px", textAlign: "left" }}>
              <div style={{ border: "1px solid var(--border-color)", padding: "16px", background: "var(--bg-primary)" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "400" }}>Starter Plan</h3>
                <p style={{ fontWeight: "600", color: "var(--accent-gold)" }}>Rp 79.000 / bulan</p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Hingga 10 properti aktif, kalender booking dasar, subdomain kustom.</p>
              </div>
              <div style={{ border: "2px solid var(--accent-gold)", padding: "16px", background: "#FFF" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "400" }}>Professional Plan (Popular)</h3>
                <p style={{ fontWeight: "600", color: "var(--accent-gold)" }}>Rp 199.000 / bulan</p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Unlimited properti listing, kalender advanced booking, kustom domain, pre-screening lengkap.</p>
              </div>
              <div style={{ border: "1px solid var(--border-color)", padding: "16px", background: "var(--bg-primary)" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "400" }}>Agency Plan</h3>
                <p style={{ fontWeight: "600", color: "var(--accent-gold)" }}>Rp 799.000 / bulan</p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Everything in Pro, hingga 15 akun Agen, Integrasi CRM, analitik performa, White Label Branding.</p>
              </div>
            </div>

            <a 
              href={`https://wa.me/6281289653355?text=Halo%20Admin%20Realtor.web.id!%20Saya%20tertarik%20untuk%20berlangganan%20paket%20Realtor.web.id%20setelah%20masa%20trial%20saya%20berakhir.%20(Subdomain%20ID:%20${getActiveAgentId()})`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-primary btn-full"
              style={{ padding: "12px" }}
            >
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
