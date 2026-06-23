// Default properties for Ardyan (bali-luxury-properties)
const INITIAL_PROPERTIES_ARDYAN = [
  {
    id: "prop-1",
    title: "Villa Satori - Jungle Sanctuary",
    price: 650000,
    location: "Ubud",
    bedrooms: 3,
    bathrooms: 3,
    description: "An architectural masterpiece nestled in the lush jungles of Ubud. Featuring an infinity pool overlooking the river valley, open-plan tropical living spaces, and premium teak wood finishes. Designed for ultimate tranquility and luxury living.",
    image: "/images/ubud_jungle_villa.png",
    status: "Available",
    type: "Sale",
    landSize: 450,
    buildingSize: 320,
    ownership: "Leasehold 28 Years",
    yearBuilt: 2023,
    amenities: ["Infinity Pool", "Teak Wood Furnishings", "Fully Equipped Kitchen", "Riverside View", "Outdoor Bath"],
    nearby: ["10 mins to Ubud Center", "15 mins to Monkey Forest", "Walking distance to organic cafes"]
  },
  {
    id: "prop-2",
    title: "Villa Oasis - Surfside Modernist",
    price: 850000,
    location: "Canggu",
    bedrooms: 4,
    bathrooms: 4,
    description: "Located just steps from Canggu's famous surf breaks, Villa Oasis combines tropical modernism with sleek concrete and glass architecture. Features a 15-meter lap pool, rooftop sunset deck, smart home automation, and fully staffed service.",
    image: "/images/canggu_beach_villa.png",
    status: "Available",
    type: "Sale",
    landSize: 380,
    buildingSize: 290,
    ownership: "Freehold (SHM)",
    yearBuilt: 2024,
    amenities: ["15m Swimming Pool", "Rooftop Sunset Deck", "Smart Home Sound System", "Staff Quarters", "Private Parking"],
    nearby: ["2 mins to Canggu Beach", "5 mins to Finns Beach Club", "10 mins to Montessori School"]
  },
  {
    id: "prop-3",
    title: "Villa Zenith - Cliffside Pavilion",
    price: 1850000,
    location: "Uluwatu",
    bedrooms: 5,
    bathrooms: 6,
    description: "Perched majestically on the cliffs of Uluwatu, Villa Zenith offers dramatic, unobstructed Indian Ocean views. Boasting a cantilevered glass-edge pool, private cinema, wine cellar, and direct private beach access. The pinnacle of Bali luxury.",
    image: "/images/uluwatu_cliff_villa.png",
    status: "Under Offer",
    type: "Sale",
    landSize: 600,
    buildingSize: 480,
    ownership: "Freehold (SHM)",
    yearBuilt: 2024,
    amenities: ["Cantilevered Glass Pool", "Private Home Cinema", "Wine Cellar", "Private Gym", "Ocean-Edge Cliff View"],
    nearby: ["Direct Private Beach Access", "10 mins to Savaya Bali", "15 mins to Uluwatu Temple"]
  }
];

// Default properties for Anna (jakarta-apartment-specialist)
const INITIAL_PROPERTIES_ANNA = [
  {
    id: "prop-anna-1",
    title: "Sudirman Suites Penthouse",
    price: 1250000,
    location: "Sudirman, Jakarta Pusat",
    bedrooms: 3,
    bathrooms: 3.5,
    description: "Experience sky-high luxury in the heart of Jakarta's financial district. This stunning duplex penthouse offers panoramic skyline views, private elevator access, double-height ceilings, and custom Italian marble finishes. The pinnacle of urban sophistication.",
    image: "/images/jakarta_apartment_skyline.png",
    status: "Available",
    type: "Sale",
    landSize: 0,
    buildingSize: 280,
    ownership: "Strata Title (HGB)",
    yearBuilt: 2023,
    amenities: ["Private Elevator", "24/7 Concierge", "Sky Lounge Access", "Infinity Pool", "Private Wine Cellar", "Smart Home System"],
    nearby: ["Walking distance to MRT Station", "5 mins to Grand Indonesia", "Direct access to Sudirman office towers"]
  },
  {
    id: "prop-anna-2",
    title: "Senopati Residence Loft",
    price: 850000,
    location: "Senopati, Jakarta Selatan",
    bedrooms: 2,
    bathrooms: 2,
    description: "A rare chic loft in the most desirable neighborhood of Senopati. Featuring industrial-modern aesthetics, double-height windows, custom solid oak cabinetry, and state-of-the-art kitchen appliances. Surrounded by Jakarta's finest dining and nightlife.",
    image: "/images/senopati_loft_interior.png",
    status: "Available",
    type: "Sale",
    landSize: 0,
    buildingSize: 150,
    ownership: "Strata Title (HGB)",
    yearBuilt: 2022,
    amenities: ["24/7 Security", "Private Gym", "Fitted Kitchen", "Co-working Space", "Balcony", "Private Parking"],
    nearby: ["Steps to Senopati culinary hub", "5 mins to SCBD", "10 mins to Pacific Place Mall"]
  }
];

// Templates for newly registered agents
const getTemplateProperties = (agentName) => [
  {
    id: `prop-temp-1-${Date.now()}`,
    title: `Ocean Vista Pavilion by ${agentName}`,
    price: 920000,
    location: "Uluwatu",
    bedrooms: 3,
    bathrooms: 3.5,
    description: "An architectural marvel perched high on the cliffs, offering unobstructed panoramic views of the ocean. Features contemporary minimalist design, seamless indoor-outdoor transitions, and a private infinity pool.",
    image: "/images/uluwatu_cliff_villa.png",
    status: "Available",
    type: "Sale",
    landSize: 500,
    buildingSize: 380,
    ownership: "Freehold",
    yearBuilt: 2024,
    amenities: ["Ocean View Infinity Pool", "Smart Home Automation", "Designer Kitchen", "Private Spa Room"],
    nearby: ["5 mins to Uluwatu Beach", "10 mins to Single Fin", "Near premium dining spots"]
  },
  {
    id: `prop-temp-2-${Date.now()}`,
    title: `Jungle Retreat Cabin by ${agentName}`,
    price: 480000,
    location: "Ubud",
    bedrooms: 2,
    bathrooms: 2,
    description: "Immerse yourself in nature with this elegant eco-luxury cabin. Handcrafted with local sustainable materials, featuring a private pool overlooking the forest canopy, open air bath, and a peaceful yoga deck.",
    image: "/images/ubud_jungle_villa.png",
    status: "Available",
    type: "Sale",
    landSize: 350,
    buildingSize: 220,
    ownership: "Leasehold 25 Years",
    yearBuilt: 2023,
    amenities: ["Jungle Canopy View Pool", "Eco-friendly Materials", "Outdoor Stone Bath", "Yoga Deck"],
    nearby: ["12 mins to Ubud Center", "Walking distance to jungle hiking trails"]
  }
];

// Helper to determine the active agent from subdomain or query parameter
export const getActiveAgentId = () => {
  const hostname = window.location.hostname;
  const searchParams = new URLSearchParams(window.location.search);
  
  // 1. Check for ?agent= query param (best for localhost testing)
  const agentParam = searchParams.get("agent");
  if (agentParam) return agentParam.toLowerCase();
  
  // 2. Check for subdomain (e.g., budi.realtor.web.id)
  const parts = hostname.split(".");
  // If subdomain exists on realtor.web.id (which has 3 parts), parts length will be 4 or more
  // E.g., budi.realtor.web.id -> parts is ["budi", "realtor", "web", "id"]
  if (hostname.endsWith("realtor.web.id") && parts.length > 3) {
    if (parts[0] !== "www") {
      return parts[0].toLowerCase();
    }
  }
  
  // Also check generic subdomain structure for other environments (excluding localhost / ip / vercel.app)
  if (
    hostname !== "localhost" && 
    hostname !== "127.0.0.1" && 
    !hostname.endsWith("vercel.app") &&
    parts.length > 2 && 
    parts[0] !== "www"
  ) {
    return parts[0].toLowerCase();
  }
  
  return null; // Show SaaS Landing Page
};

// Check if an agent is registered
export const isAgentRegistered = (agentId) => {
  if (agentId === "ardyan" || agentId === "anna") return true;
  const registered = localStorage.getItem("registered_agents");
  const list = registered ? JSON.parse(registered) : [];
  return list.includes(agentId);
};

// Register a new agent and set up their mock properties
export const registerAgent = ({ id, name, title, phone, adminPin }) => {
  const normalizedId = id.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
  
  // Save credentials/config
  const config = {
    realtorName: name,
    realtorTitle: title || "Independent Broker",
    realtorPhone: phone.replace(/[^0-9]/g, ""),
    adminPin: adminPin || "1234",
    createdAt: new Date().toISOString(),
    instagram: "",
    youtube: "",
    tiktok: "",
    linkedin: ""
  };
  localStorage.setItem(`realtor_config_${normalizedId}`, JSON.stringify(config));
  
  // Initialize with templates
  const templates = getTemplateProperties(name);
  localStorage.setItem(`properties_${normalizedId}`, JSON.stringify(templates));
  localStorage.setItem(`bookings_${normalizedId}`, JSON.stringify([]));

  // Add to registered list
  const registered = localStorage.getItem("registered_agents");
  const list = registered ? JSON.parse(registered) : [];
  if (!list.includes(normalizedId)) {
    list.push(normalizedId);
    localStorage.setItem("registered_agents", JSON.stringify(list));
  }

  return normalizedId;
};

// Load realtor configuration
export const getRealtorConfig = () => {
  const agentId = getActiveAgentId();
  if (!agentId) return null;

  const key = `realtor_config_${agentId}`;
  const config = localStorage.getItem(key);
  if (!config) {
    // If agent is ardyan, auto initialize
    if (agentId === "ardyan") {
      const ardyanConfig = {
        realtorName: "Ardyan",
        realtorTitle: "Bali Luxury Properties",
        realtorPhone: "6281289653355",
        adminPin: "0202",
        createdAt: new Date().toISOString(),
        instagram: "https://instagram.com/ardyan.bali",
        youtube: "https://youtube.com/@ardyan.luxury",
        tiktok: "https://tiktok.com/@ardyan.realtor",
        linkedin: "https://linkedin.com/in/ardyan-realtor"
      };
      localStorage.setItem(key, JSON.stringify(ardyanConfig));
      return ardyanConfig;
    }
    
    // If agent is anna, auto initialize
    if (agentId === "anna") {
      const annaConfig = {
        realtorName: "Anna",
        realtorTitle: "Jakarta Apartment Specialist",
        realtorPhone: "6281289653355", // User phone for demo bookings
        adminPin: "1234",
        createdAt: new Date().toISOString(),
        instagram: "https://instagram.com/anna.apartments",
        youtube: "",
        tiktok: "",
        linkedin: "https://linkedin.com/in/anna-apartment-jakarta"
      };
      localStorage.setItem(key, JSON.stringify(annaConfig));
      return annaConfig;
    }
    
    // Otherwise fallback/default config
    const fallback = {
      realtorName: agentId.toUpperCase(),
      realtorTitle: "Independent Broker",
      realtorPhone: "6281234567890",
      adminPin: "1234",
      createdAt: new Date().toISOString(),
      instagram: "",
      youtube: "",
      tiktok: "",
      linkedin: ""
    };
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  
  const parsed = JSON.parse(config);
  // Ensure backward compatibility for createdAt and social media keys
  let updated = false;
  if (!parsed.createdAt) {
    parsed.createdAt = new Date().toISOString();
    updated = true;
  }
  if (parsed.instagram === undefined) {
    parsed.instagram = parsed.realtorName === "Ardyan" ? "https://instagram.com/ardyan.bali" : "";
    parsed.youtube = parsed.realtorName === "Ardyan" ? "https://youtube.com/@ardyan.luxury" : "";
    parsed.tiktok = parsed.realtorName === "Ardyan" ? "https://tiktok.com/@ardyan.realtor" : "";
    parsed.linkedin = parsed.realtorName === "Ardyan" ? "https://linkedin.com/in/ardyan-realtor" : "";
    updated = true;
  }
  
  if (updated) {
    localStorage.setItem(key, JSON.stringify(parsed));
  }
  return parsed;
};

// Get listings for the active tenant
export const getProperties = () => {
  const agentId = getActiveAgentId();
  if (!agentId) return [];

  const key = `properties_${agentId}`;
  const props = localStorage.getItem(key);
  if (!props) {
    if (agentId === "ardyan") {
      localStorage.setItem(key, JSON.stringify(INITIAL_PROPERTIES_ARDYAN));
      return INITIAL_PROPERTIES_ARDYAN;
    }
    if (agentId === "anna") {
      localStorage.setItem(key, JSON.stringify(INITIAL_PROPERTIES_ANNA));
      return INITIAL_PROPERTIES_ANNA;
    }
    const templates = getTemplateProperties(agentId.toUpperCase());
    localStorage.setItem(key, JSON.stringify(templates));
    return templates;
  }
  
  const parsed = JSON.parse(props);
  // Ensure backward compatibility by injecting default specifications if missing
  let updated = false;
  const cleaned = parsed.map(p => {
    if (p.landSize === undefined) {
      p.landSize = p.bedrooms * 100 + 50;
      p.buildingSize = p.bedrooms * 80;
      p.ownership = p.location === "Ubud" ? "Leasehold 25 Years" : "Freehold (SHM)";
      p.yearBuilt = 2023;
      p.amenities = ["Private Swimming Pool", "Fully Equipped Kitchen", "Furnished Living Room", "Carport"];
      p.nearby = ["Dekat akses jalan utama", "10 menit ke area komersil"];
      updated = true;
    }
    return p;
  });
  if (updated) {
    localStorage.setItem(key, JSON.stringify(cleaned));
  }
  return cleaned;
};

export const saveProperties = (properties) => {
  const agentId = getActiveAgentId();
  if (!agentId) return;
  localStorage.setItem(`properties_${agentId}`, JSON.stringify(properties));
};

export const saveProperty = (property) => {
  const properties = getProperties();
  if (property.id) {
    const index = properties.findIndex(p => p.id === property.id);
    if (index !== -1) {
      properties[index] = property;
    }
  } else {
    property.id = "prop-" + Date.now();
    properties.push(property);
  }
  saveProperties(properties);
  return property;
};

export const deleteProperty = (id) => {
  const properties = getProperties();
  const filtered = properties.filter(p => p.id !== id);
  saveProperties(filtered);
};

// Get showings bookings for the active tenant
export const getBookings = () => {
  const agentId = getActiveAgentId();
  if (!agentId) return [];
  const bookings = localStorage.getItem(`bookings_${agentId}`);
  return bookings ? JSON.parse(bookings) : [];
};

export const saveBooking = (booking) => {
  const agentId = getActiveAgentId();
  if (!agentId) return null;
  const bookings = getBookings();
  const newBooking = {
    id: "book-" + Date.now(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...booking
  };
  bookings.push(newBooking);
  localStorage.setItem(`bookings_${agentId}`, JSON.stringify(bookings));
  return newBooking;
};

export const approveBooking = (id) => {
  const agentId = getActiveAgentId();
  if (!agentId) return null;
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = "confirmed";
    localStorage.setItem(`bookings_${agentId}`, JSON.stringify(bookings));
    return bookings[index];
  }
  return null;
};
