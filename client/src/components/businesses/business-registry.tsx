import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Business } from "@shared/schema";

export default function BusinessRegistry() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses", { search: searchTerm }],
  });

  const filteredBusinesses = businesses.filter(business => {
    return searchTerm === "" ||
      business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.businessLicense.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.businessType.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Business Registry</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Register Business
            </Button>
          </div>
          
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
              placeholder="Search businesses by name, owner, or license number..."
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Loading businesses...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Business Name</TableHead>
                  <TableHead className="text-slate-300">Owner</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">License</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.map((business) => (
                  <TableRow key={business.id} className="border-slate-700 hover:bg-slate-700">
                    <TableCell>
                      <div className="text-white font-medium">{business.businessName}</div>
                      <div className="text-slate-400 text-sm">{business.address}</div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      Owner ID: {business.ownerId}
                    </TableCell>
                    <TableCell className="text-slate-300">{business.businessType}</TableCell>
                    <TableCell className="text-slate-300">{business.businessLicense}</TableCell>
                    <TableCell>
                      <Badge variant={business.isActive ? "default" : "secondary"} 
                             className={business.isActive ? "bg-green-600" : ""}>
                        {business.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </TableCell>
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

          {!isLoading && filteredBusinesses.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No businesses found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
