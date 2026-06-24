import React, { useState, useEffect } from "react";

export default function PropertyForm({ property, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    bedrooms: 2,
    bathrooms: 2,
    description: "",
    image: "",
    images: ["", "", "", "", ""],
    status: "Available",
    type: "Sale",
    landSize: "",
    buildingSize: "",
    ownership: "Freehold (SHM)",
    yearBuilt: new Date().getFullYear(),
    amenitiesInput: "",
    nearbyInput: ""
  });

  useEffect(() => {
    if (property) {
      let initialImages = property.images ? [...property.images] : [];
      if (initialImages.length === 0 && property.image) {
        initialImages = [property.image];
      }
      while (initialImages.length < 5) {
        initialImages.push("");
      }

      setFormData({
        id: property.id,
        title: property.title || "",
        price: property.price || "",
        location: property.location || "",
        bedrooms: property.bedrooms || 2,
        bathrooms: property.bathrooms || 2,
        description: property.description || "",
        image: property.image || "",
        images: initialImages,
        status: property.status || "Available",
        type: property.type || "Sale",
        landSize: property.landSize || "",
        buildingSize: property.buildingSize || "",
        ownership: property.ownership || "Freehold (SHM)",
        yearBuilt: property.yearBuilt || new Date().getFullYear(),
        amenitiesInput: property.amenities ? property.amenities.join(", ") : "",
        nearbyInput: property.nearby ? property.nearby.join(", ") : ""
      });
    } else {
      setFormData(prev => ({
        ...prev,
        images: ["", "", "", "", ""]
      }));
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "bedrooms" || name === "bathrooms" || name === "landSize" || name === "buildingSize" || name === "yearBuilt"
        ? (value === "" ? "" : Number(value)) 
        : value
    }));
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => {
      const newImages = [...(prev.images || ["", "", "", "", ""])];
      newImages[index] = value;
      const firstValidImage = newImages.find(img => img.trim() !== "") || "";
      return {
        ...prev,
        images: newImages,
        image: firstValidImage
      };
    });
  };

  const handleClearImage = (index) => {
    handleImageChange(index, "");
  };

  const handleImageFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageChange(index, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.location) {
      alert("Please fill in the required fields (Title, Price, Location).");
      return;
    }

    const cleanImages = (formData.images || []).filter(img => img && img.trim() !== "");
    const primaryImage = cleanImages[0] || "";

    const amenities = formData.amenitiesInput
      ? formData.amenitiesInput.split(",").map(a => a.trim()).filter(Boolean)
      : [];
    const nearby = formData.nearbyInput
      ? formData.nearbyInput.split(",").map(n => n.trim()).filter(Boolean)
      : [];

    const { amenitiesInput, nearbyInput, ...cleanData } = formData;

    onSave({
      ...cleanData,
      images: cleanImages,
      image: primaryImage,
      amenities,
      nearby
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">{property ? "Edit Property Listing" : "Add New Property Listing"}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input 
              type="text" 
              name="title" 
              className="form-input" 
              required 
              placeholder="e.g. Villa Satori - Jungle Sanctuary"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Price (USD) *</label>
              <input 
                type="number" 
                name="price" 
                className="form-input" 
                required 
                placeholder="e.g. 750000"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Location / Region *</label>
              <input 
                type="text" 
                name="location" 
                className="form-input" 
                required 
                placeholder="e.g. Ubud, Canggu, Uluwatu"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <input 
                type="number" 
                name="bedrooms" 
                className="form-input" 
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Bathrooms</label>
              <input 
                type="number" 
                name="bathrooms" 
                className="form-input" 
                min="0"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                name="status" 
                className="filter-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Under Offer">Under Offer</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Listing Type</label>
              <select 
                name="type" 
                className="filter-select"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "600", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginBottom: "15px", display: "block" }}>
              Listing Photos (Maksimal 5 Foto)
            </label>
            <div className="form-images-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[0, 1, 2, 3, 4].map((index) => {
                const imgVal = formData.images ? formData.images[index] : "";
                const isPrimary = index === 0;
                return (
                  <div key={index} className="form-image-slot" style={{ border: "1px solid var(--border-color)", padding: "16px", backgroundColor: "var(--bg-secondary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Foto {index + 1} {isPrimary && <strong style={{ color: "var(--accent-gold)" }}>(UTAMA)</strong>}
                      </span>
                      {imgVal && (
                        <button 
                          type="button" 
                          onClick={() => handleClearImage(index)}
                          style={{ background: "none", border: "none", color: "var(--error-color)", fontSize: "12px", cursor: "pointer", padding: 0 }}
                        >
                          Hapus Foto ×
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", flexWrap: "wrap" }}>
                      {/* Image Preview Thumbnail */}
                      <div style={{ width: "90px", height: "60px", border: "1px solid var(--border-color)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
                        {imgVal ? (
                          <img src={imgVal} alt={`Slot ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=80&q=80";
                          }} />
                        ) : (
                          <span style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center", padding: "4px" }}>Kosong</span>
                        )}
                      </div>

                      {/* Inputs: URL or Local File Upload */}
                      <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <input 
                          type="text" 
                          className="form-input" 
                          style={{ fontSize: "12px", padding: "6px 10px" }}
                          placeholder={`Paste URL Foto ${index + 1}...`}
                          value={imgVal && !imgVal.startsWith("data:") ? imgVal : ""}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Atau:</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageFileChange(index, e)} 
                            style={{ fontSize: "11px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Land Size (sqm - m²)</label>
              <input 
                type="number" 
                name="landSize" 
                className="form-input" 
                placeholder="e.g. 450"
                value={formData.landSize}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Building Size (sqm - m²)</label>
              <input 
                type="number" 
                name="buildingSize" 
                className="form-input" 
                placeholder="e.g. 320"
                value={formData.buildingSize}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Legal Ownership Title</label>
              <input 
                type="text" 
                name="ownership" 
                className="form-input" 
                placeholder="e.g. Freehold (SHM) / Leasehold 25 Years"
                value={formData.ownership}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Construction Year</label>
              <input 
                type="number" 
                name="yearBuilt" 
                className="form-input" 
                placeholder="e.g. 2024"
                value={formData.yearBuilt}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Premium Amenities (comma separated)</label>
            <input 
              type="text" 
              name="amenitiesInput" 
              className="form-input" 
              placeholder="Infinity Pool, Smart Home Sound System, Wine Cellar..."
              value={formData.amenitiesInput}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nearby Attractions & Locations (comma separated)</label>
            <input 
              type="text" 
              name="nearbyInput" 
              className="form-input" 
              placeholder="5 mins to Beach, 10 mins to School, Walk to Cafes..."
              value={formData.nearbyInput}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-textarea" 
              rows="4" 
              placeholder="Provide a detailed description of the villa amenities, design style, and view..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {property ? "Save Changes" : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
