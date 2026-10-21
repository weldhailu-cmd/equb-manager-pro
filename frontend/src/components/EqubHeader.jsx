import React from "react";

export default function EqubHeader({ title = "Yop Digital Equb", subtitle = "ማኔጅመንት እና የዕጣ አስተዳደር ሲስተም" }) {
  return (
    <header className="bg-white border-b border-emerald-100 shadow-sm py-4 px-6 md:px-10 mb-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
      
      {/* Brand Logo & Title Section */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-inner overflow-hidden p-1">
          {/* የላካቸው ሎጎ ምስል (እንደ ፕላስቲክ ወይም ፎልደር ዟጅ በimg ታግ ሊቀመጥ ይችላል) */}
          <img 
            src="/path-to-your-logo.png" 
            alt="Yop Digital Equb Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // ምስሉ ካልተገኘ በድንገት የሚወጣ ጽሁፍ/Icon ምትክ
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span class="text-emerald-700 font-extrabold text-lg">Y</span>';
            }}
          />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-extrabold text-emerald-950 tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Quick Status / Actions */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          ● ሲስተሙ በመስመር ላይ አለ (Active)
        </span>
      </div>

    </header>
  );
}