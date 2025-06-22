import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Vehicle } from "@shared/schema";

export default function VehicleRegistry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles", { search: searchTerm }],
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === "" || 
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusBadge = (vehicle: Vehicle) => {
    if (vehicle.isStolen) {
      return <Badge variant="destructive">STOLEN</Badge>;
    }
    if (!vehicle.isRegistered) {
      return <Badge variant="secondary">UNREGISTERED</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">ACTIVE</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Vehicle Registry</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Register Vehicle
            </Button>
          </div>
          
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                placeholder="Search by license plate, owner, or vehicle type..."
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="" className="text-white">All Types</SelectItem>
                <SelectItem value="sedan" className="text-white">Sedan</SelectItem>
                <SelectItem value="suv" className="text-white">SUV</SelectItem>
                <SelectItem value="truck" className="text-white">Truck</SelectItem>
                <SelectItem value="motorcycle" className="text-white">Motorcycle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Loading vehicles...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">License Plate</TableHead>
                  <TableHead className="text-slate-300">Vehicle</TableHead>
                  <TableHead className="text-slate-300">Owner</TableHead>
                  <TableHead className="text-slate-300">Registration</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="border-slate-700 hover:bg-slate-700">
                    <TableCell>
                      <div className="text-white font-medium">{vehicle.licensePlate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                      <div className="text-slate-400 text-sm">{vehicle.color}</div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      Owner ID: {vehicle.ownerId}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {vehicle.registrationExpires ? 
                        `Valid until ${vehicle.registrationExpires}` : 
                        "N/A"
                      }
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredVehicles.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No vehicles found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
