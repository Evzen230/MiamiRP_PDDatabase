import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2, Save } from "lucide-react";
import { Permit, InsertPermit } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PermitsLicenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null);
  const [formData, setFormData] = useState({
    permitNumber: "",
    permitType: "",
    citizenId: "",
    isValid: true,
    expiresAt: "",
  });

  const { toast } = useToast();

  const { data: permits = [], isLoading, refetch } = useQuery<Permit[]>({
    queryKey: ["/api/permits"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPermit) => {
      const response = await apiRequest("POST", "/api/permits", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permit created successfully",
      });
      setShowForm(false);
      resetForm();
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertPermit>) => {
      const response = await apiRequest("PUT", `/api/permits/${selectedPermit!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permit updated successfully",
      });
      setShowForm(false);
      resetForm();
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredPermits = permits.filter(permit => {
    return searchTerm === "" ||
      permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.permitType.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const resetForm = () => {
    setFormData({
      permitNumber: "",
      permitType: "",
      citizenId: "",
      isValid: true,
      expiresAt: "",
    });
    setSelectedPermit(null);
  };

  const handleEdit = (permit: Permit) => {
    setSelectedPermit(permit);
    setFormData({
      permitNumber: permit.permitNumber,
      permitType: permit.permitType,
      citizenId: permit.citizenId.toString(),
      isValid: permit.isValid,
      expiresAt: permit.expiresAt || "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      citizenId: parseInt(formData.citizenId),
    };

    if (selectedPermit) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData as InsertPermit);
    }
  };

  const permitTypes = [
    "weapon",
    "business",
    "construction", 
    "driving",
    "fishing",
    "hunting",
    "liquor",
    "medical",
    "other"
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Permits & Licenses</CardTitle>
            <Button 
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Issue Permit
            </Button>
          </div>
          
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
              placeholder="Search permits by number or type..."
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Loading permits...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Permit Number</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Citizen ID</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Expires</TableHead>
                  <TableHead className="text-slate-300">Issued</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermits.map((permit) => (
                  <TableRow key={permit.id} className="border-slate-700 hover:bg-slate-700">
                    <TableCell>
                      <div className="text-white font-medium">{permit.permitNumber}</div>
                    </TableCell>
                    <TableCell className="text-slate-300 capitalize">{permit.permitType}</TableCell>
                    <TableCell className="text-slate-300">{permit.citizenId}</TableCell>
                    <TableCell>
                      <Badge variant={permit.isValid ? "default" : "secondary"} 
                             className={permit.isValid ? "bg-green-600" : ""}>
                        {permit.isValid ? "VALID" : "EXPIRED"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {permit.expiresAt || "No expiration"}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(permit.issuedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-yellow-400 hover:text-yellow-300"
                          onClick={() => handleEdit(permit)}
                        >
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

          {!isLoading && filteredPermits.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No permits found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedPermit ? "Edit Permit" : "Issue New Permit"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Permit Number</Label>
              <Input
                value={formData.permitNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, permitNumber: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="PER-123456"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Permit Type</Label>
              <Select 
                value={formData.permitType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, permitType: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select permit type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {permitTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-white capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Citizen ID</Label>
              <Input
                value={formData.citizenId}
                onChange={(e) => setFormData(prev => ({ ...prev, citizenId: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter citizen ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Expiration Date</Label>
              <Input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedPermit ? "Update" : "Issue"} Permit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
