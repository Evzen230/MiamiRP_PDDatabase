import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Property } from "@shared/schema";

export default function PropertyRecords() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { search: searchTerm }],
  });

  const filteredProperties = properties.filter(property => {
    return searchTerm === "" ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Property Records</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
          
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
              placeholder="Search properties by address or type..."
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Loading properties...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Address</TableHead>
                  <TableHead className="text-slate-300">Owner</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Ownership</TableHead>
                  <TableHead className="text-slate-300">Market Value</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id} className="border-slate-700 hover:bg-slate-700">
                    <TableCell>
                      <div className="text-white font-medium">{property.address}</div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {property.ownerId ? `Owner ID: ${property.ownerId}` : "No owner"}
                    </TableCell>
                    <TableCell className="text-slate-300 capitalize">{property.propertyType}</TableCell>
                    <TableCell>
                      <Badge variant={property.isOwned ? "default" : "secondary"} 
                             className={property.isOwned ? "bg-green-600" : ""}>
                        {property.isOwned ? "OWNED" : "RENTED"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {formatCurrency(property.marketValue)}
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

          {!isLoading && filteredProperties.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No properties found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
