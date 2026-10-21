import React, { useState } from 'react';
import { 
  Home, MapPin, Phone, PlusCircle, CheckCircle, ShieldCheck, Upload, 
  Image as ImageIcon, Clock, Zap, Layers, Users, Building2, Compass, 
  Plus, Trash, Edit, Save, X 
} from 'lucide-react';

export default function Marketplace({ lang = 'am' }) {
  const [activeTab, setActiveTab] = useState('browse');

  const t = {
    am: {
      marketTitle: 'የሞላሌ ንብረት እና ኪራይ ማዕከል',
      marketSub: 'የተሟሉ ሎኬሽኖች፣ እስከ 5 የቤት ፎቶዎች እና የተከራይ ደንቦች ማስተዳደሪያ',
      browseBtn: 'ማስታወቂያዎችን ያስሱ',
      postBtn: 'ማስታወቂያ ፖስት አድርግ',
      formTitle: 'የሞላሌ (Molale) ንብረት ማስታወቂያ መሙያ ቅጽ',
      typeLabel: 'ማስታወቂያው ለምን አላማ ነው? (Type)',
      forRent: 'ለኪራይ (Rental)',
      forSale: 'ለሽያጭ (Sale)',
      titleLabel: 'የቤቱ ርዕስ (Title)',
      locationLabel: 'አካባቢ (Location)',
      priceLabel: 'ዋጋ (Price)',
      landmarksTitle: 'ከዋና ዋና ማዕከላት በእግር የሚፈጀው ጊዜ (ደቂቃዎችን ማስተካከል)',
      roomsLabel: 'የክፍል ብዛት',
      showerLabel: 'የሻወር ሁኔታ',
      hasShower: 'ሻወር ቤት አለው',
      noShower: 'ሻወር ቤት የለውም',
      floorLabel: 'የወለል ዓይነት',
      utilitiesLabel: 'የውኃ እና መብራት ክፍያ',
      tenantLabel: 'የተከራይ ምርጫ',
      kidsLabel: 'የልጆች ዕድሜ ክልል',
      animalsTitle: '🐾 የእንስሳት እና ፈረስ ማቆሚያ ፈቃዶች (Animals & Stable Rules)',
      kitchenLabel: 'የኩሽና/ምጣድ ፍቃድ',
      phoneLabel: 'ስልክ ቁጥር (Phone Number)',
      photoLabel: 'የቤቱ ፎቶዎች - እስከ 5 ፎቶ ማስገባት ይቻላል',
      detailsLabel: 'ተጨማሪ ማብራሪያ (Additional Details)',
      submitBtn: 'ማስታወቂያውን በግልጽ ፖስት አድርግ',
      successAlert: 'ማስታወቂያዎ በተሳካ ሁኔታ ተለጠፈ!',
      titles: [
        'ሰፊ ግቢ ያለው መኖሪያ ቤት (ለፈረስ ማቆሚያ እና ከብቶች ምቹ)',
        'ንጹህ እና ጸጥ ያለ የላጤ ክፍል (ሻወር ያለው)',
        'ዘመናዊ የቤተሰብ መኖሪያ ቤት (ከዋናው ማዕከል ቅርብ)',
        'ምቹ የንግድ ሱቅ / ቢሮ በዋና መንገድ አጠገብ'
      ]
    },
    en: {
      marketTitle: 'Molale Property Marketplace',
      marketSub: 'Precise listings with multiple photos, custom landmarks and animal rules.',
      browseBtn: 'Browse Listings',
      postBtn: 'Post Listing',
      formTitle: 'Molale Property Listing Form',
      typeLabel: 'Listing Type *',
      forRent: 'For Rent',
      forSale: 'For Sale',
      titleLabel: 'Title *',
      locationLabel: 'Location *',
      priceLabel: 'Price *',
      landmarksTitle: 'Walking Time to Landmarks (Minutes)',
      roomsLabel: 'Rooms Count',
      showerLabel: 'Shower Status',
      hasShower: 'Has Shower',
      noShower: 'No Shower',
      floorLabel: 'Floor Type',
      utilitiesLabel: 'Utilities Pay',
      tenantLabel: 'Tenant Preference',
      kidsLabel: 'Kids Age Info',
      animalsTitle: 'Animals & Stables Rules',
      kitchenLabel: 'Kitchen Policy',
      phoneLabel: 'Phone Number *',
      photoLabel: 'Multiple Photos Upload (Up to 5)',
      detailsLabel: 'Additional Details',
      submitBtn: 'Publish Listing',
      successAlert: 'Listing posted successfully!',
      titles: [
        'Wide Compound House (Good for Stables & Cattle)',
        'Clean & Quiet Single Room (With Shower)',
        'Modern Family House (Near Center)',
        'Commercial Shop / Office Near Main Road'
      ]
    }
  };

  const currentText = t[lang] || t['am'];

  const [listings, setListings] = useState([
    {
      id: 1,
      title: lang === 'am' ? 'ሰፊ ግቢ ያለው መኖሪያ ቤት (ለፈረስ ማቆሚያ እና ከብቶች ምቹ)' : 'Wide Compound House (Good for Stables & Cattle)',
      listingType: lang === 'am' ? 'ለኪራይ (Rental)' : 'For Rent',
      location: 'ሞላሌ (Molale)',
      distances: '• ነባሩ መናኸሪያ: 5 ደቂቃ\n• አዲሱ መናኸሪያ: 12 ደቂቃ\n• ሆስፒታል: 10 ደቂቃ\n• ስላሴ ቤ/ክ: 4 ደቂቃ',
      price: '4,500 ብር / ወር',
      rooms: '3 ክፍል • ሻወር ቤት አለው',
      floorType: 'ንጹህ የሲሚንቶ ወለል',
      utilities: 'መብራት እና ውኃ: ተከራዩ ይከፍላል',
      tenantPreference: 'ለቤተሰብ (ልጆች ከ 5 ዓመት በላይ)',
      animalRules: '🐓 ዶሮ: ይፈቀዳል | 🐑 በግ/ፍየል: ይፈቀዳል | 🐄 ዳልጋ ከብቶች: ይፈቀዳል | 🐎 ፈረስ ማቆሚያ: አለው',
      restrictions: 'ኩሽና/ምጣድ ይፈቀዳል',
      details: 'ሰፊ ግቢ ያለው፣ ፈረስ እና ከብቶች ማቆሚያ ቦታ ያለው ንጹህ ቤት።',
      phone: '0917175800',
      images: [],
      selectedImageIndex: 0,
      status: lang === 'am' ? 'በአስተባባሪ የተረጋገጠ' : 'Verified'
    }
  ]);

  const [formData, setFormData] = useState({
    title: currentText.titles[0],
    listingType: currentText.forRent,
    location: 'ሞላሌ (Molale)',
    price: '4000',
    roomCount: '2',
    hasShower: lang === 'am' ? 'ሻወር ቤት አለው' : 'Has Shower',
    floorType: lang === 'am' ? 'ንጹህ የሲሚንቶ ወለል' : 'Concrete Floor',
    utilitiesPay: lang === 'am' ? 'ተከራዩ ይከፍላል' : 'Tenant Pays',
    tenantType: lang === 'am' ? 'ለቤተሰብ' : 'Family',
    childAgeInfo: lang === 'am' ? 'ልጆች ከ 5 ዓመት በላይ' : 'Kids above 5 years',
    kitchenAllowed: lang === 'am' ? 'ኩሽና/ምጣድ ይፈቀዳል' : 'Kitchen Allowed',
    chickenRule: lang === 'am' ? 'ዶሮ ይፈቀዳል' : 'Chicken Allowed',
    sheepRule: lang === 'am' ? 'በግ/ፍየል ይፈቀዳል' : 'Sheep Allowed',
    cattleRule: lang === 'am' ? 'የዳልጋ ከብቶች ይፈቀዳሉ' : 'Cattle Allowed',
    stableRule: lang === 'am' ? 'ፈረስ ማቆሚያ አለው' : 'Has Stable',
    details: '',
    phone: '',
    images: [],
    imagePreviews: []
  });

  const [landmarks, setLandmarks] = useState([
    { id: 1, name: lang === 'am' ? 'ነባሩ መናኸሪያ' : 'Old Bus Station', minutes: '5', isEditing: false },
    { id: 2, name: lang === 'am' ? 'አዲሱ መናኸሪያ' : 'New Bus Station', minutes: '12', isEditing: false },
    { id: 3, name: lang === 'am' ? 'ሆስፒታል' : 'Hospital', minutes: '10', isEditing: false },
    { id: 4, name: lang === 'am' ? 'ስላሴ ቤተክርስቲያን' : 'Selassie Church', minutes: '4', isEditing: false }
  ]);

  const [newLandmarkName, setNewLandmarkName] = useState('');
  const [newLandmarkMinutes, setNewLandmarkMinutes] = useState('');

  const toggleEditLandmark = (id) => {
    setLandmarks(landmarks.map(l => l.id === id ? { ...l, isEditing: !l.isEditing } : l));
  };

  const handleLandmarkChange = (id, field, value) => {
    setLandmarks(landmarks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const addLandmark = () => {
    if (newLandmarkName && newLandmarkMinutes) {
      setLandmarks([
        ...landmarks, 
        { id: Date.now(), name: newLandmarkName, minutes: newLandmarkMinutes, isEditing: false }
      ]);
      setNewLandmarkName('');
      setNewLandmarkMinutes('');
    }
  };

  const removeLandmark = (id) => {
    setLandmarks(landmarks.filter(l => l.id !== id));
  };

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const selectedFiles = files.slice(0, 5 - formData.images.length);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));

      setFormData({
        ...formData,
        images: [...formData.images, ...selectedFiles],
        imagePreviews: [...formData.imagePreviews, ...newPreviews]
      });
    }
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = formData.imagePreviews.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages,
      imagePreviews: updatedPreviews
    });
  };

  const handleListingImageSelect = (listingId, imgIndex) => {
    setListings(listings.map(item => {
      if (item.id === listingId) {
        return { ...item, selectedImageIndex: imgIndex };
      }
      return item;
    }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.phone) return;
    
    const distanceSummary = landmarks.map(l => `• ${l.name}: ${l.minutes} ${lang === 'am' ? 'ደቂቃ' : 'mins'}`).join('\n');
    const animalSummary = `${lang === 'am' ? 'ዶሮ' : 'Chicken'}: ${formData.chickenRule} | ${lang === 'am' ? 'በግ/ፍየል' : 'Sheep'}: ${formData.sheepRule} | ${lang === 'am' ? 'ከብት' : 'Cattle'}: ${formData.cattleRule} | ${lang === 'am' ? 'ፈረስ' : 'Stable'}: ${formData.stableRule}`;

    const newListing = {
      id: listings.length + 1,
      title: formData.title,
      listingType: formData.listingType,
      location: formData.location,
      distances: distanceSummary,
      price: `${formData.price} ${lang === 'am' ? 'ብር' : 'ETB'}`,
      rooms: `${formData.roomCount} ${lang === 'am' ? 'ክፍል' : 'Rooms'} • ${formData.hasShower}`,
      floorType: formData.floorType,
      utilities: `${lang === 'am' ? 'መብራት/ውኃ' : 'Utilities'}: ${formData.utilitiesPay}`,
      tenantPreference: `${formData.tenantType} (${formData.childAgeInfo})`,
      animalRules: animalSummary,
      restrictions: formData.kitchenAllowed,
      details: formData.details,
      phone: formData.phone,
      images: formData.imagePreviews,
      selectedImageIndex: 0,
      status: lang === 'am' ? 'በአስተባባሪ የተረጋገጠ' : 'Verified'
    };

    setListings([newListing, ...listings]);
    setActiveTab('browse');
    alert(currentText.successAlert);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#113828] border border-emerald-700/60 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <span>{currentText.marketTitle}</span>
            <span className="text-amber-400 font-serif">ዮጵ</span>
          </h2>
          <p className="text-xs md:text-sm text-emerald-200/90 mt-1">
            {currentText.marketSub}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'browse' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            {currentText.browseBtn}
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'post' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            {currentText.postBtn}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'browse' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => (
              <div key={item.id} className="bg-[#113828]/80 border border-emerald-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                
                {item.images && item.images.length > 0 ? (
                  <div className="space-y-1.5 p-2 bg-emerald-950">
                    <div className="w-full h-48 rounded-xl overflow-hidden bg-black border border-emerald-800 relative">
                      <img 
                        src={item.images[item.selectedImageIndex || 0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-2 right-2 bg-black/70 text-amber-400 text-[10px] px-2 py-0.5 rounded-md font-bold">
                        {(item.selectedImageIndex || 0) + 1} / {item.images.length}
                      </span>
                    </div>

                    {item.images.length > 1 && (
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {item.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleListingImageSelect(item.id, idx)}
                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 cursor-pointer transition shrink-0 ${
                              (item.selectedImageIndex || 0) === idx ? 'border-amber-400 scale-105' : 'border-emerald-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="thumb" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-36 bg-emerald-950/50 flex flex-col items-center justify-center text-emerald-500/60 border-b border-emerald-800/50">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-[10px]">{lang === 'am' ? 'ፎቶ አልተያያዘም' : 'No Photo'}</span>
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {item.listingType}
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{item.title}</h3>

                    <div className="text-xs text-emerald-200/90 space-y-1.5 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
                      <p className="flex items-center gap-1.5 text-amber-300 font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" /> <b>{lang === 'am' ? 'አካባቢ:' : 'Location:'}</b> {item.location}
                      </p>
                      
                      <div className="bg-emerald-900/40 p-2 rounded-lg border border-emerald-800/60 text-[11px] text-emerald-200 whitespace-pre-line max-h-36 overflow-y-auto">
                        <p className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lang === 'am' ? 'ከማዕከላት በእግር (በደቂቃ):' : 'Walking Times:'}
                        </p>
                        {item.distances}
                      </div>

                      <p className="flex items-center gap-1.5 pt-1">
                        <Home className="w-3.5 h-3.5 text-amber-400" /> <b>{lang === 'am' ? 'ክፍል/ሻወር:' : 'Rooms:'}</b> {item.rooms}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" /> <b>{lang === 'am' ? 'ወለል:' : 'Floor:'}</b> {item.floorType}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> <b>{lang === 'am' ? 'ውኃ/መብራት:' : 'Utilities:'}</b> {item.utilities}
                      </p>
                      <p className="flex items-center gap-1.5 text-amber-300">
                        <Users className="w-3.5 h-3.5 text-amber-400" /> <b>{lang === 'am' ? 'ተከራይ:' : 'Tenant:'}</b> {item.tenantPreference}
                      </p>

                      <p className="text-amber-300 flex items-start gap-1.5 pt-1 border-t border-emerald-900 bg-amber-500/10 p-2 rounded-lg">
                        <span className="shrink-0">🐾</span>
                        <span><b>{lang === 'am' ? 'የእንስሳት ደንብ:' : 'Animals:'}</b> {item.animalRules}</span>
                      </p>
                      
                      <p className="text-emerald-300 text-[11px]"><b>{lang === 'am' ? 'ኩሽና/ምጣድ:' : 'Kitchen:'}</b> {item.restrictions}</p>
                      <p className="text-slate-300 pt-1 border-t border-emerald-900">{item.details}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/60 flex justify-between items-center mt-3">
                    <span className="text-sm font-black text-amber-400">{item.price}</span>
                    <a
                      href={`tel:${item.phone}`}
                      className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-xs px-3.5 py-2 rounded-xl text-white font-bold transition border border-emerald-700 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      {item.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Post Form */
        <div className="bg-[#113828]/90 border border-emerald-800/80 rounded-3xl p-6 md:p-8 shadow-xl max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            {currentText.formTitle}
          </h3>

          <form onSubmit={handlePostSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.typeLabel}</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={currentText.forRent}>{currentText.forRent}</option>
                  <option value={currentText.forSale}>{currentText.forSale}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.titleLabel}</label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-bold text-amber-300"
                >
                  {currentText.titles.map((titleOption, idx) => (
                    <option key={idx} value={titleOption}>{titleOption}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.locationLabel}</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ሞላሌ"
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.priceLabel}</label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="4000"
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Landmarks Section with Inline Edit */}
            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> {currentText.landmarksTitle}
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {landmarks.map((l) => (
                  <div key={l.id} className="flex items-center justify-between bg-emerald-900/60 px-3 py-2 rounded-xl border border-emerald-700/50 text-xs">
                    {l.isEditing ? (
                      <div className="flex items-center gap-2 w-full mr-2">
                        <input
                          type="text"
                          value={l.name}
                          onChange={(e) => handleLandmarkChange(l.id, 'name', e.target.value)}
                          className="bg-emerald-950 border border-emerald-600 rounded px-2 py-1 text-xs text-white w-2/3"
                        />
                        <input
                          type="text"
                          value={l.minutes}
                          onChange={(e) => handleLandmarkChange(l.id, 'minutes', e.target.value)}
                          className="bg-emerald-950 border border-emerald-600 rounded px-2 py-1 text-xs text-white w-1/3"
                        />
                      </div>
                    ) : (
                      <span><b>{l.name}:</b> {l.minutes} {lang === 'am' ? 'ደቂቃ' : 'mins'}</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleEditLandmark(l.id)}
                        className="text-amber-400 hover:text-amber-300 p-1 rounded transition cursor-pointer"
                        title={l.isEditing ? 'Save' : 'Edit'}
                      >
                        {l.isEditing ? <Save className="w-4 h-4 text-emerald-400" /> : <Edit className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLandmark(l.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-emerald-900">
                <input
                  type="text"
                  value={newLandmarkName}
                  onChange={(e) => setNewLandmarkName(e.target.value)}
                  placeholder={lang === 'am' ? 'የቦታው ስም (ለምሳሌ፡ ሆስፒታል)' : 'Landmark name'}
                  className="bg-emerald-900 border border-emerald-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={newLandmarkMinutes}
                  onChange={(e) => setNewLandmarkMinutes(e.target.value)}
                  placeholder={lang === 'am' ? 'የሚፈጀው ደቂቃ (ለምሳሌ፡ 10)' : 'Minutes'}
                  className="bg-emerald-900 border border-emerald-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={addLandmark}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {lang === 'am' ? 'ቦታ ጨምር' : 'Add'}
                </button>
              </div>
            </div>

            {/* Rooms & Shower */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.roomsLabel}</label>
                <input
                  type="text"
                  value={formData.roomCount}
                  onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                  placeholder="3"
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.showerLabel}</label>
                <select
                  value={formData.hasShower}
                  onChange={(e) => setFormData({ ...formData, hasShower: e.target.value })}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={lang === 'am' ? 'ሻወር ቤት አለው' : 'Has Shower'}>{lang === 'am' ? 'ሻወር ቤት አለው' : 'Has Shower'}</option>
                  <option value={lang === 'am' ? 'ሻወር ቤት የለውም' : 'No Shower'}>{lang === 'am' ? 'ሻወር ቤት የለውም' : 'No Shower'}</option>
                </select>
              </div>
            </div>

            {/* Floor Type & Utilities Pay */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.floorLabel}</label>
                <select
                  value={formData.floorType}
                  onChange={(e) => setFormData({ ...formData, floorType: e.target.value })}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={lang === 'am' ? 'ንጹህ የሲሚንቶ ወለል' : 'Concrete Floor'}>{lang === 'am' ? 'ንጹህ የሲሚንቶ ወለል' : 'Concrete Floor'}</option>
                  <option value={lang === 'am' ? 'ቴራዙ ወለል' : 'Terrazzo Floor'}>{lang === 'am' ? 'ቴራዙ ወለል' : 'Terrazzo Floor'}</option>
                  <option value={lang === 'am' ? 'የሰድር ወለል' : 'Tile Floor'}>{lang === 'am' ? 'የሰድር ወለል' : 'Tile Floor'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.utilitiesLabel}</label>
                <select
                  value={formData.utilitiesPay}
                  onChange={(e) => setFormData({ ...formData, utilitiesPay: e.target.value })}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={lang === 'am' ? 'ተከራዩ ይከፍላል' : 'Tenant Pays'}>{lang === 'am' ? 'ተከራዩ ይከፍላል' : 'Tenant Pays'}</option>
                  <option value={lang === 'am' ? 'ባለቤቱ ይከፍላል' : 'Owner Pays'}>{lang === 'am' ? 'ባለቤቱ ይከፍላል' : 'Owner Pays'}</option>
                </select>
              </div>
            </div>

            {/* Tenant Preference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.tenantLabel}</label>
                <select
                  value={formData.tenantType}
                  onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={lang === 'am' ? 'ለቤተሰብ' : 'Family'}>{lang === 'am' ? 'ለቤተሰብ' : 'Family'}</option>
                  <option value={lang === 'am' ? 'ለወንድ ላጤ' : 'Single Male'}>{lang === 'am' ? 'ለወንድ ላጤ' : 'Single Male'}</option>
                  <option value={lang === 'am' ? 'ለሴት ላጤ' : 'Single Female'}>{lang === 'am' ? 'ለሴት ላጤ' : 'Single Female'}</option>
                  <option value={lang === 'am' ? 'ለተማሪዎች' : 'Students'}>{lang === 'am' ? 'ለተማሪዎች' : 'Students'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.kidsLabel}</label>
                <input
                  type="text"
                  value={formData.childAgeInfo}
                  onChange={(e) => setFormData({ ...formData, childAgeInfo: e.target.value })}
                  placeholder="ልጆች ከ 5 ዓመት በላይ"
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Animal & Stable Rules */}
            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-amber-400">{currentText.animalsTitle}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-emerald-200 mb-1">{lang === 'am' ? 'ዶሮዎች (Poultry)' : 'Chickens'}</label>
                  <select
                    value={formData.chickenRule}
                    onChange={(e) => setFormData({ ...formData, chickenRule: e.target.value })}
                    className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={lang === 'am' ? 'ዶሮ ይፈቀዳል' : 'Chicken Allowed'}>{lang === 'am' ? 'ዶሮ ይፈቀዳል' : 'Chicken Allowed'}</option>
                    <option value={lang === 'am' ? 'ዶሮ አይፈቀድም' : 'Chicken Not Allowed'}>{lang === 'am' ? 'ዶሮ አይፈቀድም' : 'Chicken Not Allowed'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-emerald-200 mb-1">{lang === 'am' ? 'በግ እና ፍየል' : 'Sheep & Goats'}</label>
                  <select
                    value={formData.sheepRule}
                    onChange={(e) => setFormData({ ...formData, sheepRule: e.target.value })}
                    className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={lang === 'am' ? 'በግ/ፍየል ይፈቀዳል' : 'Sheep Allowed'}>{lang === 'am' ? 'በግ/ፍየል ይፈቀዳል' : 'Sheep Allowed'}</option>
                    <option value={lang === 'am' ? 'በግ/ፍየል አይፈቀድም' : 'Sheep Not Allowed'}>{lang === 'am' ? 'በግ/ፍየል አይፈቀድም' : 'Sheep Not Allowed'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-emerald-200 mb-1">{lang === 'am' ? 'የዳልጋ ከብቶች' : 'Cattle'}</label>
                  <select
                    value={formData.cattleRule}
                    onChange={(e) => setFormData({ ...formData, cattleRule: e.target.value })}
                    className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={lang === 'am' ? 'የዳልጋ ከብቶች ይፈቀዳሉ' : 'Cattle Allowed'}>{lang === 'am' ? 'የዳልጋ ከብቶች ይፈቀዳሉ' : 'Cattle Allowed'}</option>
                    <option value={lang === 'am' ? 'የዳልጋ ከብቶች አይፈቀዱም' : 'Cattle Not Allowed'}>{lang === 'am' ? 'የዳልጋ ከብቶች አይፈቀዱም' : 'Cattle Not Allowed'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-emerald-200 mb-1">{lang === 'am' ? 'ፈረስ ማቆሚያ' : 'Horses / Stables'}</label>
                  <select
                    value={formData.stableRule}
                    onChange={(e) => setFormData({ ...formData, stableRule: e.target.value })}
                    className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={lang === 'am' ? 'ፈረስ ማቆሚያ አለው' : 'Has Stable'}>{lang === 'am' ? 'ፈረስ ማቆሚያ አለው' : 'Has Stable'}</option>
                    <option value={lang === 'am' ? 'ፈረስ ማቆሚያ የለውም' : 'No Stable'}>{lang === 'am' ? 'ፈረስ ማቆሚያ የለውም' : 'No Stable'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Kitchen Policy */}
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.kitchenLabel}</label>
              <select
                value={formData.kitchenAllowed}
                onChange={(e) => setFormData({ ...formData, kitchenAllowed: e.target.value })}
                className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value={lang === 'am' ? 'ኩሽና/ምጣድ ይፈቀዳል' : 'Kitchen Allowed'}>{lang === 'am' ? 'ኩሽና/ምጣድ ይፈቀዳል' : 'Kitchen Allowed'}</option>
                <option value={lang === 'am' ? 'ኩሽና/ምጣድ አይፈቀድም' : 'Kitchen Not Allowed'}>{lang === 'am' ? 'ኩሽና/ምጣድ አይፈቀድም' : 'Kitchen Not Allowed'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.phoneLabel}</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="09..."
                className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Multiple Photos Upload */}
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.photoLabel}</label>
              
              <div className="border-2 border-dashed border-emerald-700/80 rounded-2xl p-4 text-center bg-emerald-950/50 hover:bg-emerald-950 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImagesChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={formData.images.length >= 5}
                />
                
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Upload className="w-6 h-6 text-amber-400 mb-1" />
                  <p className="text-xs text-emerald-200 font-bold">
                    {formData.images.length >= 5 
                      ? (lang === 'am' ? 'ከፍተኛው 5 ፎቶ ተሞልቷል!' : 'Max 5 photos reached!') 
                      : (lang === 'am' ? 'የሳሎን፣ አልጋ፣ ኩሽና እና ግቢ ፎቶዎችን በአንድ ላይ መርጠው ያስገቡ' : 'Click or drag images here')}
                  </p>
                  <p className="text-[10px] text-emerald-400">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {formData.imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {formData.imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-amber-400 shrink-0">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-0.5 hover:bg-red-500 cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">{currentText.detailsLabel}</label>
              <textarea
                rows="2"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder={lang === 'am' ? 'ስለ አጠቃላይ የቤቱ ሁኔታ በዝርዝር ይጻፉ...' : 'Write more details...'}
                className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {currentText.submitBtn}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}