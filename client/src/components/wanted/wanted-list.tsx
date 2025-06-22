import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, AlertTriangle, Calendar } from "lucide-react";
import { Citizen } from "@shared/schema";
import FlashBadge from "@/components/ui/flash-badge";

export default function WantedList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: wantedCitizens = [], isLoading } = useQuery<Citizen[]>({
    queryKey: ["/api/wanted"],
  });

  const filteredCitizens = wantedCitizens.filter(citizen => {
    return searchTerm === "" ||
      citizen.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.citizenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (citizen.wantedReason && citizen.wantedReason.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
    <div className="space-y-6">
      {/* Alert Banner */}
      <Card className="bg-red-900/20 border-red-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <div>
              <h3 className="text-red-400 font-semibold">Wanted Individuals Alert</h3>
              <p className="text-red-300 text-sm">
                This list contains individuals with active warrants. Exercise caution when approaching.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-2" />
              Wanted List ({filteredCitizens.length} individuals)
            </CardTitle>
          </div>
          
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
              placeholder="Search wanted individuals by name, ID, or reason..."
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Loading wanted list...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Photo</TableHead>
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">ID</TableHead>
                  <TableHead className="text-slate-300">Age</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Wanted For</TableHead>
                  <TableHead className="text-slate-300">Last Known Address</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCitizens.map((citizen) => (
                  <TableRow 
                    key={citizen.id} 
                    className="border-slate-700 hover:bg-slate-700 bg-red-900/10"
                  >
                    <TableCell>
                      <Avatar className="h-12 w-12">
                        {citizen.photoUrl ? (
                          <AvatarImage src={citizen.photoUrl} alt={`${citizen.firstName} ${citizen.lastName}`} />
                        ) : null}
                        <AvatarFallback className="bg-red-600 text-white">
                          {citizen.firstName[0]}{citizen.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-bold text-lg">
                        {citizen.firstName} {citizen.lastName}
                      </div>
                      <div className="text-slate-400 text-sm">
                        DOB: {citizen.dateOfBirth}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">{citizen.citizenId}</TableCell>
                    <TableCell className="text-slate-300">{calculateAge(citizen.dateOfBirth)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <FlashBadge variant="destructive">WANTED</FlashBadge>
                        {citizen.isAmber && (
                          <FlashBadge variant="destructive" className="bg-orange-600">
                            AMBER
                          </FlashBadge>
                        )}
                        {citizen.taxFraudFlag && (
                          <div className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                            TAX FRAUD
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-red-400 font-medium">
                        {citizen.wantedReason || "Reason not specified"}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-xs">
                      <div className="truncate">
                        {citizen.address || "Address unknown"}
                      </div>
                      {citizen.phone && (
                        <div className="text-xs text-slate-400">
                          Phone: {citizen.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredCitizens.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              {searchTerm ? "No wanted individuals found matching your search." : "No wanted individuals currently on file."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {filteredCitizens.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-red-900/20 border-red-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{filteredCitizens.length}</div>
              <div className="text-red-300 text-sm">Total Wanted</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-900/20 border-orange-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">
                {filteredCitizens.filter(c => c.isAmber).length}
              </div>
              <div className="text-orange-300 text-sm">AMBER Alerts</div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-900/20 border-yellow-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filteredCitizens.filter(c => c.taxFraudFlag).length}
              </div>
              <div className="text-yellow-300 text-sm">Tax Fraud Cases</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
