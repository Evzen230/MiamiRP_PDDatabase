import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Gauge, Users, Car, Building, Home, IdCard, 
  Gavel, AlertTriangle, UserCog, LogOut 
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logoutMutation } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Gauge },
    { id: "citizens", label: "Citizens Database", icon: Users },
    { id: "vehicles", label: "Vehicle Registry", icon: Car },
    { id: "businesses", label: "Business Registry", icon: Building },
    { id: "properties", label: "Property Records", icon: Home },
    { id: "permits", label: "Permits & Licenses", icon: IdCard },
    { id: "criminal", label: "Criminal Records", icon: Gavel },
    { id: "wanted", label: "Wanted List", icon: AlertTriangle },
  ];

  // Only show user management for IT and Directors
  const canManageUsers = user?.role === 'IT' || user?.role?.startsWith('Director_');
  if (canManageUsers) {
    navigationItems.push({ id: "users", label: "User Management", icon: UserCog });
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Miami RP DB</h1>
        <p className="text-sm text-slate-400">{user?.department || user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="text-slate-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
