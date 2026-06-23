import React, { useState, useEffect } from "react";

export default function PropertyDetail({ property, realtorConfig, onBack, onBook }) {
  const { 
    id, title, price, location, bedrooms, bathrooms, description, image, status, type,
    landSize, buildingSize, ownership, yearBuilt, amenities, nearby 
  } = property;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Update document title
    const originalTitle = document.title;
    const agentName = realtorConfig?.realtorName || "Agent";
    document.title = `${title} | Realtor - ${agentName}`;

    // 2. Dynamically manage meta tags
    const updateMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(price) + " USD";

    updateMetaTag("og:title", `${title} | Realtor - ${agentName}`);
    updateMetaTag("og:description", `${description.substring(0, 150)}... Price: ${formattedPrice}`);
    updateMetaTag("og:image", window.location.origin + image);
    updateMetaTag("og:url", window.location.href);
    updateMetaTag("og:type", "website");

    // Cleanup
    return () => {
      document.title = originalTitle;
    };
  }, [title, realtorConfig, description, price, image]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value) + " USD";
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "status-available";
      case "under offer":
        return "status-under-offer";
      case "sold out":
      case "sold":
        return "status-sold-out";
      default:
        return "";
    }
  };

  const isSoldOut = status.toLowerCase() === "sold out" || status.toLowerCase() === "sold";

  // Premium mockup interior photos for the gallery
  const mockupGallery = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", // Modern living room
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", // Luxury bedroom
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"  // Premium bathroom/kitchen
  ];

  const waText = encodeURIComponent(
    `Halo ${realtorConfig?.realtorName || "Agent"}! Saya melihat detail properti *${title}* (${location}) di website Anda. Apakah saya bisa bertanya lebih lanjut?`
  );
  
  const waUrl = realtorConfig 
    ? `https://wa.me/${realtorConfig.realtorPhone}?text=${waText}`
    : "#";

  return (
    <div className="property-detail-view">
      {/* Navigation Header */}
      <div className="detail-navigation-bar">
        <button className="booking-back-link" onClick={onBack}>
          ← Back to Showcase
        </button>
      </div>

      <div className="property-detail-layout">
        {/* Left Column: Media & Specifications */}
        <div className="detail-main-content">
          <div className="detail-hero-header">
            <span className="property-location">{location}</span>
            <h1 className="detail-title">{title}</h1>
          </div>

          {/* Hero Image */}
          <div className="detail-image-wrapper">
            <img 
              src={image} 
              alt={title} 
              className="detail-hero-img" 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>

          {/* Technical Specifications Grid */}
          <section className="detail-section">
            <h2 className="detail-section-title">Property Specifications</h2>
            <div className="specs-details-grid">
              <div className="spec-detail-box">
                <span className="spec-icon">📐</span>
                <div className="spec-meta">
                  <span className="spec-label">Land Size</span>
                  <span className="spec-val">{landSize ? `${landSize} m²` : "—"}</span>
                </div>
              </div>
              <div className="spec-detail-box">
                <span className="spec-icon">🏢</span>
                <div className="spec-meta">
                  <span className="spec-label">Building Size</span>
                  <span className="spec-val">{buildingSize ? `${buildingSize} m²` : "—"}</span>
                </div>
              </div>
              <div className="spec-detail-box">
                <span className="spec-icon">🛌</span>
                <div className="spec-meta">
                  <span className="spec-label">Bedrooms</span>
                  <span className="spec-val">{bedrooms} Rooms</span>
                </div>
              </div>
              <div className="spec-detail-box">
                <span className="spec-icon">🛁</span>
                <div className="spec-meta">
                  <span className="spec-label">Bathrooms</span>
                  <span className="spec-val">{bathrooms} Baths</span>
                </div>
              </div>
              <div className="spec-detail-box">
                <span className="spec-icon">📜</span>
                <div className="spec-meta">
                  <span className="spec-label">Ownership</span>
                  <span className="spec-val">{ownership || "Freehold (SHM)"}</span>
                </div>
              </div>
              <div className="spec-detail-box">
                <span className="spec-icon">📅</span>
                <div className="spec-meta">
                  <span className="spec-label">Year Built</span>
                  <span className="spec-val">{yearBuilt || "—"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Description / Overview */}
          <section className="detail-section">
            <h2 className="detail-section-title">Description</h2>
            <p className="detail-description-text">{description}</p>
          </section>

          {/* Exclusive Amenities */}
          {amenities && amenities.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section-title">Premium Amenities</h2>
              <div className="detail-amenities-grid">
                {amenities.map((item, idx) => (
                  <div key={idx} className="detail-amenity-item">
                    <span className="amenity-checkmark">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Neighborhood Access */}
          {nearby && nearby.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section-title">Location & Proximity</h2>
              <div className="detail-proximity-list">
                {nearby.map((item, idx) => (
                  <div key={idx} className="detail-proximity-item">
                    <span className="proximity-pin">📍</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Visual Gallery */}
          <section className="detail-section">
            <h2 className="detail-section-title">Interior & Architecture Gallery</h2>
            <div className="detail-gallery-grid">
              {mockupGallery.map((imgUrl, idx) => (
                <div key={idx} className="gallery-thumb-wrapper">
                  <img src={imgUrl} alt={`Interior ${idx + 1}`} className="gallery-thumb" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Pricing & Action Card */}
        <div className="detail-sidebar-container">
          <div className="detail-sticky-sidebar">
            <span className={`property-status-badge ${getStatusClass(status)}`} style={{ position: "static", display: "inline-block", marginBottom: "16px" }}>
              {status}
            </span>
            <div className="detail-sidebar-price">{formatPrice(price)}</div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "-12px", marginBottom: "24px" }}>
              For {type || "Sale"} • Taxes & Legal fees not included
            </p>

            <button 
              className={`btn btn-full btn-primary`}
              style={{ padding: "14px", marginBottom: "16px" }}
              onClick={() => onBook(id)}
              disabled={isSoldOut}
            >
              {isSoldOut ? "Sold Out" : "Book Private Showing"}
            </button>

            {realtorConfig && (
              <a 
                href={waUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-full btn-secondary"
                style={{ padding: "14px", marginBottom: "12px", display: "flex", gap: "8px", justifyContent: "center" }}
              >
                <span>💬</span> Chat via WhatsApp
              </a>
            )}

            <button 
              className="btn btn-full btn-secondary btn-share"
              style={{ padding: "14px", marginBottom: "30px", display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}
              onClick={() => setIsShareModalOpen(true)}
            >
              <span>🔗</span> Share Listing
            </button>

            {/* Realtor Profile Card */}
            {realtorConfig && (
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginTop: "20px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: "500", display: "block", marginBottom: "10px" }}>
                  Listed By Agent:
                </span>
                <strong style={{ fontSize: "18px", fontFamily: "var(--font-serif)", display: "block" }}>{realtorConfig.realtorName}</strong>
                <span style={{ fontSize: "12px", color: "var(--accent-gold)", fontWeight: "500" }}>{realtorConfig.realtorTitle}</span>
                
                {/* Social media icons */}
                {(realtorConfig.instagram || realtorConfig.youtube || realtorConfig.tiktok || realtorConfig.linkedin) && (
                  <div className="agent-social-links" style={{ justifyContent: "flex-start", gap: "10px", marginTop: "12px" }}>
                    {realtorConfig.instagram && (
                      <a href={realtorConfig.instagram} target="_blank" rel="noreferrer" className="social-link-icon" style={{ width: "32px", height: "32px", fontSize: "14px" }}>📸</a>
                    )}
                    {realtorConfig.youtube && (
                      <a href={realtorConfig.youtube} target="_blank" rel="noreferrer" className="social-link-icon" style={{ width: "32px", height: "32px", fontSize: "14px" }}>🎥</a>
                    )}
                    {realtorConfig.tiktok && (
                      <a href={realtorConfig.tiktok} target="_blank" rel="noreferrer" className="social-link-icon" style={{ width: "32px", height: "32px", fontSize: "14px" }}>🎵</a>
                    )}
                    {realtorConfig.linkedin && (
                      <a href={realtorConfig.linkedin} target="_blank" rel="noreferrer" className="social-link-icon" style={{ width: "32px", height: "32px", fontSize: "14px" }}>💼</a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content share-modal-content" style={{ maxWidth: "580px" }}>
            <button className="modal-close-btn" onClick={() => { setIsShareModalOpen(false); setCopied(false); }}>×</button>
            <h2 className="modal-title">Share Listing</h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Bagikan properti ini ke klien atau media sosial. Link yang di-generate di bawah sudah terintegrasi dengan Meta Open Graph.
            </p>

            <div className="share-link-copy-container">
              <input 
                type="text" 
                readOnly 
                value={window.location.href} 
                className="form-input" 
                style={{ flex: 1, cursor: "default" }}
                onClick={(e) => e.target.select()}
              />
              <button 
                className="btn btn-primary" 
                style={{ minWidth: "120px" }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copied! ✓" : "Copy Link"}
              </button>
            </div>

            <div className="og-preview-section" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginTop: "20px", textAlign: "left" }}>
              <span className="og-preview-title" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "12px" }}>
                Facebook / Social Media Post Preview:
              </span>
              
              {/* Simulated Social Card */}
              <div className="simulated-og-card">
                {image ? (
                  <div className="simulated-og-image-wrapper">
                    <img 
                      src={image} 
                      alt={title} 
                      className="simulated-og-image"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                ) : (
                  <div className="simulated-og-image-placeholder">
                    No Image Available
                  </div>
                )}
                <div className="simulated-og-info">
                  <div className="simulated-og-domain">
                    {window.location.hostname}
                  </div>
                  <h4 className="simulated-og-title">
                    {title} | Realtor - {realtorConfig?.realtorName || "Agent"}
                  </h4>
                  <p className="simulated-og-desc">
                    {formatPrice(price)} • {location} • {bedrooms} Beds / {bathrooms} Baths. {description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
