import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Clock } from "lucide-react";

interface TopBarProps {
  activeSection: string;
}

export default function TopBar({ activeSection }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      citizens: "Citizens Database",
      vehicles: "Vehicle Registry",
      businesses: "Business Registry",
      properties: "Property Records",
      permits: "Permits & Licenses",
      criminal: "Criminal Records",
      wanted: "Wanted List",
      users: "User Management",
    };
    return titles[section] || "Dashboard";
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {getSectionTitle(activeSection)}
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 w-64 pr-10"
              placeholder="Global search..."
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Clock className="h-4 w-4" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
