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
  const [activeSection, setActiveSection] = useState("dashboard");

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
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-600 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-white">1,247</p>
                      <p className="text-slate-400">Total Citizens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-600 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-white">23</p>
                      <p className="text-slate-400">Wanted Individuals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-600 rounded-lg">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-white">3,456</p>
                      <p className="text-slate-400">Registered Vehicles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-600 rounded-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-white">189</p>
                      <p className="text-slate-400">Active Businesses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-white font-medium">New wanted individual added</p>
                        <p className="text-slate-400 text-sm">Marcus Johnson - Tax Fraud</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm">2 min ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-white font-medium">Vehicle registration updated</p>
                        <p className="text-slate-400 text-sm">License: MIA-2024 - Sarah Connor</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm">15 min ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-white font-medium">New citizen registered</p>
                        <p className="text-slate-400 text-sm">Alex Rodriguez - ID: 789456</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
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
