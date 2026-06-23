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
      setFormData({
        id: property.id,
        title: property.title || "",
        price: property.price || "",
        location: property.location || "",
        bedrooms: property.bedrooms || 2,
        bathrooms: property.bathrooms || 2,
        description: property.description || "",
        image: property.image || "",
        status: property.status || "Available",
        type: property.type || "Sale",
        landSize: property.landSize || "",
        buildingSize: property.buildingSize || "",
        ownership: property.ownership || "Freehold (SHM)",
        yearBuilt: property.yearBuilt || new Date().getFullYear(),
        amenitiesInput: property.amenities ? property.amenities.join(", ") : "",
        nearbyInput: property.nearby ? property.nearby.join(", ") : ""
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.location) {
      alert("Please fill in the required fields (Title, Price, Location).");
      return;
    }

    const amenities = formData.amenitiesInput
      ? formData.amenitiesInput.split(",").map(a => a.trim()).filter(Boolean)
      : [];
    const nearby = formData.nearbyInput
      ? formData.nearbyInput.split(",").map(n => n.trim()).filter(Boolean)
      : [];

    const { amenitiesInput, nearbyInput, ...cleanData } = formData;

    onSave({
      ...cleanData,
      amenities,
      nearby
    });
  };

  // Convert uploaded file to base64 if user uploads a local image
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
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
            <label className="form-label">Image Option</label>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <input 
                type="text" 
                name="image" 
                className="form-input" 
                placeholder="Paste Image URL here..."
                value={formData.image && !formData.image.startsWith("data:") ? formData.image : ""}
                onChange={handleChange}
              />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", alignSelf: "center" }}>— OR —</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageFileChange} 
                style={{ fontSize: "13px" }}
              />
            </div>
            
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="form-image-preview" onError={(e) => {
                e.target.style.display = 'none';
              }} />
            ) : (
              <div className="form-image-placeholder">No Image Selected (Defaults to fallback)</div>
            )}
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
