import { useEffect, useRef, useState } from "react";

export default function TabBar({ tabs, activeTab, onChange }) {
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative flex gap-2 border-b border-gray-100 mb-6 overflow-x-auto">
      {tabs.map(({ name, icon: Icon }) => (
        <button
          key={name}
          ref={(el) => (tabRefs.current[name] = el)}
          onClick={() => onChange(name)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition whitespace-nowrap ${
            activeTab === name ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Icon className="w-4 h-4" />
          {name}
        </button>
      ))}
      <span
        className="absolute bottom-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
