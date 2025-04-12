// Destinations constants
export const DESTINATIONS = [
  { value: "goa", label: "Goa, India" },
  { value: "kerala", label: "Kerala, India" },
  { value: "rajasthan", label: "Rajasthan, India" },
  { value: "hampi", label: "Hampi, India" },
  { value: "pondicherry", label: "Pondicherry, India" },
  { value: "gokarna", label: "Gokarna, India" },
  { value: "kanyakumari", label: "Kanyakumari, India" },
  { value: "varanasi", label: "Varanasi, India" },
];

// Best time to visit information
export const BEST_TIME_INFO = {
  goa: {
    best: "November to February",
    avgTemp: "29°C (84°F)",
    beach: "October to March",
    rainy: "June to September"
  },
  kerala: {
    best: "September to March",
    avgTemp: "28°C (82°F)",
    beach: "October to February",
    rainy: "June to August"
  },
  rajasthan: {
    best: "October to March",
    avgTemp: "25°C (77°F)",
    beach: "N/A",
    rainy: "July to September"
  },
  hampi: {
    best: "October to February",
    avgTemp: "27°C (81°F)",
    beach: "N/A",
    rainy: "June to September"
  },
  pondicherry: {
    best: "October to March",
    avgTemp: "30°C (86°F)",
    beach: "November to February",
    rainy: "October to December"
  },
  gokarna: {
    best: "October to March",
    avgTemp: "28°C (82°F)",
    beach: "November to February",
    rainy: "June to September"
  },
  kanyakumari: {
    best: "October to February",
    avgTemp: "30°C (86°F)",
    beach: "November to February",
    rainy: "June to September"
  },
  varanasi: {
    best: "October to March",
    avgTemp: "25°C (77°F)",
    beach: "N/A",
    rainy: "July to September"
  }
};

// Package types and their variants
export const PACKAGE_TYPES = {
  standard: {
    bgColor: "bg-secondary",
    textColor: "text-white"
  },
  premium: {
    bgColor: "bg-gray-800",
    textColor: "text-white"
  },
  budget: {
    bgColor: "bg-gray-700",
    textColor: "text-white"
  }
};

// Testimonials data
export const TESTIMONIALS = [
  {
    name: "Priya S.",
    trip: "Honeymoon in Goa",
    rating: 5,
    content: "TravelWise made planning our honeymoon to Goa so easy! We compared multiple packages and found one that was perfect for us. The recommendations for the best time to visit the beaches were spot on.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    name: "Rahul M.",
    trip: "Family trip to Rajasthan",
    rating: 4.5,
    content: "As a family of 5, finding the right vacation package is always challenging. TravelWise connected us with an agency that specialized in family trips to Rajasthan. Our desert safari and fort visits were unforgettable!",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg"
  },
  {
    name: "Ananya K.",
    trip: "Solo trip to Kerala",
    rating: 5,
    content: "I was skeptical at first, but TravelWise exceeded my expectations for my Kerala backwater tour. The price comparison feature saved me thousands of rupees, and the travel agency I booked with was incredibly responsive.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

// Features data
export const FEATURES = [
  {
    icon: "thumbs-up",
    title: "Verified Agencies",
    description: "All travel agencies on our platform are thoroughly vetted to ensure quality service.",
    color: "blue"
  },
  {
    icon: "dollar-sign",
    title: "Transparent Pricing",
    description: "See exactly what's included in each package with no hidden fees or surprises.",
    color: "green"
  },
  {
    icon: "calendar-alt",
    title: "Best Time Recommendations",
    description: "Get insights on the best time to visit each destination based on weather and local events.",
    color: "yellow"
  },
  {
    icon: "comments",
    title: "Direct Communication",
    description: "Message travel agencies directly to customize your package or ask questions.",
    color: "indigo"
  },
  {
    icon: "shield-alt",
    title: "Secure Booking",
    description: "Book with confidence knowing your payment and personal information are protected.",
    color: "red"
  },
  {
    icon: "star",
    title: "Verified Reviews",
    description: "Read authentic reviews from travelers who booked through our platform.",
    color: "purple"
  }
];
