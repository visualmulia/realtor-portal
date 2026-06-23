import React, { useState } from "react";
import { registerAgent } from "../utils/storage";

export default function SaaSLandingPage({ onRegisterSuccess }) {
  const [subdomain, setSubdomain] = useState("");
  const [realtorName, setRealtorName] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [adminPin, setAdminPin] = useState("1234");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    const cleanSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!cleanSubdomain) {
      setError("Please enter a valid subdomain name (letters and numbers only).");
      return;
    }

    if (cleanSubdomain === "www" || cleanSubdomain === "admin" || cleanSubdomain === "realtor") {
      setError("This subdomain is reserved. Please try another name.");
      return;
    }

    if (!realtorName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!waNumber.trim() || waNumber.length < 9) {
      setError("Please enter a valid WhatsApp phone number.");
      return;
    }

    if (adminPin.length !== 4 || isNaN(adminPin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }

    // Call registration helper
    try {
      const registeredId = registerAgent({
        id: cleanSubdomain,
        name: realtorName,
        title: "Bali Luxury Realty Partner",
        phone: waNumber,
        adminPin: adminPin
      });

      // Redirect user to the new portfolio
      onRegisterSuccess(registeredId);
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    }
  };

  const scrollToSignUp = () => {
    document.getElementById("signup-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="saas-landing-page">
      {/* Hero Section */}
      <section className="saas-hero">
        <span className="saas-hero-badge">Easy Tool Property Funnel</span>
        <h1 className="saas-hero-title">Sistem Reservasi & Portofolio Otomatis untuk Agen Properti</h1>
        <p className="saas-hero-subtitle">
          Saring calon pembeli palsu (*tire-kickers*) dan kurangi waktu koordinasi manual lewat chat WhatsApp. 
          Dapatkan portofolio listing yang elegan dan sistem booking kalender terintegrasi dalam 10 detik.
        </p>
        <div className="saas-hero-actions">
          <button className="btn btn-primary" onClick={scrollToSignUp}>Buat Sekarang</button>
          <button className="btn btn-secondary" onClick={() => document.getElementById("portfolio-templates-section").scrollIntoView({ behavior: "smooth" })}>Lihat Contoh Portofolio</button>
        </div>
      </section>

      {/* Portfolio Templates Showcase */}
      <section id="portfolio-templates-section" className="saas-templates-showcase">
        <h2 className="saas-section-title">Pilih & Lihat Contoh Portofolio</h2>
        <p className="saas-section-subtitle">
          Kami telah menyiapkan contoh web profil bisnis realtor premium. Klik untuk melihat demo secara langsung.
        </p>

        <div className="templates-grid">
          
          {/* Template 1: Ardyan (Bali Luxury properties) */}
          <div className="template-card">
            <div className="template-image-container">
              <img 
                src="/images/ubud_jungle_villa.png" 
                alt="Bali Luxury Villa Template" 
                className="template-img"
              />
              <span className="template-tag-badge">Villa & Resort</span>
            </div>
            <div className="template-info">
              <span className="template-meta-label">Template 01</span>
              <h3>Ardyan - Bali Luxury Properties</h3>
              <p>
                Sangat cocok untuk broker properti kelas atas di Bali (Ubud, Uluwatu, Canggu). Lengkap dengan visualisasi tropical modern, detail luas tanah & bangunan, tipe kepemilikan (Freehold/Leasehold), dan chat WhatsApp.
              </p>
              <a 
                href="?agent=ardyan" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary btn-full"
                style={{ textAlign: "center", display: "block" }}
              >
                Lihat Web Demo (Bali)
              </a>
            </div>
          </div>

          {/* Template 2: Anna (Jakarta Apartment Specialist) */}
          <div className="template-card">
            <div className="template-image-container">
              <img 
                src="/images/jakarta_apartment_skyline.png" 
                alt="Jakarta Luxury Apartment Template" 
                className="template-img"
              />
              <span className="template-tag-badge">Apartment & Loft</span>
            </div>
            <div className="template-info">
              <span className="template-meta-label">Template 02</span>
              <h3>Anna - Jakarta Apartment Specialist</h3>
              <p>
                Dirancang khusus untuk spesialis apartemen dan penthouse premium perkotaan (Sudirman, Senopati, SCBD). Menampilkan status strata title, detail bangunan, tata letak modern perkotaan, dan scheduling system terintegrasi.
              </p>
              <a 
                href="?agent=anna" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary btn-full"
                style={{ textAlign: "center", display: "block" }}
              >
                Lihat Web Demo (Jakarta)
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features-section" className="saas-features">
        <h2 className="saas-section-title">Mengapa Menggunakan Platform Kami?</h2>
        <p className="saas-section-subtitle">Didesain khusus untuk agensi dan broker real estate kelas atas.</p>

        <div className="saas-features-grid">
          <div className="saas-feature-card">
            <div className="saas-feature-icon">✨</div>
            <h3>Luxury Portfolio Grid</h3>
            <p>Tampilkan portofolio properti Anda dengan layout minimalis-modern. Lengkap dengan status real-time (Available, Under Offer, Sold Out).</p>
          </div>
          <div className="saas-feature-card">
            <div className="saas-feature-icon">📅</div>
            <h3>Smart Booking Calendar</h3>
            <p>Jadwal showing inspeksi terisi secara otomatis. Memblokir jam yang sudah dipesan secara reaktif untuk mencegah double-booking.</p>
          </div>
          <div className="saas-feature-card">
            <div className="saas-feature-icon">📝</div>
            <h3>Lead Pre-Screening</h3>
            <p>Wajibkan klien mengisi kuesioner budget range, jangka waktu pembelian, dan status pendanaan (Cash/KPR) sebelum memilih jadwal.</p>
          </div>
          <div className="saas-feature-card">
            <div className="saas-feature-icon">💬</div>
            <h3>WhatsApp Automation</h3>
            <p>Terima ringkasan data calon pembeli langsung di WhatsApp Anda lengkap dengan tombol tautan sekali klik untuk menyetujui jadwal.</p>
          </div>
        </div>
      </section>

      {/* Registration/Signup Form Section */}
      <section id="signup-section" className="saas-signup-section">
        <div className="saas-signup-card">
          <h2 className="saas-signup-title">Buat Portofolio & Scheduler Anda</h2>
          <p className="saas-signup-subtitle">Masukkan data Anda di bawah untuk mendapatkan link subdomain personal secara instan.</p>
          
          <form onSubmit={handleRegister}>
            {error && <div className="error-message" style={{ marginBottom: "16px", padding: "10px", backgroundColor: "#FDF2F2", border: "1px solid var(--error-color)" }}>{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Subdomain Pilihan Anda *</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ flex: 1, textTransform: "lowercase" }}
                  required
                  placeholder="misal: ardyan"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
                />
                <span style={{ padding: "0 12px", border: "1px solid var(--border-color)", borderLeft: "none", height: "42px", display: "flex", alignItems: "center", backgroundColor: "var(--bg-primary)", fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>
                  .realtor.web.id
                </span>
              </div>
              <span className="form-input-helper">Nama ini akan menjadi URL website portofolio Anda.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Nama Lengkap Realtor *</label>
              <input 
                type="text" 
                className="form-input" 
                required
                placeholder="Nama Anda yang tampil di profil"
                value={realtorName}
                onChange={(e) => setRealtorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor WhatsApp Penerima Notifikasi *</label>
              <input 
                type="tel" 
                className="form-input" 
                required
                placeholder="Contoh: 6281289653355"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value.replace(/[^0-9]/g, ""))}
              />
              <span className="form-input-helper">Gunakan kode negara (misal 62 untuk Indonesia) tanpa tanda + atau spasi.</span>
            </div>

            <div className="form-group">
              <label className="form-label">PIN Admin Baru (4 Digit) *</label>
              <input 
                type="password" 
                className="form-input" 
                maxLength="4"
                required
                placeholder="PIN untuk mengedit properti Anda"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "12px", padding: "14px" }}>
              Buat Website Portofolio Saya
            </button>
          </form>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="saas-pricing">
        <h2 className="saas-section-title">Buat Sekarang Tanpa Ada Biaya</h2>
        <p className="saas-section-subtitle">Nikmati akses penuh tanpa batasan untuk merasakan langsung peningkatan efisiensi bisnis Anda.</p>

        <div style={{ maxWidth: "650px", margin: "0 auto" }}>
          <div className="pricing-card active" style={{ textAlign: "center", alignItems: "center" }}>
            <span className="pricing-badge">100% FREE TRIAL</span>
            <h3>Akses Penuh Selama 14 Hari</h3>
            <p className="price">Rp 0 <span>/ 14 hari pertama</span></p>
            <p className="pricing-desc" style={{ maxWidth: "500px" }}>
              Dapatkan semua fitur premium untuk meluncurkan properti funnel Anda. Gratis untuk memulai, tanpa kartu kredit dan tanpa biaya selama masa uji coba.
            </p>
            
            <ul className="pricing-features-list" style={{ textAlign: "left", display: "inline-flex", flexDirection: "column", width: "100%", maxWidth: "450px", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "24px 0", margin: "20px 0" }}>
              <li>✓ <strong>Unlimited Listings</strong>: Unggah sebanyak mungkin portofolio properti Anda.</li>
              <li>✓ <strong>Smart Pre-Screening Intake</strong>: Saring pembeli palsu dengan kuesioner Budget, Timeline, dan Status Pendanaan.</li>
              <li>✓ <strong>Booking Calendar Otomatis</strong>: Blokir waktu show secara reaktif, anti double-booking.</li>
              <li>✓ <strong>Notifikasi WhatsApp Instan</strong>: Ringkasan detail pembeli dikirim langsung ke WhatsApp agen.</li>
              <li>✓ <strong>Tautan Approval WhatsApp</strong>: Setujui jadwal inspeksi klien langsung lewat tombol di WA.</li>
              <li>✓ <strong>Broker Admin Console</strong>: Dashboard lengkap untuk memantau agenda dan CRUD properti.</li>
              <li>✓ <strong>Subdomain Personal</strong>: Dapatkan link elegan <code>namaanda.realtor.web.id</code>.</li>
            </ul>

            <button className="btn btn-primary btn-full" onClick={scrollToSignUp} style={{ padding: "14px 28px" }}>
              Buat Sekarang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
