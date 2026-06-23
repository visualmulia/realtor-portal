import React from "react";

export default function BookingPreScreen({ formData, setFormData, onSubmit, isSubmitting }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="intake-section">
      <h3 className="form-title">Pre-Screening Questionnaire</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="clientName">Full Name</label>
          <input 
            type="text" 
            id="clientName" 
            name="clientName" 
            className="form-input" 
            required 
            placeholder="John Doe"
            value={formData.clientName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="clientEmail">Email Address</label>
          <input 
            type="email" 
            id="clientEmail" 
            name="clientEmail" 
            className="form-input" 
            required 
            placeholder="john@example.com"
            value={formData.clientEmail}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="clientPhone">WhatsApp Number</label>
          <input 
            type="tel" 
            id="clientPhone" 
            name="clientPhone" 
            className="form-input" 
            required 
            placeholder="e.g. 08123456789 or +628123456789"
            value={formData.clientPhone}
            onChange={handleChange}
          />
          <span className="form-input-helper">Please include your country code if applicable.</span>
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Budget Range</label>
          <select 
            name="budgetRange" 
            className="filter-select" 
            required
            value={formData.budgetRange}
            onChange={handleChange}
          >
            <option value="">Select budget range...</option>
            <option value="Under $500k">Under $500,000 USD</option>
            <option value="$500k - $1M">$500,000 - $1,000,000 USD</option>
            <option value="$1M - $2M">$1,000,000 - $2,000,000 USD</option>
            <option value="Above $2M">Above $2,000,000 USD</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Purchasing Timeline</label>
          <div className="radio-group">
            <div>
              <input 
                type="radio" 
                id="time-immediate" 
                name="timeline" 
                value="Immediately" 
                className="radio-input"
                checked={formData.timeline === "Immediately"}
                onChange={handleChange}
                required
              />
              <label htmlFor="time-immediate" className="radio-btn-label">Immediately</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="time-medium" 
                name="timeline" 
                value="1-3 Months" 
                className="radio-input"
                checked={formData.timeline === "1-3 Months"}
                onChange={handleChange}
              />
              <label htmlFor="time-medium" className="radio-btn-label">1-3 Months</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="time-long" 
                name="timeline" 
                value="6+ Months" 
                className="radio-input"
                checked={formData.timeline === "6+ Months"}
                onChange={handleChange}
              />
              <label htmlFor="time-long" className="radio-btn-label">6+ Months</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Funding Status</label>
          <select 
            name="fundingStatus" 
            className="filter-select" 
            required
            value={formData.fundingStatus}
            onChange={handleChange}
          >
            <option value="">Select funding status...</option>
            <option value="Cash Buyer">Cash Buyer</option>
            <option value="Requires Mortgage (KPR)">Requires Mortgage (KPR)</option>
            <option value="Subject to selling another property">Subject to selling another asset</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-full" 
          style={{ marginTop: "24px" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Confirming Booking..." : "Confirm & Send WhatsApp Request"}
        </button>
      </form>
    </div>
  );
}
