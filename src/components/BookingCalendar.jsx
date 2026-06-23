import React, { useState, useEffect } from "react";
import BookingPreScreen from "./BookingPreScreen";
import { getBookings, saveBooking, getRealtorConfig } from "../utils/storage";

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

export default function BookingCalendar({ property, onBack }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    budgetRange: "",
    timeline: "",
    fundingStatus: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Set default min date to today
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Fetch all bookings to block confirmed slots
    setConfirmedBookings(getBookings());
  }, [selectedDate]);

  // Determine if a slot is blocked
  const isSlotBlocked = (timeSlot) => {
    if (!selectedDate) return true;
    return confirmedBookings.some(
      b => b.propertyId === property.id && 
           b.date === selectedDate && 
           b.time === timeSlot && 
           b.status === "confirmed"
    );
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }

    // 1. Save booking in pending state
    const bookingDetails = {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      date: selectedDate,
      time: selectedTime,
      ...formData
    };

    const saved = saveBooking(bookingDetails);

    // 2. Format WhatsApp text
    const config = getRealtorConfig();
    const activeDomain = window.location.origin;
    const approvalLink = `${activeDomain}/?view=approve-showing&id=${saved.id}`;

    // Format readable date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const readableDate = new Date(selectedDate).toLocaleDateString("id-ID", dateOptions);

    const waMessage = `Halo ${config.realtorName}! Saya ingin janjian showing untuk properti *${property.title}*.

Jadwal: ${readableDate}, Jam ${selectedTime}
Nama Klien: ${formData.clientName}
WhatsApp: ${formData.clientPhone}
Budget: ${formData.budgetRange}
Timeline: ${formData.timeline}
Funding: ${formData.fundingStatus}

Klik link ini untuk approve janjian:
${approvalLink}`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${config.realtorPhone}?text=${encodedMessage}`;

    // 3. Open WhatsApp link
    window.open(waUrl, "_blank");

    // 4. Set Success Screen
    setBookingSuccess(saved);
  };

  if (bookingSuccess) {
    return (
      <div className="booking-view" style={{ maxWidth: "700px", margin: "40px auto", textAlign: "center" }}>
        <div className="approval-icon-success">✓</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "16px" }}>Showing Scheduled!</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
          We have generated your showing request and redirected you to WhatsApp to send the details to the Realtor. 
          Once the Realtor approves the request, this slot will be officially booked.
        </p>

        <div className="approval-details-box" style={{ textAlign: "left", marginBottom: "30px" }}>
          <div className="detail-row">
            <span className="detail-label">Property</span>
            <span className="detail-val">{property.title}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date & Time</span>
            <span className="detail-val">{selectedDate} at {selectedTime}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Realtor Name</span>
            <span className="detail-val">{getRealtorConfig().realtorName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-val" style={{ color: "var(--accent-gold)" }}>Pending Realtor Approval</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={onBack}>
            Back to Showcase
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              const config = getRealtorConfig();
              const activeDomain = window.location.origin;
              const approvalLink = `${activeDomain}/?view=approve-showing&id=${bookingSuccess.id}`;
              const readableDate = new Date(selectedDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              const waMessage = `Halo ${config.realtorName}! Saya ingin janjian showing untuk properti *${property.title}*.\n\nJadwal: ${readableDate}, Jam ${selectedTime}\nNama Klien: ${formData.clientName}\nWhatsApp: ${formData.clientPhone}\nBudget: ${formData.budgetRange}\nTimeline: ${formData.timeline}\nFunding: ${formData.fundingStatus}\n\nKlik link ini untuk approve janjian:\n${approvalLink}`;
              window.open(`https://wa.me/${config.realtorPhone}?text=${encodeURIComponent(waMessage)}`, "_blank");
            }}
          >
            Resend WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-view">
      <button className="booking-back-link" onClick={onBack}>
        ← Back to Listings
      </button>

      <div className="booking-header">
        <div className="booking-prop-info">
          {property.image && (
            <img src={property.image} alt={property.title} className="booking-prop-img" onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
            }} />
          )}
          <div className="booking-prop-details">
            <h2>Book a Showing</h2>
            <p className="booking-prop-price">{property.title} • {property.location}</p>
          </div>
        </div>
      </div>

      <div className="booking-layout">
        {/* Left Side: Calendar & Time Slots */}
        <div className="calendar-section">
          <div className="datepicker-wrapper">
            <label className="form-label" style={{ marginBottom: "10px" }}>1. Select Date</label>
            <input 
              type="date" 
              className="custom-date-picker" 
              min={todayStr}
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          {selectedDate && (
            <div>
              <label className="form-label" style={{ marginBottom: "10px" }}>2. Select Available Time Slot</label>
              <div className="slots-grid">
                {TIME_SLOTS.map(slot => {
                  const blocked = isSlotBlocked(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={blocked}
                      className={`slot-btn ${selectedTime === slot ? "active" : ""}`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                * Strikethrough slots are already booked and confirmed by the agent.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Intake Pre-Screening Form */}
        {selectedDate && selectedTime ? (
          <BookingPreScreen 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleBookingSubmit}
            isSubmitting={false}
          />
        ) : (
          <div className="intake-section" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
            <p style={{ color: "var(--text-muted)", textAlign: "center", fontStyle: "italic" }}>
              Please select a date and time slot to unlock the pre-screening questionnaire.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
