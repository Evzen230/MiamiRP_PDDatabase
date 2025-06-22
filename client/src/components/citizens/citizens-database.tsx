import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Citizen } from "@shared/schema";
import CitizenForm from "./citizen-form";
import CitizenDetail from "./citizen-detail";
import FlashBadge from "@/components/ui/flash-badge";

export default function CitizensDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

  const { data: citizens = [], isLoading, refetch } = useQuery<Citizen[]>({
    queryKey: ["/api/citizens", { search: searchTerm }],
  });

  const filteredCitizens = citizens.filter(citizen => {
    const matchesSearch = searchTerm === "" || 
      citizen.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.citizenId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || statusFilter === "all" ||
      (statusFilter === "wanted" && citizen.isWanted) ||
      (statusFilter === "deceased" && citizen.isDeceased) ||
      (statusFilter === "active" && !citizen.isWanted && !citizen.isDeceased);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (citizen: Citizen) => {
    if (citizen.isWanted) {
      return <FlashBadge variant="destructive">WANTED</FlashBadge>;
    }
    if (citizen.isDeceased) {
      return <Badge variant="secondary">DECEASED</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">ACTIVE</Badge>;
  };

  const handleViewCitizen = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setShowDetail(true);
  };

  const handleEditCitizen = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Citizens Database</CardTitle>
            <Button 
              onClick={() => {
                setSelectedCitizen(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Citizen
            </Button>
          </div>
          
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                placeholder="Search citizens by name, ID, or license plate..."
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="active" className="text-white">Active</SelectItem>
                <SelectItem value="wanted" className="text-white">Wanted</SelectItem>
                <SelectItem value="deceased" className="text-white">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Loading citizens...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Photo</TableHead>
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">ID</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Phone</TableHead>
                  <TableHead className="text-slate-300">Last Updated</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCitizens.map((citizen) => (
                  <TableRow 
                    key={citizen.id} 
                    className="border-slate-700 hover:bg-slate-700 cursor-pointer"
                    onClick={() => handleViewCitizen(citizen)}
                  >
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        {citizen.photoUrl ? (
                          <AvatarImage src={citizen.photoUrl} alt={`${citizen.firstName} ${citizen.lastName}`} />
                        ) : null}
                        <AvatarFallback className="bg-slate-600 text-white">
                          {citizen.firstName[0]}{citizen.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-medium">
                        {citizen.firstName} {citizen.lastName}
                      </div>
                      <div className="text-slate-400 text-sm">
                        Age: {new Date().getFullYear() - new Date(citizen.dateOfBirth).getFullYear()}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{citizen.citizenId}</TableCell>
                    <TableCell>{getStatusBadge(citizen)}</TableCell>
                    <TableCell className="text-slate-300">{citizen.phone || "N/A"}</TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(citizen.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCitizen(citizen);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCitizen(citizen);
                          }}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
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
              No citizens found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <CitizenForm
          citizen={selectedCitizen}
          onClose={() => {
            setShowForm(false);
            setSelectedCitizen(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedCitizen(null);
            refetch();
          }}
        />
      )}

      {showDetail && selectedCitizen && (
        <CitizenDetail
          citizen={selectedCitizen}
          onClose={() => {
            setShowDetail(false);
            setSelectedCitizen(null);
          }}
          onEdit={() => {
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}
