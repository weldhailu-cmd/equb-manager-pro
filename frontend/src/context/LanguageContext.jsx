import React, { createContext, useContext, useState, useEffect, Component } from "react";

// 1. Full Translation Dictionary (Yop - Bicha Werk / Yellow Gold Branding)
export const translations = {
  am: {
    title: "ዮጵ",
    slogan: "ቢጫ ወርቅ",
    welcome: "ዮጵ — ቢጫ ወርቅ",
    welcome_title: "ዮጵ — ቢጫ ወርቅ",
    
    // 🌟 Historical & Spiritual Brand Context
    welcome_subtitle: "ከጥንታዊው የሳባውያን፣ የአጋዚያን እና የኢትዮጵስ ታሪክ አውድ አንፃር፦ «ኢት» ማለት አምላክ/ፈጣሪ ሲሆን፤ «ዮጵ» ደግሞ «ቢጫ ወርቅ» (የወርቅ ስጦታ/ብልጽግና) ማለት ነው። ሁለቱ ሲጣመሩ «ኢትዮጵያ» — ለአምላክ የሚሰጥ የወርቅ ስጦታ የሚል ታላቅ ትርጉም ይይዛል። ዮጵ — የሀብት፣ የዕቁብ እና የቁጠባዎ መገኛ ማዕከል!",
    welcome_body: "እያንዳንዱ ዕቁብ በምስጢራዊ የይለፍ ቃል የተጠበቀ ነው — አባላት ብቻ መረጃውን ማየት ይችላሉ።",
    
    // 🧭 Main Navigation
    nav_equb: "ዕቁብ",
    nav_market: "ማርኬትፕሌስ",
    nav_how_it_works: "እንዴት ይሰራል",
    nav_coming_soon: "ቅርብ ቀን",
    nav_coming_soon_1: "ቅርብ ቀን (አገልግሎት 1)",
    nav_coming_soon_2: "ቅርብ ቀን (አገልግሎት 2)",

    // 🎯 Equb Sub-menu
    sub_active_equbs: "ንቁ ዕቁቦች",
    sub_create_equb: "አዲስ ዕቁብ ፍጠር",

    // 🔍 Search & Actions
    get_started: "አዲስ ዕቁብ ፍጠር",
    browse_equbs: "ንቁ ዕቁቦች",
    back_home: "← ወደ ዕቁብ መነሻ ገጽ",
    
    // 📝 Registration Form
    create_title: "አዲስ ዕቁብ መፍጠሪያ ቅጽ",
    create_title_badge: "✨ አዲስ ዲጂታል ዕቁብ መፍጠሪያ",
    create_heading: "አዲስ ዕቁብ መፍጠሪያ ቅጽ",
    create_subheading: "ዕቁብዎን በቀላሉ ያዋቅሩ፣ ዋና ስሎቶችን ይወስኑ እና በይለፍ ቃል ይጠብቁ።",
    create_equb: "ዕቁብ ፍጠር",
    equb_name: "የዕቁቡ ስም (EQUB NAME)",
    equb_name_label: "የዕቁቡ ስም (Equb Name)",
    equb_name_placeholder: "ለምሳሌ፦ የቤተሰብ ወርሃዊ ዕቁብ",
    city: "ከተማ (CITY / LOCATION)",
    city_label: "ከተማ (City / Location)",
    city_other: "ሌሎች (Other)",
    address_city: "አድራሻ / ከተማ",
    main_slots: "ዋና ስሎቶች ብዛት (MAIN SLOTS)",
    slots_label: "ዋና ስሎቶች ብዛት (Main Slots)",
    main_slots_title: "ዋና ስሎቶች ብዛት (MAIN SLOTS)",
    main_slots_desc: "እያንዳንዱ ዋና ስሎት አባል ይይዛል፤ ለዕጣው የሚቆጠረው ዋናው ስሎት ብቻ ነው።",
    
    // 🛒 Marketplace
    marketplace_title: "ማርኬትፕሌስ",
    marketplace_body: "የሚሸጡና የሚከራዩ ቤቶችን፣ ኤሌክትሮኒክስ እና ያገለገሉ ዕቃዎችን ያስሱ።",
    cat_real_estate: "ቤቶችና ቦታዎች",
    cat_electronics: "ኤሌክትሮኒክስ",
    cat_used_goods: "ያገለገሉ ዕቃዎች",
    
    // 💳 Payments & Banking
    payments_title: "የክፍያ አስተዳደር",
    payments_ledger: "የዕቁብ ክፍያዎች መዝገብ",
    payments_body: "በባንክ (ፀደይ ባንክ) እና በጥሬ ገንዘብ የሚደረጉ ክፍያዎች በአስተማማኝ ሁኔታ ይመዝገባሉ።",
    contribution_amount: "የአንድ ጊዜ አስተዋጽኦ መጠን (ብር)",
    contribution_label: "የአንድ ጊዜ አስተዋጽኦ መጠን (Contribution in ETB)",
    service_fee: "የአገልግሎት ክፍያ",
    service_fee_label: "የአገልግሎት ክፍያ አማራጭ (Service Fee)",
    fee_free: "ነፃ — 0%",
    fee_standard: "መደበኛ — 0.06%",
    fee_premium: "ፕሪሚየም — 0.12%",
    fee_note: "የተመረጠው መቶኛ የሚሰበሰበው ከዕድለኛ አባል ክፍያ ላይ ብቻ ነው፥ እጣው በተዘጋጀበት ቀን።",
    bank_partner: "የባንክ አጋር",
    bank_name_label: "የባንክ አካውንት (Bank Partner)",
    bank_account: "የአድሚኑ ባንክ ሂሳብ ቁጥር",
    account_no_label: "የባንክ ቁጥር / አካውንት ቁጥር (Account Number)",
    account_no_placeholder: "ለምሳሌ፦ 1000xxxxxxxxx",
    
    // 🔐 Security & Controls
    member_password: "የአባላት መክፈቻ ይለፍ ቃል",
    password_label: "የዕቁብ መክፈቻ የይለፍ ቃል (Equb Password — አባላት ብቻ እንዲከፍቱት)",
    password_placeholder: "የምስጢር ቁጥር (Secret Password)",
    admin_password: "የአስተዳዳሪ ማለፊያ ቃል",
    start_date: "የሚጀምርበት ቀን",
    calendar_gregorian: "ግሪጎሪያን ዘመን አቆጣጠር",
    calendar_ethiopian: "የኢትዮጵያ ዘመን አቆጣጠር",
    cancel: "ተመለስ",
    submit_create: "ዕቁብ ፍጠር",
    submit_btn: "ዕቁብ ፍጠር (Create Digital Equb)",
    submitting_btn: "በመፍጠር ላይ... (Creating...)",
    creating: "እየተፈጠረ ነው...",
    success_msg: "ዕቁቡ በအောင်ነት ተፈጥሯል! ወደ ዳሽቦርድ በመውሰድ ላይ...",
    footerText: "ዮጵ (ቢጫ ወርቅ) — ሃይላት 2026",
    rights_reserved: "መብቱ በሕግ የተጠበቀ ነው።",
    admin: "አስተዳዳሪ",
    member: "አባል",
    login: "ወደ ዕቁብ ግባ",
  },
  en: {
    title: "Yop",
    slogan: "Yellow Gold",
    welcome: "Yop — Yellow Gold",
    welcome_title: "Yop — Yellow Gold",
    
    // 🌟 Sabaean & Ethiops Brand Origin
    welcome_subtitle: "From ancient Sabaean and Ethiops history: 'Ethio' signifies God/Creator, while 'Yop' represents 'Yellow Gold' (Gift of Gold / Prosperity). Together, 'Ethiopia' translates to 'A Divine Gift of Gold'. Yop — Your hub for savings, Equb, and prosperity!",
    welcome_body: "Every Equb is password-protected — only authorized members can view details.",
    
    // 🧭 Main Navigation
    nav_equb: "Equb",
    nav_market: "Marketplace",
    nav_how_it_works: "How it Works",
    nav_coming_soon: "Coming Soon",
    nav_coming_soon_1: "Coming Soon 1",
    nav_coming_soon_2: "Coming Soon 2",

    // 🎯 Equb Sub-menu
    sub_active_equbs: "Active Equbs",
    sub_create_equb: "Create New Equb",

    // 🔍 Search & Actions
    get_started: "Create New Equb",
    browse_equbs: "Active Equbs",
    back_home: "← Back to Equb Home",
    
    // 📝 Registration Form
    create_title: "New Equb Registration Form",
    create_title_badge: "✨ Create New Digital Equb",
    create_heading: "New Equb Registration Form",
    create_subheading: "Set up your equb group, assign main slots, and secure access with a password.",
    create_equb: "Create Equb",
    equb_name: "Equb Name (EQUB NAME)",
    equb_name_label: "Equb Name",
    equb_name_placeholder: "e.g., Family Monthly Equb",
    city: "City / Location (CITY / LOCATION)",
    city_label: "City / Location",
    city_other: "Other",
    address_city: "Address / City",
    main_slots: "Main Slots Count (MAIN SLOTS)",
    slots_label: "Main Slots Count",
    main_slots_title: "Main Slots Count (MAIN SLOTS)",
    main_slots_desc: "Each main slot holds an assigned member for draw eligibility.",
    
    // 🛒 Marketplace
    marketplace_title: "Marketplace",
    marketplace_body: "Explore real estate, electronics, and verified used items.",
    cat_real_estate: "Real Estate",
    cat_electronics: "Electronics",
    cat_used_goods: "Used Goods",
    
    // 💳 Payments & Banking
    payments_title: "Payment Management",
    payments_ledger: "Payments Ledger",
    payments_body: "Bank transfers (Tsedey Bank) and cash payments are recorded securely.",
    contribution_amount: "Contribution Amount (ETB)",
    contribution_label: "Contribution Amount (ETB)",
    service_fee: "Service Fee",
    service_fee_label: "Service Fee Option",
    fee_free: "Free — 0%",
    fee_standard: "Standard — 0.06%",
    fee_premium: "Premium — 0.12%",
    fee_note: "The selected percentage is collected only from the winning member's payout on drawing day.",
    bank_partner: "Bank Partner",
    bank_name_label: "Bank Partner",
    bank_account: "Admin Bank Account Number",
    account_no_label: "Admin Account Number",
    account_no_placeholder: "e.g., 1000xxxxxxxxx",
    
    // 🔐 Security & Controls
    member_password: "Member Password",
    password_label: "Equb Access Password (Members Only)",
    password_placeholder: "Secret Password",
    admin_password: "Admin Password",
    start_date: "Start Date",
    calendar_gregorian: "Gregorian Calendar",
    calendar_ethiopian: "Ethiopian Calendar",
    cancel: "Cancel",
    submit_create: "Create Equb",
    submit_btn: "Create Digital Equb",
    submitting_btn: "Creating...",
    creating: "Creating...",
    success_msg: "Equb created successfully! Redirecting to dashboard...",
    footerText: "Yop (Yellow Gold) — Hailat 2026",
    rights_reserved: "All rights reserved.",
    admin: "Admin",
    member: "Member",
    login: "Login to Equb",
  }
};

const LanguageContext = createContext();

// 2. Error Boundary Component
class LanguageErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("=== REACT RENDER ERROR CAUGHT ===", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", color: "#991b1b", background: "#fef2f2", borderRadius: "12px", margin: "20px", border: "1px solid #f87171" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>⚠️ Language Context Error</h3>
          <p style={{ margin: 0, fontWeight: "bold" }}>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// 3. Main Unified Language Provider
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("yop_app_lang") || "am";
  });

  useEffect(() => {
    localStorage.setItem("yop_app_lang", lang);
  }, [lang]);

  const t = (key) => {
    try {
      return translations[lang]?.[key] || translations["am"]?.[key] || translations["en"]?.[key] || key;
    } catch (err) {
      return String(key);
    }
  };

  return (
    <LanguageErrorBoundary>
      <LanguageContext.Provider
        value={{
          lang,
          setLang,
          language: lang,
          setLanguage: setLang,
          t
        }}
      >
        {children}
      </LanguageContext.Provider>
    </LanguageErrorBoundary>
  );
}

// 4. Custom Hook with Fallback Support
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: "am",
      language: "am",
      setLang: () => {},
      setLanguage: () => {},
      t: (key) => translations["am"]?.[key] || key,
    };
  }
  return context;
};