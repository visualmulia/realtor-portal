import React from "react";

export default function PropertyCard({ property, onViewDetails }) {
  const { id, title, price, location, bedrooms, bathrooms, description, image, status, type } = property;

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

  return (
    <article className="property-card">
      <div className="property-image-container" onClick={() => onViewDetails(id)} style={{ cursor: "pointer" }}>
        <span className={`property-status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
        <span className="property-type-tag">
          For {type || "Sale"}
        </span>
        {image ? (
          <img src={image} alt={title} className="property-image" onError={(e) => {
            // fallback if image fails to load
            e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
          }} />
        ) : (
          <div className="property-image-placeholder">No Image Available</div>
        )}
      </div>

      <div className="property-details">
        <span className="property-location">{location}</span>
        <h3 className="property-title" onClick={() => onViewDetails(id)} style={{ cursor: "pointer" }}>{title}</h3>
        <p className="property-price">{formatPrice(price)}</p>
        
        <div className="property-features">
          <div className="feature-item">
            <span className="feature-icon">🛌</span>
            <span>{bedrooms} Beds</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛁</span>
            <span>{bathrooms} Baths</span>
          </div>
        </div>

        <p className="property-description-preview">{description}</p>

        <button 
          className="btn btn-full btn-primary"
          onClick={() => onViewDetails(id)}
        >
          View Details
        </button>
      </div>
    </article>
  );
}
