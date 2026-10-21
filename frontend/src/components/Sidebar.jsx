import React from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, LayoutGrid, Store, Wallet, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const navItems = [
  { to: "/", key: "nav_home", icon: Home },
  { to: "/create", key: "nav_create", icon: PlusCircle },
  { to: "/dashboard", key: "nav_dashboard", icon: LayoutGrid },
  { to: "/marketplace", key: "nav_marketplace", icon: Store },
  { to: "/payments", key: "nav_payments", icon: Wallet },
];

export default function Sidebar() {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xl font-bold text-blue-400">Yop Equb</span>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />
                <span>{t(item.key)}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div>
        <button
          onClick={toggleLang}
          className="w-full py-2 px-4 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 text-sm flex items-center justify-center gap-2"
        >
          <Languages size={16} />
          <span>{lang === "am" ? "English" : "አማርኛ"}</span>
        </button>
      </div>
    </aside>
  );
}