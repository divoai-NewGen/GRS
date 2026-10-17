/**
 * Industry-Specific Review & Tag Presets with Dynamic Hourly Rotation
 * Prevents Google duplicate review spam detection by serving fresh,
 * category-relevant review templates every hour.
 */

export interface CategoryPreset {
  name: string;
  tags: string[];
  negativeTags: string[];
  reviews: string[];
}

export const CATEGORY_PRESETS: Record<string, CategoryPreset> = {
  SALON: {
    name: "Salon, Spa & Beauty",
    tags: [
      "Expert Hair Stylist",
      "Courteous Staff",
      "Hygienic & Sanitized",
      "Great Haircut & Beard",
      "Affordable Pricing",
      "Relaxing Ambience",
      "No Waiting Time",
      "Premium Products Used",
      "Custom Hair Styling",
      "Highly Recommended",
    ],
    negativeTags: [
      "Long Wait Time",
      "Haircut Not as Expected",
      "Staff Attitude",
      "Pricing Issue",
      "Hygiene / Cleanliness",
    ],
    reviews: [
      "Best salon experience at {businessName}! The stylist was very attentive, understood exactly what I wanted, and gave me a fantastic haircut. Highly recommend!",
      "Super clean and sanitized setup. The staff is polite, professional, and well-trained. Top notch grooming services!",
      "10/10 service! Great attention to detail during the haircut and beard trim. Definitely my new go-to grooming place.",
      "Loved the calming ambiance and premium hospitality at {businessName}. Very reasonable prices for such high quality work.",
      "Extremely skilled stylists and prompt service with almost zero waiting time. Thoroughly impressed with their work!",
      "Had a wonderful haircut and beard styling session today. Courteous team and clean equipment. Will definitely be coming back!",
      "Professional salon with great hygiene standards. The stylist gave great hair care advice too. Must visit!",
      "Excellent grooming service at fair prices. The staff took proper time and didn't rush through the appointment.",
      "A very relaxing and satisfying visit to {businessName}. Great atmosphere, polite behavior, and flawless haircut!",
      "Modern salon with talented staff. Very happy with the final look. Highly recommended to everyone!",
      "Consistently great service every single time I visit {businessName}. The team is polite, experienced, and very welcoming.",
      "Top-tier salon experience! Clean chairs, sanitized scissors, and courteous staff. Worth every penny.",
      "Got exactly the style I asked for. The stylist was patient and very gentle. Super happy with the result!",
      "Great ambiance, polite hospitality, and skilled barbers. Best salon in the neighborhood by far!",
      "Affordable luxury grooming at its best. Prompt appointment, neat work, and warm customer care.",
    ],
  },

  RESTAURANT: {
    name: "Restaurant & Dining",
    tags: [
      "Delicious Food",
      "Super Fast Service",
      "Courteous Waiters",
      "Cozy Ambience",
      "Fresh & Piping Hot",
      "Value for Money",
      "Great Presentation",
      "Family Friendly",
      "Hygienic Kitchen",
      "Must Try Starters",
    ],
    negativeTags: [
      "Food Taste / Quality",
      "Order Delay",
      "Staff Behavior",
      "High Pricing",
      "Table Cleanliness",
    ],
    reviews: [
      "Amazing food and wonderful hospitality at {businessName}! Every dish was fresh, hot, and full of authentic flavor. A must-visit place!",
      "Great family dining experience. The staff was polite, service was prompt, and the taste was outstanding. Will visit again!",
      "Loved the ambiance and mouth-watering food! Very reasonable pricing for such generous portion sizes and great quality.",
      "10/10 food quality! The starters and main course were both prepared to perfection. Fast and courteous table service.",
      "One of the best dining spots in town! Cozy atmosphere, polite team, and authentic taste that leaves you wanting more.",
      "Super delicious food served with warm smiles. The service was impressively quick even during busy peak hours.",
      "A delightful culinary experience at {businessName}. Fresh ingredients, great hygiene, and courteous staff throughout.",
      "Great food, quick service, and clean family seating. The desserts and main dishes were thoroughly enjoyable!",
      "Exceptional hospitality! The staff recommended great dishes and the food arrived piping hot. Worth every rupee.",
      "Wonderful dining place with friends and family. Pleasant vibes, rich flavors, and very reasonable pricing.",
      "Top quality food with balanced spices and authentic flavors. Prompt service and clean dining area. Highly recommended!",
      "Very satisfying meal today at {businessName}. The staff was attentive and courteous. 5 stars all the way!",
      "Flavorsome food and welcoming hospitality. Everything from appetizers to drinks was spot on!",
      "Great ambiance, courteous staff, and consistently delicious food. One of our favorite family restaurants!",
      "Fresh food, quick service, and courteous staff. Great taste with zero compromise on hygiene.",
    ],
  },

  CAFE: {
    name: "Cafe & Bakery",
    tags: [
      "Great Coffee & Brews",
      "Cozy Aesthetic Vibes",
      "Fresh Bakery Items",
      "Quick Friendly Service",
      "Peaceful Work Setup",
      "Reasonable Prices",
      "Delicious Snacks",
      "Polite Staff",
      "Clean & Hygienic",
      "Must Visit Spot",
    ],
    negativeTags: [
      "Coffee / Food Quality",
      "Slow Service",
      "Staff Behavior",
      "Noisy / Crowded",
      "High Prices",
    ],
    reviews: [
      "Loved the cozy aesthetic vibes and delicious coffee at {businessName}! Perfect place to chill with friends or get work done.",
      "Super fresh snacks and aromatic brews. Staff is courteous, smiling, and quick with orders. Highly recommended!",
      "A hidden gem! Great coffee, tasty baked goods, and a soothing atmosphere. Definitely coming back soon.",
      "10/10 cafe experience! Polite team, comfortable seating, and rich, flavorsome beverages at fair prices.",
      "Charming little spot with top-notch coffee and delicious light bites. Fast Wi-Fi and pleasant background music.",
      "Great ambiance paired with mouth-watering treats. The team at {businessName} makes you feel right at home!",
      "Clean, aesthetic, and welcoming. Their specialty brews and desserts are absolute perfection.",
      "Very peaceful spot with courteous staff. Coffee was brewed just right and served piping hot. 5 stars!",
      "Loved everything about this cafe! Cozy seating, polite service, and delicious food that hits the spot.",
      "Top quality coffee and warm hospitality. The staff is polite and service is super prompt.",
      "Super cozy vibes and delicious pastries! The perfect spot for an afternoon coffee break.",
      "Wonderful cafe experience. Great coffee aroma, hygienic seating, and reasonable prices.",
      "Loved the relaxed ambiance and courteous service. Coffee and bites were both top tier!",
      "Great hangout place with friends. Fast service, aesthetic decor, and delicious food items.",
      "Consistently delicious brews and courteous staff. Highly recommended to all coffee lovers!",
    ],
  },

  HOTEL: {
    name: "Hotel, Resort & Stay",
    tags: [
      "Spacious Clean Rooms",
      "Helpful Front Desk",
      "Prime Location",
      "Prompt Room Service",
      "Comfortable Bedding",
      "Safe & Peaceful",
      "Hygienic Bathrooms",
      "Tasty Breakfast",
      "Fast Check-in",
      "Highly Recommended",
    ],
    negativeTags: [
      "Room Cleanliness",
      "Slow Room Service",
      "Check-in Delays",
      "Staff Behavior",
      "Amenities Missing",
    ],
    reviews: [
      "Had a very comfortable stay at {businessName}! The rooms were spotless, check-in was smooth, and the staff was super helpful.",
      "Excellent hospitality and prime location. Room service was fast and courteous. Will definitely stay here again!",
      "10/10 stay! Clean linen, comfortable beds, and very polite reception staff. Great value for money.",
      "Safe, peaceful, and extremely well-maintained property. The staff went out of their way to ensure a hassle-free stay.",
      "Smooth check-in, spacious rooms, and delicious food. Overall a very pleasant and memorable hospitality experience.",
      "Top notch hygiene and courteous staff. Everything from room service to housekeeping was prompt and polite.",
      "Superb stay experience! Prime location close to all main hubs, with clean rooms and courteous front desk team.",
      "Very hospitable management and peaceful stay. Room was modern, airy, and equipped with all essentials.",
      "A wonderful experience staying at {businessName}. Professional staff, prompt room service, and great hygiene.",
      "Clean, comfortable, and budget-friendly stay. Housekeeping team was efficient and polite throughout our visit.",
      "Great property for both business trips and family stays. Courteous staff, clean bathrooms, and quiet rooms.",
      "Highly recommended hotel! Smooth booking process, courteous staff, and very comfortable amenities.",
      "Spotless rooms and prompt room service. The staff at {businessName} made us feel warmly welcomed.",
      "Very pleasant stay. The front desk was cooperative and assisted with all our requests promptly.",
      "Affordable luxury with great hospitality! Peaceful nights, clean bedding, and polite staff.",
    ],
  },

  CLINIC: {
    name: "Clinic, Hospital & Healthcare",
    tags: [
      "Caring Doctor",
      "Polite Nursing Staff",
      "Clean & Sanitized Clinic",
      "Accurate Diagnosis",
      "Minimal Waiting Time",
      "Patient Explanation",
      "Modern Equipment",
      "Affordable Consultation",
      "Smooth Appointment",
      "Highly Trusted",
    ],
    negativeTags: [
      "Long Waiting Time",
      "Doctor Rush / Inattention",
      "Staff Behavior",
      "Consultation Charges",
      "Cleanliness Issue",
    ],
    reviews: [
      "Very compassionate and knowledgeable doctor at {businessName}. Listened patiently, explained the diagnosis clearly, and suggested effective treatment.",
      "Clean, hygienic clinic with polite support staff. The appointment was on time and the doctor took genuine care.",
      "10/10 medical care! Accurate diagnosis and reassuring consultation. Extremely satisfied with the treatment.",
      "Professional clinic with modern equipment. Staff was courteous and the doctor answered all our questions patiently.",
      "Felt very comfortable and well taken care of. The doctor is very experienced and gives honest medical guidance.",
      "Prompt consultation with minimal wait time. Neat and sanitized clinic environment. Highly recommended!",
      "The doctor's friendly approach and thorough examination gave us complete peace of mind. Excellent clinic!",
      "Affordable consultation and genuinely caring staff. Great follow-up and patient care throughout.",
      "One of the most trusted clinics in the city. Professional doctors, hygienic premises, and polite staff.",
      "Exceptional care and clear explanations. Very happy with the medical advice and recovery progress.",
      "Compassionate doctor and supportive staff. Clean waiting area and well-organized appointments.",
      "Very gentle and professional doctor. Addressed every concern patiently without rushing through.",
      "Highly recommended for anyone seeking dependable medical advice. Polite staff and accurate treatment.",
      "Top hygiene standards and caring medical staff. Very pleasant consultation experience at {businessName}.",
      "Accurate diagnosis and quick recovery with the prescribed treatment. Immensely thankful to the doctor and team!",
    ],
  },

  DENTIST: {
    name: "Dental Clinic",
    tags: [
      "Painless Treatment",
      "Gentle Dentist",
      "Sanitized Dental Tools",
      "Transparent Pricing",
      "Detailed Explanation",
      "Polite Staff",
      "Modern Clinic Setup",
      "Minimal Waiting Time",
      "Great Follow-up Care",
      "Highly Recommended",
    ],
    negativeTags: [
      "Pain / Discomfort",
      "Waiting Time",
      "High Charges",
      "Staff Behavior",
      "Hygiene Issue",
    ],
    reviews: [
      "Completely painless dental treatment at {businessName}! The dentist was gentle, patient, and explained every step beforehand.",
      "Spotless, modern dental clinic. Very courteous staff and the dentist made me feel completely relaxed during the procedure.",
      "10/10 dental care! The doctor handled my dental issue with great expertise and care. Highly recommended!",
      "Sanitized instruments, advanced equipment, and very polite team. The treatment was quick and virtually painless.",
      "Best dental clinic in the area. Transparent consultation, reasonable charges, and caring dental team.",
      "I was nervous about the procedure, but the dentist was so gentle and reassuring. Excellent experience!",
      "Professional dental service with great post-treatment guidance. Very clean clinic and polite assistants.",
      "Had a root canal / cleaning done smoothly with zero discomfort. Doctor is extremely skilled and humble.",
      "Friendly environment and top-tier dental hygiene. The doctor took time to explain proper oral care tips.",
      "Very happy with my dental treatment result. Prompt appointment, courteous behavior, and reasonable fees.",
      "Gentle hands and high precision treatment. The best dental experience I have had so far!",
      "Modern clinic with sanitized chairs and advanced technology. The dentist is very patient and polite.",
      "Prompt service, painless procedure, and transparent pricing. 5 stars for the wonderful dental team!",
      "Thorough dental check-up and honest treatment plan without unnecessary procedures. Highly trustworthy!",
      "Clean, welcoming, and painless. Will definitely recommend {businessName} to all friends and family!",
    ],
  },

  GYM: {
    name: "Gym & Fitness Center",
    tags: [
      "Certified Trainers",
      "Modern Workout Machines",
      "High Energy Vibe",
      "Clean & Sanitized",
      "Spacious Workout Floor",
      "Helpful Guidance",
      "Great Community",
      "Reasonable Membership",
      "AC & Music Setup",
      "Goal Oriented Results",
    ],
    negativeTags: [
      "Equipment Maintenance",
      "Overcrowded Floor",
      "Trainer Inattention",
      "Cleanliness Issue",
      "AC / Ventilation Issue",
    ],
    reviews: [
      "Best gym in the area! Modern equipment, high energy music, and certified trainers who guide you at every step.",
      "Clean, well-ventilated, and spacious fitness floor. The trainers are motivating and design personalized workout routines.",
      "10/10 workout environment at {businessName}! Great community vibe, clean locker rooms, and well-maintained machines.",
      "Very supportive trainers and friendly management. Seeing great fitness progress within just a few weeks!",
      "Top quality fitness center with heavy weights, cardio section, and functional training zone. Highly recommended!",
      "Great value gym membership with premium machines. The trainers pay attention to form and prevent injuries.",
      "Super hygienic gym with regular sanitization of dumbbells and machines. High energy vibe that keeps you motivated!",
      "Awesome place to crush your fitness goals. Spacious floor, polite staff, and positive workout atmosphere.",
      "Dedicated personal trainers who genuinely care about your transformation. Modern equipment in top condition.",
      "Spacious, energetic, and clean gym. The staff is polite and always ready to spot or guide on proper form.",
      "Great mix of cardio, strength, and functional equipment. Well-maintained facility and encouraging environment.",
      "Friendly trainers, great sound system, and clean shower areas. Best decision to join {businessName}!",
      "Consistent results with their guidance. The trainers are knowledgeable and focus on sustainable fitness.",
      "High quality workout facility at reasonable rates. Perfect atmosphere for serious fitness enthusiasts!",
      "Very clean gym with state-of-the-art machines and polite trainers. 5 stars all the way!",
    ],
  },

  RETAIL: {
    name: "Retail Store & Supermarket",
    tags: [
      "Huge Variety & Stock",
      "Helpful Staff",
      "Best Prices & Discounts",
      "Fast Billing Counter",
      "100% Genuine Products",
      "Well-Organized Store",
      "Clean Shopping Aisles",
      "Easy Returns / Exchange",
      "Fresh Items",
      "Highly Recommended",
    ],
    negativeTags: [
      "Stock Unavailable",
      "Billing Delay",
      "Staff Attitude",
      "Pricing Discrepancy",
      "Store Cleanliness",
    ],
    reviews: [
      "Great shopping experience at {businessName}! Found everything easily and the staff helped me pick the right items. Fast billing too!",
      "Wide range of products at very competitive prices. Courteous staff and clean, well-organized shopping aisles.",
      "10/10 store! Genuine quality products, great promotional discounts, and friendly assistance throughout.",
      "Super convenient store with all essentials under one roof. Quick billing counters with almost zero waiting time.",
      "The staff here is very humble and eager to help. Great collection of products and transparent pricing.",
      "Clean, organized, and fully stocked store. Enjoyed shopping here and got some amazing deals today!",
      "Top quality items and courteous customer service. Easy return policy and smooth digital payment options.",
      "A dependable store with authentic items and polite team. Always a pleasure shopping at {businessName}!",
      "Great discounts and wide product selection. The store is spacious and billing is handled quickly.",
      "Courteous staff, fair pricing, and great product variety. Definitely my preferred shopping destination!",
      "Well-arranged shelves and polite sales staff who assist without being pushy. 5 stars for customer service!",
      "Quality items at very attractive rates. Fast checkout and friendly management.",
      "Clean environment, fresh stock, and polite billing team. Very pleasant shopping experience!",
      "Found all required items in one visit. Helpful staff guided me to the right section immediately.",
      "Consistently great shopping experience. Reasonable pricing, authentic products, and polite staff.",
    ],
  },

  AUTO_SERVICE: {
    name: "Automobile & Car Care",
    tags: [
      "Expert Mechanics",
      "Transparent Pricing",
      "Quick Turnaround",
      "Genuine Spare Parts",
      "Honest Diagnostic Advice",
      "Polite Service Staff",
      "Clean Car Wash / Detailing",
      "Reliable Repair Work",
      "Affordable Rates",
      "Highly Trusted Workshop",
    ],
    negativeTags: [
      "Workmanship Quality",
      "Delivery Delay",
      "Unexpected Charges",
      "Staff Behavior",
      "Cleanliness of Vehicle",
    ],
    reviews: [
      "Outstanding car service at {businessName}! Honest diagnosis, fair estimate, and timely delivery. The car runs like brand new!",
      "Expert mechanics with transparent pricing. They showed me the replaced old parts and explained the work clearly.",
      "10/10 service! Quick turnaround and clean car wash. Courteous staff and dependable automotive care.",
      "Very trustworthy garage. No unnecessary parts pushed and reasonable labor rates. Highly recommended!",
      "Superb detailing and mechanical work. The team is knowledgeable, polite, and finishes work on schedule.",
      "Smooth car servicing experience. Polite service advisor who kept me updated throughout the repair process.",
      "Genuine spare parts used and vehicle delivered right on time. Extremely satisfied with their professionalism!",
      "Fair pricing, expert technicians, and clean customer lounge. My go-to workshop for all vehicle needs.",
      "Great attention to detail! The car issue was diagnosed accurately and resolved without any hassle.",
      "Honest, efficient, and professional automobile service. Will definitely recommend {businessName} to everyone!",
      "Top quality repair work with zero hidden charges. Staff is courteous and polite.",
      "Fast, reliable service at reasonable rates. The mechanics take genuine pride in their work.",
      "Excellent car detailing and servicing! Car was delivered spotless inside and out.",
      "Dependable workshop with skilled technicians. Smooth billing and polite behavior throughout.",
      "Transparent estimates and timely car delivery. Best automotive workshop in the city!",
    ],
  },

  REAL_ESTATE: {
    name: "Real Estate & Property",
    tags: [
      "Honest Advice",
      "Transparent Deals",
      "Prime Properties",
      "Helpful Agents",
      "Smooth Documentation",
      "Prompt Communication",
      "Professional Service",
      "Market Expertise",
      "Hassle-free Dealings",
      "Highly Recommended",
    ],
    negativeTags: [
      "Communication Delay",
      "Hidden Charges",
      "Documentation Issues",
      "Agent Follow-up",
      "Expectations Not Met",
    ],
    reviews: [
      "Very professional and transparent real estate service at {businessName}. Guided us patiently and helped find our dream property!",
      "Honest advice and completely hassle-free paperwork. The team is polite, experienced, and very reliable.",
      "10/10 property consulting! They understood our budget and preferences perfectly without wasting any time.",
      "Smooth documentation, clear legal checks, and prompt communication. Highly trustworthy real estate agency!",
      "Best real estate experience! The agent answered all queries patiently and negotiated a great deal for us.",
      "Professional team with in-depth knowledge of local properties. Fair, transparent, and seamless dealings throughout.",
      "Great property options shown according to our exact criteria. Very polite and patient advisory team.",
      "Hassle-free registry and documentation assistance. Genuinely caring and professional consultants.",
      "Dependable real estate partners! Transparent dealings with zero hidden charges. Highly recommended!",
      "Found the perfect commercial / residential space through {businessName}. Seamless transaction from start to finish.",
      "Very cooperative and responsive team. Handled all legal paperwork with utmost professionalism.",
      "Great market insight and honest guidance. Made our property purchase simple and stress-free.",
      "Polite agents who respect your budget and time. Very satisfied with their property consulting services.",
      "Top-tier real estate advisory. Clear communication, prime listings, and smooth closing.",
      "Transparent and trustworthy service! Helped us make the right property investment with confidence.",
    ],
  },

  OTHER: {
    name: "General Business & Professional Services",
    tags: [
      "Professional Service",
      "Courteous Staff",
      "Prompt Communication",
      "Great Quality Work",
      "Affordable Pricing",
      "Timely Completion",
      "Reliable & Trustworthy",
      "Smooth Experience",
      "Customer Oriented",
      "Highly Recommended",
    ],
    negativeTags: [
      "Response Time",
      "Workmanship Quality",
      "Pricing Issue",
      "Staff Attitude",
      "Expectations Not Met",
    ],
    reviews: [
      "Exceptional experience with {businessName}! The staff was courteous, service was prompt, and the quality was top notch. Highly recommended!",
      "Had a wonderful experience! Top-notch service, honest communication, and great attention to detail. Will definitely be coming back.",
      "10/10 service! Professional staff, great customer care, and reasonable pricing. Best place around!",
      "Very reliable and trustworthy team. Completed everything smoothly and on time with zero hassle.",
      "Great quality of work and humble team members. They truly prioritize customer satisfaction. 5 stars!",
      "Smooth, transparent, and pleasant experience from start to finish. The team at {businessName} is very skilled.",
      "Polite behavior, transparent pricing, and timely service. Thoroughly satisfied with the results!",
      "One of the best in the business! Courteous staff who take genuine interest in addressing your requirements.",
      "Fast response, fair rates, and professional service. Definitely recommending {businessName} to everyone!",
      "Very dedicated team that delivers on their promises. Great experience overall and would gladly return.",
      "Prompt, efficient, and very courteous service. Great value for money and complete peace of mind.",
      "Consistently high standards of service. Friendly staff and flawless execution. Highly recommended!",
      "A truly professional team that values your time. Warm hospitality and excellent workmanship.",
      "Outstanding customer support and quality output. Very happy with the service delivered today!",
      "Reliable, honest, and professional service at fair rates. Keep up the fantastic work!",
    ],
  },
};

/**
 * Computes 3 rotating reviews and shuffled tags based on current hour and business seed.
 * Changes every 60 minutes so Google's algorithm sees varied, authentic, human reviews.
 * Hour H: Templates [1, 2, 3]
 * Hour H+1: Templates [4, 5, 6]
 * Hour H+2: Templates [7, 8, 9]
 * Hour H+3: Templates [10, 11, 12]
 * Hour H+4: Templates [13, 14, 15]
 */
export const CATEGORY_MENU_PRESETS: Record<string, string[]> = {
  CAFE: [
    "Cold Coffee",
    "Chocolate Truffle Cake",
    "Paneer Patty",
    "Cappuccino",
    "Veg Cheese Burger",
    "Cheese Grilled Sandwich",
    "Blueberry Pastry",
    "Garlic Bread",
    "Hot Chocolate",
    "French Fries",
  ],
  RESTAURANT: [
    "Butter Chicken",
    "Dal Makhani",
    "Paneer Butter Masala",
    "Garlic Naan",
    "Veg Biryani",
    "Chicken Biryani",
    "Paneer Tikka",
    "Tandoori Roti",
    "Crispy Corn",
    "Gulab Jamun",
  ],
  SALON: [
    "Haircut & Styling",
    "Beard Grooming & Shape",
    "Hair Spa Treatment",
    "Facial & Cleanup",
    "Hair Coloring",
    "Head Massage",
    "De-Tan Therapy",
    "Pedicure & Manicure",
  ],
  HOTEL: [
    "Deluxe Room Stay",
    "Buffet Breakfast",
    "Room Service",
    "Swimming Pool",
    "Evening High Tea",
    "Dinner Buffet",
    "Airport Pickup",
    "Spa & Wellness",
  ],
  GYM: [
    "Personal Training Session",
    "Cardio Workout",
    "Strength & Weight Training",
    "Crossfit & Functional",
    "Zumba Class",
    "Diet Consultation",
  ],
  CLINIC: [
    "Doctor Consultation",
    "General Health Checkup",
    "Blood Test & Diagnosis",
    "Vaccination",
    "Prescription & Follow-up",
  ],
  DENTIST: [
    "Dental Cleaning & Scaling",
    "Teeth Whitening",
    "Root Canal Treatment",
    "Tooth Extraction",
    "Dental Implants",
    "Braces Consultation",
  ],
  RETAIL: [
    "Grocery Shopping",
    "Fresh Fruits & Vegetables",
    "Household Essentials",
    "Packaged Snacks",
    "Dairy Products",
    "Quick Billing Service",
  ],
  AUTO_SERVICE: [
    "Full Car Servicing",
    "Oil & Filter Change",
    "Wheel Alignment & Balancing",
    "Brake Pad Replacement",
    "Car Wash & Detailing",
    "AC Servicing",
  ],
  REAL_ESTATE: [
    "Property Site Visit",
    "Commercial Space Consultation",
    "Residential Flat Tour",
    "Documentation & Legal Support",
    "Rental Agreement Service",
  ],
  OTHER: [
    "Customer Consultation",
    "Standard Service",
    "Express Delivery",
    "Quality Support",
    "On-site Assistance",
  ],
};

export interface SmartReviewInput {
  businessName: string;
  businessType?: string | null;
  selectedItems?: string[];
  tasteRating?: "superb" | "great" | "good" | "average";
  cleanlinessRating?: "spotless" | "clean" | "decent";
  staffRating?: "very_polite" | "courteous" | "helpful";
  language?: "hinglish" | "english";
  variationIndex?: number;
}

export function generateSmartReview({
  businessName,
  selectedItems = [],
  tasteRating = "superb",
  cleanlinessRating = "spotless",
  staffRating = "very_polite",
  language = "hinglish",
  variationIndex = 0,
}: SmartReviewInput): string {
  const isHinglish = language === "hinglish";

  // Format items string
  let itemsStr = "";
  if (selectedItems.length === 1) {
    itemsStr = selectedItems[0];
  } else if (selectedItems.length === 2) {
    itemsStr = isHinglish
      ? `${selectedItems[0]} aur ${selectedItems[1]}`
      : `${selectedItems[0]} and ${selectedItems[1]}`;
  } else if (selectedItems.length > 2) {
    const last = selectedItems[selectedItems.length - 1];
    const rest = selectedItems.slice(0, selectedItems.length - 1).join(", ");
    itemsStr = isHinglish
      ? `${rest} aur ${last}`
      : `${rest} and ${last}`;
  }

  // Taste wording
  let tasteWord = "";
  if (isHinglish) {
    if (tasteRating === "superb") tasteWord = "sach me lajawab aur ekdum fresh";
    else if (tasteRating === "great") tasteWord = "bahut hi tasty aur badiya";
    else if (tasteRating === "good") tasteWord = "accha aur fresh";
    else tasteWord = "theek-thaak";
  } else {
    if (tasteRating === "superb") tasteWord = "absolutely superb and fresh";
    else if (tasteRating === "great") tasteWord = "delicious and flavorful";
    else if (tasteRating === "good") tasteWord = "really good and tasty";
    else tasteWord = "decent";
  }

  // Cleanliness wording
  let cleanWord = "";
  if (isHinglish) {
    if (cleanlinessRating === "spotless") cleanWord = "ekdum top-class aur spotless saaf";
    else if (cleanlinessRating === "clean") cleanWord = "kaafi saaf-suthri";
    else cleanWord = "accha maintain kiya hua";
  } else {
    if (cleanlinessRating === "spotless") cleanWord = "spotless and remarkably hygienic";
    else if (cleanlinessRating === "clean") cleanWord = "neat, clean and well-kept";
    else cleanWord = "well-maintained";
  }

  // Staff wording
  let staffWord = "";
  if (isHinglish) {
    if (staffRating === "very_polite") staffWord = "bahut hi polite, welcoming aur helpful";
    else if (staffRating === "courteous") staffWord = "kaafi vinamra aur quick service dene wala";
    else staffWord = "friendly aur cooperative";
  } else {
    if (staffRating === "very_polite") staffWord = "extremely polite, welcoming and attentive";
    else if (staffRating === "courteous") staffWord = "very courteous, smiling and prompt";
    else staffWord = "friendly and helpful";
  }

  const vIdx = Math.abs(variationIndex) % 4;

  if (isHinglish) {
    if (itemsStr) {
      const templates = [
        `${businessName} par ${itemsStr} try kiya, taste ${tasteWord} tha! Yahan ki cleaning ${cleanWord} hai, aur staff ka behaviour ${staffWord} tha. Ekdum value for money experience tha, dosto aur family ke sath visit karne ke liye best jagah hai. Highly recommended!`,
        `Aaj ${businessName} visit kiya tha aur humne ${itemsStr} order kiya. Quality aur taste ${tasteWord} tha! Jagah ${cleanWord} hai aur staff members ${staffWord} hain. Service bhi kaafi quick thi. Definitely 5 stars!`,
        `Agar aap ${businessName} ja rahe hain to ${itemsStr} zaroor try karein, swad ${tasteWord} tha! Ambiance bahut comforting hai, safai ${cleanWord} hai aur yahan ke log ${staffWord} hain. Mujhe yahan aana bahut pasand aaya!`,
        `Superb experience at ${businessName}! ${itemsStr} ka experience ${tasteWord} tha. Cleaning ${cleanWord} mili aur staff ka nature ${staffWord} tha. Har cheez spot on thi, zaroor visit karein!`
      ];
      return templates[vIdx];
    } else {
      const templates = [
        `${businessName} visit karke bahut accha laga! Yahan ka overall experience ${tasteWord} tha. Jagah ${cleanWord} hai aur staff ka behaviour ${staffWord} tha. Har cheez perfect thi, definitely recommended!`,
        `Amazing service at ${businessName}! Quality ${tasteWord} thi aur setup ${cleanWord} tha. Yahan ka staff ${staffWord} hai jo customer ka pura dhyan rakhta hai. 5/5 rating!`,
        `${businessName} neighborhood ka ek top-tier spot hai. Environment bahut peaceful aur ${cleanWord} hai, service ${tasteWord} hai aur team ${staffWord} hai. Sabhi ko zaroor aana chahiye!`,
        `Bahut hi shandar anubhav raha ${businessName} par! Quality ${tasteWord} aur cleaning ${cleanWord}. Staff ${staffWord} tha. Will definitely visit again!`
      ];
      return templates[vIdx];
    }
  } else {
    if (itemsStr) {
      const templates = [
        `Visited ${businessName} and ordered ${itemsStr}. The taste was ${tasteWord}! The premises were ${cleanWord}, and the staff was ${staffWord}. Truly a wonderful experience, highly recommended to everyone!`,
        `Had a fantastic time at ${businessName}! We tried their ${itemsStr} and it was ${tasteWord}. The place is ${cleanWord} with great hygiene, and the team was ${staffWord}. Prompt service and great hospitality!`,
        `10/10 experience at ${businessName}! The ${itemsStr} was ${tasteWord} and served fresh. Loved how the atmosphere is ${cleanWord}, plus the staff is ${staffWord}. Definitely coming back soon!`,
        `Highly satisfied with my visit to ${businessName}. We enjoyed ${itemsStr} which was ${tasteWord}. Cleanliness was ${cleanWord} and the courteous staff (${staffWord}) made our visit memorable. Five stars!`
      ];
      return templates[vIdx];
    } else {
      const templates = [
        `Had an outstanding experience at ${businessName}! The service and quality was ${tasteWord}. The premises were ${cleanWord}, and the staff was ${staffWord}. Would definitely recommend to friends and family!`,
        `Exceptional visit to ${businessName}! The overall ambiance was pleasant and ${cleanWord}. Quality was ${tasteWord} and the staff was ${staffWord}. 5-star service all around!`,
        `Very happy with the hospitality at ${businessName}. Everything was ${tasteWord}, maintenance was ${cleanWord}, and the team was ${staffWord}. A great local business!`,
        `Top-tier quality and warm service at ${businessName}! Cleanliness was ${cleanWord} and the staff was ${staffWord}. Truly worth visiting!`
      ];
      return templates[vIdx];
    }
  }
}

export function getRotatingReviewsAndTags({
  businessType,
  businessName,
  businessId,
  customTags,
  customReviews,
  customMenuItems,
  hourOffset = 0,
}: {
  businessType?: string | null;
  businessName: string;
  businessId?: string | null;
  customTags?: string[] | string | null;
  customReviews?: string[] | string | null;
  customMenuItems?: string[] | string | null;
  hourOffset?: number;
}): {
  tags: string[];
  reviews: string[];
  menuItems: string[];
  negativeTags: string[];
  presetName: string;
  totalPoolSize: number;
  currentHourNumber: number;
  isCustomReviews: boolean;
  isCustomTags: boolean;
  isCustomMenu: boolean;
} {
  // Normalize category or default to OTHER
  const typeKey = (businessType || "").toUpperCase();
  const preset = CATEGORY_PRESETS[typeKey] || CATEGORY_PRESETS.OTHER;

  // Safely parse customReviews if string
  let safeCustomReviews: string[] | null = null;
  if (Array.isArray(customReviews)) {
    safeCustomReviews = customReviews.filter((r) => typeof r === "string" && r.trim().length > 0);
  } else if (typeof customReviews === "string" && customReviews.trim().length > 0) {
    try {
      const parsed = JSON.parse(customReviews);
      if (Array.isArray(parsed)) {
        safeCustomReviews = parsed.filter((r) => typeof r === "string" && r.trim().length > 0);
      }
    } catch {}
  }

  // Safely parse customTags if string
  let safeCustomTags: string[] | null = null;
  if (Array.isArray(customTags)) {
    safeCustomTags = customTags
      .filter((t) => typeof t === "string" && t.trim().length > 0)
      .map((t) => t.replace(/^\+\s*/, "").trim());
  } else if (typeof customTags === "string" && customTags.trim().length > 0) {
    try {
      const parsed = JSON.parse(customTags);
      if (Array.isArray(parsed)) {
        safeCustomTags = parsed
          .filter((t) => typeof t === "string" && t.trim().length > 0)
          .map((t) => t.replace(/^\+\s*/, "").trim());
      }
    } catch {}
  }

  // Safely parse customMenuItems if string
  let safeCustomMenu: string[] | null = null;
  if (Array.isArray(customMenuItems)) {
    safeCustomMenu = customMenuItems.filter((m) => typeof m === "string" && m.trim().length > 0);
  } else if (typeof customMenuItems === "string" && customMenuItems.trim().length > 0) {
    try {
      const parsed = JSON.parse(customMenuItems);
      if (Array.isArray(parsed)) {
        safeCustomMenu = parsed.filter((m) => typeof m === "string" && m.trim().length > 0);
      }
    } catch {}
  }

  const isCustomReviews = !!(safeCustomReviews && safeCustomReviews.length > 0);
  const isCustomTags = !!(safeCustomTags && safeCustomTags.length > 0);
  const isCustomMenu = !!(safeCustomMenu && safeCustomMenu.length > 0);

  // Determine current hour seed (changes every 60 minutes)
  const currentHourNumber = Math.floor(Date.now() / (1000 * 60 * 60)) + (hourOffset || 0);

  // Deterministic seed based on business ID/name to prevent two businesses colliding on same hour
  const businessSeed = (businessId || businessName || "growbroo")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  // 1. REVIEWS SELECTION (Rotates every hour)
  let selectedReviews: string[] = [];

  if (isCustomReviews && safeCustomReviews && safeCustomReviews.length > 0) {
    const poolLen = safeCustomReviews.length;
    const countToPick = Math.min(3, poolLen);
    const offset = Math.abs((currentHourNumber + businessSeed) * 3) % poolLen;

    for (let i = 0; i < countToPick; i++) {
      const idx = (offset + i) % poolLen;
      selectedReviews.push(safeCustomReviews[idx].replaceAll("{businessName}", businessName));
    }
  } else {
    // Use the industry master pool (15+ reviews)
    const masterPool = preset.reviews;
    const poolLen = masterPool.length;
    const offset = Math.abs((currentHourNumber + businessSeed) * 3) % poolLen;

    const idx1 = (offset + 0) % poolLen;
    const idx2 = (offset + 1) % poolLen;
    const idx3 = (offset + 2) % poolLen;

    selectedReviews = [
      masterPool[idx1].replaceAll("{businessName}", businessName),
      masterPool[idx2].replaceAll("{businessName}", businessName),
      masterPool[idx3].replaceAll("{businessName}", businessName),
    ];
  }

  // 2. TAGS SELECTION (Shuffle and pick top 6 based on hour)
  let selectedTags: string[] = [];
  const baseTags = isCustomTags && safeCustomTags && safeCustomTags.length > 0
    ? safeCustomTags
    : preset.tags;

  if (baseTags.length <= 6) {
    selectedTags = [...baseTags];
  } else {
    // Rotate tag starting index so different tags lead every hour
    const tagOffset = Math.abs(currentHourNumber + businessSeed) % baseTags.length;
    const rotated = [
      ...baseTags.slice(tagOffset),
      ...baseTags.slice(0, tagOffset),
    ];
    selectedTags = rotated.slice(0, 6);
  }

  // 3. MENU / OFFERINGS SELECTION
  const defaultMenu = CATEGORY_MENU_PRESETS[typeKey] || CATEGORY_MENU_PRESETS.OTHER;
  const menuItems = isCustomMenu && safeCustomMenu && safeCustomMenu.length > 0
    ? safeCustomMenu
    : defaultMenu;

  return {
    tags: selectedTags,
    reviews: selectedReviews,
    menuItems,
    negativeTags: preset.negativeTags,
    presetName: preset.name,
    totalPoolSize: isCustomReviews && safeCustomReviews ? safeCustomReviews.length : preset.reviews.length,
    currentHourNumber,
    isCustomReviews,
    isCustomTags,
    isCustomMenu,
  };
}
