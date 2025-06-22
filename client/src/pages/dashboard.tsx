import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import CitizensDatabase from "@/components/citizens/citizens-database";
import VehicleRegistry from "@/components/vehicles/vehicle-registry";
import BusinessRegistry from "@/components/businesses/business-registry";
import PropertyRecords from "@/components/properties/property-records";
import PermitsLicenses from "@/components/permits/permits-licenses";
import CriminalRecords from "@/components/criminal/criminal-records";
import WantedList from "@/components/wanted/wanted-list";
import UserManagement from "@/components/users/user-management";
import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertTriangle, Car, Building } from "lucide-react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("citizens");

  const renderContent = () => {
    switch (activeSection) {
      case "citizens":
        return <CitizensDatabase />;
      case "vehicles":
        return <VehicleRegistry />;
      case "businesses":
        return <BusinessRegistry />;
      case "properties":
        return <PropertyRecords />;
      case "permits":
        return <PermitsLicenses />;
      case "criminal":
        return <CriminalRecords />;
      case "wanted":
        return <WantedList />;
      case "users":
        return <UserManagement />;
      default:
        return <CitizensDatabase />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar activeSection={activeSection} />
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
