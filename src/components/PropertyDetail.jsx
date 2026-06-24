import React, { useState, useEffect } from "react";
import { getActiveAgentId } from "../utils/storage";

export default function PropertyDetail({ property, realtorConfig, onBack, onBook }) {
  const { 
    id, title, price, location, bedrooms, bathrooms, description, image, status, type,
    landSize, buildingSize, ownership, yearBuilt, amenities, nearby 
  } = property;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeAgent = getActiveAgentId();
  const shareUrl = window.location.origin + "/api/share?agent=" + (activeAgent || "") + "&id=" + id;

  // Slider State
  const [activeSlide, setActiveSlide] = useState(0);

  // Lightbox State
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    imagesList: [],
    index: 0,
    zoomScale: 1,
    panOffset: { x: 0, y: 0 }
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTouchDistance, setInitialTouchDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);

  const sliderImages = property.images && property.images.length > 0
    ? property.images
    : [image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"];

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide(prev => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = (imagesList, index) => {
    setLightboxState({
      isOpen: true,
      imagesList: imagesList,
      index: index,
      zoomScale: 1,
      panOffset: { x: 0, y: 0 }
    });
  };

  const handleCloseLightbox = () => {
    setLightboxState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleLightboxPrev = () => {
    setLightboxState(prev => ({
      ...prev,
      index: prev.index === 0 ? prev.imagesList.length - 1 : prev.index - 1,
      zoomScale: 1,
      panOffset: { x: 0, y: 0 }
    }));
  };

  const handleLightboxNext = () => {
    setLightboxState(prev => ({
      ...prev,
      index: prev.index === prev.imagesList.length - 1 ? 0 : prev.index + 1,
      zoomScale: 1,
      panOffset: { x: 0, y: 0 }
    }));
  };

  const handleZoom = (amount) => {
    setLightboxState(prev => {
      const nextScale = Math.min(Math.max(prev.zoomScale + amount, 1), 4);
      return {
        ...prev,
        zoomScale: nextScale,
        panOffset: nextScale === 1 ? { x: 0, y: 0 } : prev.panOffset
      };
    });
  };

  const handleResetZoom = () => {
    setLightboxState(prev => ({
      ...prev,
      zoomScale: 1,
      panOffset: { x: 0, y: 0 }
    }));
  };

  // Zoom event handlers
  const handleMouseDown = (e) => {
    if (lightboxState.zoomScale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - lightboxState.panOffset.x,
        y: e.clientY - lightboxState.panOffset.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && lightboxState.zoomScale > 1) {
      e.preventDefault();
      const x = e.clientX - dragStart.x;
      const y = e.clientY - dragStart.y;
      setLightboxState(prev => ({
        ...prev,
        panOffset: { x, y }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialTouchDistance(dist);
      setInitialScale(lightboxState.zoomScale);
    } else if (e.touches.length === 1 && lightboxState.zoomScale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - lightboxState.panOffset.x,
        y: e.touches[0].clientY - lightboxState.panOffset.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialTouchDistance) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(Math.max(initialScale * (dist / initialTouchDistance), 1), 4);
      setLightboxState(prev => ({
        ...prev,
        zoomScale: newScale
      }));
    } else if (e.touches.length === 1 && isDragging && lightboxState.zoomScale > 1) {
      e.preventDefault();
      const x = e.touches[0].clientX - dragStart.x;
      const y = e.touches[0].clientY - dragStart.y;
      setLightboxState(prev => ({
        ...prev,
        panOffset: { x, y }
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialTouchDistance(null);
  };

  const handleDoubleTap = () => {
    setLightboxState(prev => {
      const nextScale = prev.zoomScale > 1.1 ? 1 : 2.5;
      return {
        ...prev,
        zoomScale: nextScale,
        panOffset: nextScale === 1 ? { x: 0, y: 0 } : prev.panOffset
      };
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setLightboxState(prev => {
      const delta = -e.deltaY * 0.005;
      const nextScale = Math.min(Math.max(prev.zoomScale + delta, 1), 4);
      return {
        ...prev,
        zoomScale: nextScale,
        panOffset: nextScale === 1 ? { x: 0, y: 0 } : prev.panOffset
      };
    });
  };

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

          {/* Hero Image Slider */}
          <div className="detail-image-wrapper slider-wrapper">
            <div className="slider-track" style={{ transform: `translateX(-${activeSlide * 100}%)`, display: "flex", width: `${sliderImages.length * 100}%`, transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
              {sliderImages.map((imgUrl, idx) => (
                <div key={idx} className="slider-slide" style={{ width: `${100 / sliderImages.length}%`, flexShrink: 0, cursor: "zoom-in" }} onClick={() => handleOpenLightbox(sliderImages, idx)}>
                  <img 
                    src={imgUrl} 
                    alt={`${title} - Slide ${idx + 1}`} 
                    className="detail-hero-img" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
              ))}
            </div>

            {sliderImages.length > 1 && (
              <>
                <button 
                  type="button" 
                  className="slider-arrow arrow-left" 
                  onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                >
                  ‹
                </button>
                <button 
                  type="button" 
                  className="slider-arrow arrow-right" 
                  onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                >
                  ›
                </button>

                <div className="slider-dots">
                  {sliderImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`slider-dot ${activeSlide === idx ? "active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                    />
                  ))}
                </div>
              </>
            )}
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
                <div key={idx} className="gallery-thumb-wrapper" style={{ cursor: "zoom-in" }} onClick={() => handleOpenLightbox(mockupGallery, idx)}>
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
                      <a href={realtorConfig.instagram} target="_blank" rel="noreferrer" className="social-link-icon" title="Instagram">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    )}
                    {realtorConfig.youtube && (
                      <a href={realtorConfig.youtube} target="_blank" rel="noreferrer" className="social-link-icon" title="YouTube">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                      </a>
                    )}
                    {realtorConfig.tiktok && (
                      <a href={realtorConfig.tiktok} target="_blank" rel="noreferrer" className="social-link-icon" title="TikTok">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="svg-icon">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.99-1.72-.04 2.53-.02 5.07-.04 7.6-.07 1.94-.78 3.91-2.22 5.21-1.47 1.4-3.61 2.04-5.63 1.9-2.03-.07-4.04-.95-5.25-2.61-1.37-1.77-1.57-4.32-.6-6.28.93-2.02 3.1-3.48 5.34-3.55.08 2.37.03 4.75.06 7.13-.56-.06-1.16.14-1.52.58-.39.43-.46 1.07-.22 1.57.24.54.83.89 1.41.83.61-.03 1.13-.53 1.16-1.14.02-3.05.01-6.1.01-9.15v-8.3zm0 0"/>
                        </svg>
                      </a>
                    )}
                    {realtorConfig.linkedin && (
                      <a href={realtorConfig.linkedin} target="_blank" rel="noreferrer" className="social-link-icon" title="LinkedIn">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
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
                value={shareUrl} 
                className="form-input" 
                style={{ flex: 1, cursor: "default" }}
                onClick={(e) => e.target.select()}
              />
              <button 
                className="btn btn-primary" 
                style={{ minWidth: "120px" }}
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
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

      {/* Lightbox Modal */}
      {lightboxState.isOpen && (
        <div className="lightbox-overlay" onClick={handleCloseLightbox}>
          {/* Lightbox Header Toolbar */}
          <div className="lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-zoom-indicator">
              Zoom: {Math.round(lightboxState.zoomScale * 100)}%
            </div>
            <div className="lightbox-toolbar-buttons">
              <button type="button" className="lightbox-tool-btn" onClick={() => handleZoom(0.35)} title="Zoom In">+</button>
              <button type="button" className="lightbox-tool-btn" onClick={() => handleZoom(-0.35)} title="Zoom Out">-</button>
              <button type="button" className="lightbox-tool-btn" onClick={handleResetZoom} title="Reset Zoom">⟲</button>
              <button type="button" className="lightbox-tool-btn close-btn" onClick={handleCloseLightbox} title="Close Lightbox">×</button>
            </div>
          </div>

          {/* Lightbox Image Stage */}
          <div 
            className="lightbox-stage" 
            onClick={handleCloseLightbox}
          >
            {lightboxState.imagesList.length > 1 && (
              <button 
                type="button" 
                className="lightbox-arrow arrow-left" 
                onClick={(e) => { e.stopPropagation(); handleLightboxPrev(); }}
              >
                ‹
              </button>
            )}

            <div 
              className="lightbox-img-container"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                cursor: lightboxState.zoomScale > 1 ? "grab" : "default"
              }}
            >
              <img 
                src={lightboxState.imagesList[lightboxState.index]} 
                alt="Lightbox View" 
                className="lightbox-img"
                onDoubleClick={handleDoubleTap}
                onWheel={handleWheel}
                style={{
                  transform: `translate(${lightboxState.panOffset.x}px, ${lightboxState.panOffset.y}px) scale(${lightboxState.zoomScale})`,
                  transition: isDragging ? "none" : "transform 0.2s ease",
                  touchAction: "none"
                }}
              />
            </div>

            {lightboxState.imagesList.length > 1 && (
              <button 
                type="button" 
                className="lightbox-arrow arrow-right" 
                onClick={(e) => { e.stopPropagation(); handleLightboxNext(); }}
              >
                ›
              </button>
            )}
          </div>

          {/* Lightbox Footer Index */}
          <div className="lightbox-footer" onClick={(e) => e.stopPropagation()}>
            {lightboxState.index + 1} / {lightboxState.imagesList.length}
          </div>
        </div>
      )}

    </div>
  );
}
