import React, { useEffect, useState } from "react";
import { approveBooking, getBookings } from "../utils/storage";

export default function ShowingApproval({ bookingId, onNavigate }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      // Approve booking and get updated record
      const updated = approveBooking(bookingId);
      if (updated) {
        setBooking(updated);
      } else {
        // Fallback search in case it was already approved
        const list = getBookings();
        const found = list.find(b => b.id === bookingId);
        if (found) setBooking(found);
      }
    }
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="approval-view">
        <p style={{ color: "var(--text-secondary)" }}>Verifying appointment details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="approval-view">
        <div className="approval-icon-error">✗</div>
        <div className="approval-title">
          <h2>Showing Request Not Found</h2>
        </div>
        <p className="approval-subtitle">
          The showing appointment ID might be invalid or has been deleted.
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate("")}>
          Go to Showcase
        </button>
      </div>
    );
  }

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const readableDate = new Date(booking.date).toLocaleDateString("id-ID", dateOptions);

  return (
    <div className="approval-view">
      <div className="approval-icon-success">✓</div>
      
      <div className="approval-title">
        <h2>Showing Confirmed</h2>
      </div>
      <p className="approval-subtitle">
        The showing appointment has been marked as <strong>confirmed</strong>. This time slot is now blocked for other clients.
      </p>

      <div className="approval-details-box">
        <div className="detail-row">
          <span className="detail-label">Property</span>
          <span className="detail-val">{booking.propertyTitle}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location</span>
          <span className="detail-val">{booking.propertyLocation}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date & Time</span>
          <span className="detail-val">{readableDate} at {booking.time}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Client Name</span>
          <span className="detail-val">{booking.clientName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">WhatsApp</span>
          <span className="detail-val">{booking.clientPhone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Budget Range</span>
          <span className="detail-val">{booking.budgetRange}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Timeline</span>
          <span className="detail-val">{booking.timeline}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Funding Status</span>
          <span className="detail-val">{booking.fundingStatus}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className="detail-val" style={{ color: "var(--success-color)", textTransform: "uppercase" }}>
            {booking.status}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <button className="btn btn-secondary" onClick={() => onNavigate("")}>
          Go to Showcase
        </button>
        <button className="btn btn-primary" onClick={() => onNavigate("admin")}>
          Go to Admin Panel
        </button>
      </div>
    </div>
  );
}
