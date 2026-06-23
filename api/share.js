// api/share.js

export default function handler(req, res) {
  const { agent, id } = req.query;

  // 1. Fallback default metadata if parameters are missing
  let title = "Realtor | Etalase Properti Dalam 1 Klik";
  let description = "Easy Tool Property Funnel. Buat website portofolio properti personal dan kalender booking inspeksi otomatis untuk broker.";
  let image = "/images/ubud_jungle_villa.png"; 
  let redirectUrl = "/";

  // Mock database properties to retrieve real metadata
  const INITIAL_PROPERTIES_ARDYAN = [
    {
      id: "prop-1",
      title: "Villa Satori - Jungle Sanctuary",
      price: 650000,
      location: "Ubud",
      bedrooms: 3,
      bathrooms: 3,
      description: "An architectural masterpiece nestled in the lush jungles of Ubud. Featuring an infinity pool overlooking the river valley, open-plan tropical living spaces, and premium teak wood finishes. Designed for ultimate tranquility and luxury living.",
      image: "/images/ubud_jungle_villa.png"
    },
    {
      id: "prop-2",
      title: "Villa Oasis - Surfside Modernist",
      price: 850000,
      location: "Canggu",
      bedrooms: 4,
      bathrooms: 4,
      description: "Located just steps from Canggu's famous surf breaks, Villa Oasis combines tropical modernism with sleek concrete and glass architecture. Features a 15-meter lap pool, rooftop sunset deck, smart home automation, and fully staffed service.",
      image: "/images/canggu_beach_villa.png"
    },
    {
      id: "prop-3",
      title: "Villa Zenith - Cliffside Pavilion",
      price: 1850000,
      location: "Uluwatu",
      bedrooms: 5,
      bathrooms: 6,
      description: "Perched majestically on the cliffs of Uluwatu, Villa Zenith offers dramatic, unobstructed Indian Ocean views. Boasting a cantilevered glass-edge pool, private cinema, wine cellar, and direct private beach access. The pinnacle of Bali luxury.",
      image: "/images/uluwatu_cliff_villa.png"
    }
  ];

  const INITIAL_PROPERTIES_ANNA = [
    {
      id: "prop-anna-1",
      title: "Sudirman Suites Penthouse",
      price: 1250000,
      location: "Sudirman, Jakarta Pusat",
      bedrooms: 3,
      bathrooms: 3.5,
      description: "Experience sky-high luxury in the heart of Jakarta's financial district. This stunning duplex penthouse offers panoramic skyline views, private elevator access, double-height ceilings, and custom Italian marble finishes. The pinnacle of urban sophistication.",
      image: "/images/jakarta_apartment_skyline.png"
    },
    {
      id: "prop-anna-2",
      title: "Senopati Residence Loft",
      price: 850000,
      location: "Senopati, Jakarta Selatan",
      bedrooms: 2,
      bathrooms: 2,
      description: "A rare chic loft in the most desirable neighborhood of Senopati. Featuring industrial-modern aesthetics, double-height windows, custom solid oak cabinetry, and state-of-the-art kitchen appliances. Surrounded by Jakarta's finest dining and nightlife.",
      image: "/images/senopati_loft_interior.png"
    }
  ];

  let foundProperty = null;
  let agentName = "Realtor";

  if (agent === "ardyan") {
    foundProperty = INITIAL_PROPERTIES_ARDYAN.find(p => p.id === id);
    agentName = "Ardyan";
  } else if (agent === "anna") {
    foundProperty = INITIAL_PROPERTIES_ANNA.find(p => p.id === id);
    agentName = "Anna";
  }

  const host = req.headers.host || "realtor.web.id";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const baseUrl = `${protocol}://${host}`;

  if (foundProperty) {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(foundProperty.price) + " USD";

    title = `${foundProperty.title} | Realtor - ${agentName}`;
    description = `${foundProperty.location} • ${foundProperty.bedrooms} Bed / ${foundProperty.bathrooms} Bath • ${formattedPrice}. ${foundProperty.description.substring(0, 150)}...`;
    image = foundProperty.image;
    redirectUrl = `/?agent=${agent}&view=property-detail&id=${id}`;
  } else if (agent) {
    redirectUrl = `/?agent=${agent}`;
  }

  // Ensure absolute image URL for crawlers
  const absoluteImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;
  const absoluteRedirectUrl = `${baseUrl}${redirectUrl}`;

  // Serve HTML with Meta OG headers and client-side redirect
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}/api/share?agent=${agent || ''}&id=${id || ''}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${absoluteImageUrl}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${baseUrl}/api/share?agent=${agent || ''}&id=${id || ''}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${absoluteImageUrl}">

  <!-- Redirect to the client side app -->
  <meta http-equiv="refresh" content="0;url=${absoluteRedirectUrl}">
  <script>
    window.location.href = "${absoluteRedirectUrl}";
  </script>
</head>
<body>
  <p>Redirecting to listing details...</p>
</body>
</html>`);
}
