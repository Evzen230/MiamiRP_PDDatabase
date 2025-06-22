import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Car, Plus, AlertTriangle } from "lucide-react";
import { Citizen, Vehicle, CriminalRecord } from "@shared/schema";
import FlashBadge from "@/components/ui/flash-badge";

interface CitizenDetailProps {
  citizen: Citizen;
  onClose: () => void;
  onEdit: () => void;
}

export default function CitizenDetail({ citizen, onClose, onEdit }: CitizenDetailProps) {
  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: [`/api/citizens/${citizen.id}/vehicles`],
  });

  const { data: criminalRecords = [] } = useQuery<CriminalRecord[]>({
    queryKey: [`/api/citizens/${citizen.id}/criminal-records`],
  });

  const getStatusBadge = () => {
    if (citizen.isWanted) {
      return <FlashBadge variant="destructive">WANTED</FlashBadge>;
    }
    if (citizen.isDeceased) {
      return <Badge variant="secondary">DECEASED</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">ACTIVE</Badge>;
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Citizen Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Photo and basic info */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <Avatar className="w-full h-48 rounded-lg mb-4">
                  {citizen.photoUrl ? (
                    <AvatarImage src={citizen.photoUrl} alt={`${citizen.firstName} ${citizen.lastName}`} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-slate-600 text-white text-4xl rounded-lg">
                    {citizen.firstName[0]}{citizen.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <h4 className="text-white font-semibold text-lg">
                    {citizen.firstName} {citizen.lastName}
                  </h4>
                  <p className="text-slate-400">ID: {citizen.citizenId}</p>
                  <p className="text-slate-400">Age: {calculateAge(citizen.dateOfBirth)}</p>
                  <div className="mt-4">
                    {getStatusBadge()}
                  </div>
                  {citizen.taxFraudFlag && (
                    <Badge variant="destructive" className="mt-2">
                      Tax Fraud Flag
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right columns - Detailed information */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Information */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-slate-400">Full Name:</span> <span className="text-white">{citizen.firstName} {citizen.lastName}</span></div>
                <div><span className="text-slate-400">DOB:</span> <span className="text-white">{citizen.dateOfBirth}</span></div>
                <div><span className="text-slate-400">Phone:</span> <span className="text-white">{citizen.phone || "N/A"}</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="text-white">{citizen.email || "N/A"}</span></div>
                <div><span className="text-slate-400">Address:</span> <span className="text-white">{citizen.address || "N/A"}</span></div>
                <div><span className="text-slate-400">Immigration Status:</span> <span className="text-white capitalize">{citizen.immigrationStatus || "citizen"}</span></div>
              </CardContent>
            </Card>

            {/* Vehicles */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">Registered Vehicles</CardTitle>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {vehicles.length > 0 ? (
                  <div className="space-y-2">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-2 bg-slate-600 rounded">
                        <div className="text-white font-medium">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-slate-300 text-xs">
                          License: {vehicle.licensePlate} - {vehicle.color}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No vehicles registered</p>
                )}
              </CardContent>
            </Card>
            
            {/* Criminal Record */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">Criminal Record</CardTitle>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {criminalRecords.length > 0 ? (
                  <div className="space-y-2">
                    {criminalRecords.map((record) => (
                      <div 
                        key={record.id} 
                        className={`p-2 rounded ${
                          record.status === 'active' ? 'bg-red-900' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`font-medium ${
                          record.status === 'active' ? 'text-red-200' : 'text-slate-200'
                        }`}>
                          {record.crimeType}
                        </div>
                        <div className={`text-xs ${
                          record.status === 'active' ? 'text-red-300' : 'text-slate-300'
                        }`}>
                          {record.dateOfCrime} - {record.status}
                        </div>
                        {record.fine && (
                          <div className="text-xs text-slate-300">
                            Fine: ${record.fine} {record.isPaid ? "(Paid)" : "(Unpaid)"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No criminal records</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-slate-600">
          <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Record
          </Button>
          <Button variant="outline" className="border-slate-600">
            <Car className="h-4 w-4 mr-2" />
            Register Vehicle
          </Button>
          {citizen.isWanted ? (
            <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white">
              Clear Wanted Status
            </Button>
          ) : (
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Mark as Wanted
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
