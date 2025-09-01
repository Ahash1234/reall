import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    // Navigation
    home: "Home",
    search: "Search",
    dashboard: "Dashboard",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    
    // Common
    welcome: "Welcome to StockWatch",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    submit: "Submit",
    
    // Property listings
    properties: "Properties",
    property: "Property",
    price: "Price",
    location: "Location",
    description: "Description",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    sqft: "Square Feet",
    type: "Type",
    forSale: "For Sale",
    forRent: "For Rent",
    land: "Land",
    contactSeller: "Contact Seller",
    contactAgent: "Contact Agent",
    
    // Forms
    title: "Title",
    images: "Images",
    uploadImages: "Upload Images",
    chooseImages: "Choose Images",
    removeImage: "Remove Image",
    findOnMap: "Find on Map",
    locating: "Locating...",
    
    // Authentication
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    name: "Name",
    phone: "Phone",
    message: "Message",
    sending: "Sending...",
    sendMessage: "Send Message",
    
    // Messages
    loginSuccess: "Logged in successfully",
    signupSuccess: "Account created successfully",
    listingCreated: "Listing created successfully",
    listingUpdated: "Listing updated successfully",
    contactSent: "Message sent successfully",
    sellerWillContact: "The seller will contact you soon",
    contactError: "Failed to send message",
    tryAgainLater: "Please try again later",
    
    // Errors
    requiredField: "This field is required",
    invalidEmail: "Invalid email address",
    passwordMismatch: "Passwords do not match",
    loginError: "Login failed",
    signupError: "Signup failed",
    geocodeError: "Could not find location",
    invalidCredentials: "Invalid credentials. Please try again.",
    
    // Home page specific
    heroSubtitle: "Discover premium listings from trusted sellers in your area. Whether you're buying, selling, or just browsing, we've got you covered.",
    searchPlaceholder: "Search by title, location, or description...",
    featuredListings: "Featured Listings",
    featuredSubtitle: "Discover our handpicked selection of premium properties",
    propertiesFound: "properties found",
    grid: "Grid",
    list: "List",
    noListings: "No listings available at the moment.",
    
    // Search page specific
    browseAllProperties: "Browse All Properties",
    allTypes: "All Types",
    priceRange: "Price Range",
    anyPrice: "Any Price",
    under500k: "Under $500K",
    "500kTo1m": "$500K - $1M",
    above1m: "Above $1M",
    any: "Any",
    studio: "Studio",
    onePlus: "1+",
    twoPlus: "2+",
    threePlus: "3+",
    fourPlus: "4+",
    filtersApplied: "{{count}} filter{{count, plural, one {} other {s}}} applied",
    clearFilters: "Clear Filters",
    applyFilters: "Apply Filters",
    noPropertiesFound: "No properties found",
    tryAdjustingSearch: "Try adjusting your search criteria or clearing filters",
    
    // Map types
    standard: "Standard",
    terrain: "Terrain",
    satellite: "Satellite",
    light: "Light",
    standardMap: "Standard Map",
    terrainMap: "Terrain Map",
    satelliteView: "Satellite View",
    lightMap: "Light Map",
    
    // Login page specific
    adminLogin: "Admin Login",
    adminDashboardAccess: "Access the admin dashboard to manage listings",
    username: "Username",
    usernamePlaceholder: "admin",
    passwordPlaceholder: "password",
    signingIn: "Signing In...",
    signIn: "Sign In",
  }
};

// Tamil translations
const ta = {
  translation: {
    // Navigation
    home: "முகப்பு",
    search: "தேடல்",
    dashboard: "டாஷ்போர்டு",
    login: "உள்நுழைக",
    signup: "பதிவு செய்க",
    logout: "வெளியேறு",
    
    // Common
    welcome: "StockWatch க்கு வரவேற்கிறோம்",
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    success: "வெற்றி",
    save: "சேமிக்கவும்",
    cancel: "ரத்துசெய்",
    delete: "நீக்கு",
    edit: "திருத்து",
    view: "காண்க",
    submit: "சமர்ப்பிக்கவும்",
    
    // Property listings
    properties: "சொத்துகள்",
    property: "சொத்து",
    price: "விலை",
    location: "இடம்",
    description: "விளக்கம்",
    bedrooms: "படுக்கையறைகள்",
    bathrooms: "குளியலறைகள்",
    sqft: "சதுர அடி",
    type: "வகை",
    forSale: "விற்பனைக்கு",
    forRent: "வாடகைக்கு",
    land: "நிலம்",
    contactSeller: "விற்பனையாளரைத் தொடர்பு கொள்ள",
    contactAgent: "முகவரைத் தொடர்பு கொள்ள",
    
    // Forms
    title: "தலைப்பு",
    images: "படங்கள்",
    uploadImages: "படங்களை பதிவேற்றுக",
    chooseImages: "படங்களை தேர்ந்தெடு",
    removeImage: "படத்தை நீக்கு",
    findOnMap: "வரைபடத்தில் கண்டுபிடி",
    locating: "கண்டறிகிறது...",
    
    // Authentication
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்துக",
    name: "பெயர்",
    phone: "தொலைபேசி",
    message: "செய்தி",
    sending: "அனுப்புகிறது...",
    sendMessage: "செய்தி அனுப்பு",
    
    // Messages
    loginSuccess: "வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்",
    signupSuccess: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது",
    listingCreated: "பட்டியல் வெற்றிகரமாக உருவாக்கப்பட்டது",
    listingUpdated: "பட்டியல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    contactSent: "செய்தி வெற்றிகரமாக அனுப்பப்பட்டது",
    sellerWillContact: "விற்பனையாளர் விரைவில் உங்களைத் தொடர்பு கொள்வார்",
    contactError: "செய்தி அனுப்புவதில் தோல்வி",
    tryAgainLater: "பின்னர் மீண்டும் முயற்சிக்கவும்",
    
    // Errors
    requiredField: "இந்த புலம் தேவை",
    invalidEmail: "தவறான மின்னஞ்சல் முகவரி",
    passwordMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை",
    loginError: "உள்நுழைவு தோல்வியுற்றது",
    signupError: "பதிவு தோல்வியுற்றது",
    geocodeError: "இடத்தை கண்டுபிடிக்க முடியவில்லை",
    invalidCredentials: "தவறான அங்கீகாரங்கள். மீண்டும் முயற்சிக்கவும்.",
    
    // Home page specific
    heroSubtitle: "உங்கள் பகுதியில் நம்பகமான விற்பனையாளர்களிடமிருந்து உயர்தர பட்டியல்களைக் கண்டறியவும். நீங்கள் வாங்குவதா, விற்கிறதா அல்லது உலாவுவதா என்பதைப் பொருட்படுத்தாமல், நாங்கள் உங்களைக் கவனித்துக் கொள்கிறோம்.",
    searchPlaceholder: "தலைப்பு, இடம் அல்லது விளக்கம் மூலம் தேடு...",
    featuredListings: "சிறப்பு பட்டியல்கள்",
    featuredSubtitle: "எங்கள் தேர்ந்தெடுக்கப்பட்ட உயர்தர சொத்துகளின் தேர்வைக் கண்டறியவும்",
    propertiesFound: "சொத்துகள் கிடைத்தன",
    grid: "கட்டம்",
    list: "பட்டியல்",
    noListings: "தற்போது பட்டியல்கள் இல்லை.",
    
    // Search page specific
    browseAllProperties: "அனைத்து சொத்துகளையும் உலாவு",
    allTypes: "அனைத்து வகைகள்",
    priceRange: "விலை வரம்பு",
    anyPrice: "எந்த விலையும்",
    under500k: "$500K க்கு கீழ்",
    "500kTo1m": "$500K - $1M",
    above1m: "$1M க்கு மேல்",
    any: "எதுவும்",
    studio: "ஸ்டுடியோ",
    onePlus: "1+",
    twoPlus: "2+",
    threePlus: "3+",
    fourPlus: "4+",
    filtersApplied: "{{count}} வடிகட்டி{{count, plural, one {} other {கள்}}} பயன்படுத்தப்பட்டது",
    clearFilters: "வடிகட்டிகளை அழி",
    applyFilters: "வடிகட்டிகளை பயன்படுத்து",
    noPropertiesFound: "சொத்துகள் எதுவும் கிடைக்கவில்லை",
    tryAdjustingSearch: "உங்கள் தேடல் அளவுகோல்களை சரிசெய்யவும் அல்லது வடிகட்டிகளை அழிக்கவும்",
    
    // Map types
    standard: "நிலையான",
    terrain: "நிலப்பரப்பு",
    satellite: "செயற்கைக்கோள்",
    light: "வெளிச்சம்",
    standardMap: "நிலையான வரைபடம்",
    terrainMap: "நிலப்பரப்பு வரைபடம்",
    satelliteView: "செயற்கைக்கோள் பார்வை",
    lightMap: "வெளிச்ச வரைபடம்",
    
    // Login page specific
    adminLogin: "நிர்வாக உள்நுழைவு",
    adminDashboardAccess: "பட்டியல்களை நிர்வகிக்க நிர்வாக டாஷ்போர்டை அணுகவும்",
    username: "பயனர்பெயர்",
    usernamePlaceholder: "நிர்வாகி",
    passwordPlaceholder: "கடவுச்சொல்",
    signingIn: "உள்நுழைகிறது...",
    signIn: "உள்நுழைக",
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      ta: ta
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
