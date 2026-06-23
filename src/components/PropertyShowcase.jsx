import React, { useState, useMemo } from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyShowcase({ properties, realtorConfig, onBookProperty }) {
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [bedsFilter, setBedsFilter] = useState("");

  // Get unique locations for dropdown filter
  const locations = useMemo(() => {
    const locs = properties.map(p => p.location);
    return [...new Set(locs)].filter(Boolean);
  }, [properties]);

  // Filter listings dynamically
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // 1. Location Filter
      if (locationFilter && property.location !== locationFilter) {
        return false;
      }

      // 2. Price Filter
      if (priceFilter) {
        const price = property.price;
        if (priceFilter === "under-750") {
          if (price >= 750000) return false;
        } else if (priceFilter === "750-1500") {
          if (price < 750000 || price > 1500000) return false;
        } else if (priceFilter === "over-1500") {
          if (price <= 1500000) return false;
        }
      }

      // 3. Bedrooms Filter
      if (bedsFilter) {
        const beds = property.bedrooms;
        if (bedsFilter === "3" && beds !== 3) return false;
        if (bedsFilter === "4+" && beds < 4) return false;
      }

      return true;
    });
  }, [properties, locationFilter, priceFilter, bedsFilter]);

  const handleClearFilters = () => {
    setLocationFilter("");
    setPriceFilter("");
    setBedsFilter("");
  };

  return (
    <div className="showcase-container">
      {/* Agent Hero Header */}
      <section className="agent-hero">
        <h1 className="agent-title">{realtorConfig?.realtorName || "Agent"}</h1>
        <p className="agent-subtitle">{realtorConfig?.realtorTitle || "Independent Broker"}</p>
        <p className="agent-bio">
          {realtorConfig?.realtorName === "Ardyan" 
            ? "Curating the most exclusive properties, beachfront sanctuaries, and design-led villas across Bali. Select a property below to schedule an exclusive, pre-qualified private viewing slot."
            : "Curating the finest properties and design-led sanctuaries. Select a property below to schedule an exclusive, pre-qualified private viewing slot."
          }
        </p>

        {/* Social Media Links */}
        {realtorConfig && (realtorConfig.instagram || realtorConfig.youtube || realtorConfig.tiktok || realtorConfig.linkedin) && (
          <div className="agent-social-links">
            {realtorConfig.instagram && (
              <a href={realtorConfig.instagram} target="_blank" rel="noreferrer" className="social-link-icon" title="Instagram">
                📸
              </a>
            )}
            {realtorConfig.youtube && (
              <a href={realtorConfig.youtube} target="_blank" rel="noreferrer" className="social-link-icon" title="YouTube">
                🎥
              </a>
            )}
            {realtorConfig.tiktok && (
              <a href={realtorConfig.tiktok} target="_blank" rel="noreferrer" className="social-link-icon" title="TikTok">
                🎵
              </a>
            )}
            {realtorConfig.linkedin && (
              <a href={realtorConfig.linkedin} target="_blank" rel="noreferrer" className="social-link-icon" title="LinkedIn">
                💼
              </a>
            )}
          </div>
        )}
      </section>

      {/* Filter Bar */}
      <section className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Location</label>
          <select 
            className="filter-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Price Range</label>
          <select 
            className="filter-select"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">Any Price</option>
            <option value="under-750">Under $750,000 USD</option>
            <option value="750-1500">$750,000 - $1,500,000 USD</option>
            <option value="over-1500">Above $1,500,000 USD</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Bedrooms</label>
          <select 
            className="filter-select"
            value={bedsFilter}
            onChange={(e) => setBedsFilter(e.target.value)}
          >
            <option value="">Any Bedrooms</option>
            <option value="3">Exactly 3 Beds</option>
            <option value="4+">4+ Beds</option>
          </select>
        </div>

        {(locationFilter || priceFilter || bedsFilter) && (
          <button className="filter-clear-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        )}
      </section>

      {/* Property Showcase Grid */}
      {filteredProperties.length > 0 ? (
        <div className="property-grid">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onViewDetails={onBookProperty} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ borderStyle: "solid", padding: "40px" }}>
          <h3>No properties match your filter criteria.</h3>
          <p style={{ marginTop: "8px" }}>Try broadening your search criteria or resetting filters.</p>
          <button className="btn btn-secondary" onClick={handleClearFilters} style={{ marginTop: "16px" }}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
