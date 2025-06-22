import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Upload } from "lucide-react";
import { Citizen, InsertCitizen } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CitizenFormProps {
  citizen: Citizen | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CitizenForm({ citizen, onClose, onSuccess }: CitizenFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    citizenId: citizen?.citizenId || "",
    firstName: citizen?.firstName || "",
    lastName: citizen?.lastName || "",
    dateOfBirth: citizen?.dateOfBirth || "",
    phone: citizen?.phone || "",
    email: citizen?.email || "",
    address: citizen?.address || "",
    photoUrl: citizen?.photoUrl || "",
    isWanted: citizen?.isWanted || false,
    wantedReason: citizen?.wantedReason || "",
    isAmber: citizen?.isAmber || false,
    isDeceased: citizen?.isDeceased || false,
    immigrationStatus: citizen?.immigrationStatus || "citizen",
    taxFraudFlag: citizen?.taxFraudFlag || false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCitizen) => {
      const response = await apiRequest("POST", "/api/citizens", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Citizen created successfully",
      });
      onSuccess();
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
    mutationFn: async (data: Partial<InsertCitizen>) => {
      const response = await apiRequest("PUT", `/api/citizens/${citizen!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Citizen updated successfully",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (citizen) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData as InsertCitizen);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {citizen ? "Edit Citizen" : "Add New Citizen"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Citizen ID</Label>
              <Input
                value={formData.citizenId}
                onChange={(e) => handleInputChange("citizenId", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="MIA-123456"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">First Name</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Date of Birth</Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="+1 (305) 555-0123"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Immigration Status</Label>
              <Select 
                value={formData.immigrationStatus} 
                onValueChange={(value) => handleInputChange("immigrationStatus", value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="citizen" className="text-white">Citizen</SelectItem>
                  <SelectItem value="immigrant" className="text-white">Immigrant</SelectItem>
                  <SelectItem value="tourist" className="text-white">Tourist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Photo URL</Label>
              <div className="flex space-x-2">
                <Input
                  value={formData.photoUrl}
                  onChange={(e) => handleInputChange("photoUrl", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                  placeholder="https://example.com/photo.jpg"
                />
                <Button type="button" variant="outline" className="border-slate-600">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Status checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.isWanted}
                onCheckedChange={(checked) => handleInputChange("isWanted", checked)}
                className="border-slate-600"
              />
              <Label className="text-slate-300">Wanted</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.isAmber}
                onCheckedChange={(checked) => handleInputChange("isAmber", checked)}
                className="border-slate-600"
              />
              <Label className="text-slate-300">AMBER Alert</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.isDeceased}
                onCheckedChange={(checked) => handleInputChange("isDeceased", checked)}
                className="border-slate-600"
              />
              <Label className="text-slate-300">Deceased</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.taxFraudFlag}
                onCheckedChange={(checked) => handleInputChange("taxFraudFlag", checked)}
                className="border-slate-600"
              />
              <Label className="text-slate-300">Tax Fraud Flag</Label>
            </div>
          </div>

          {formData.isWanted && (
            <div className="space-y-2">
              <Label className="text-slate-300">Wanted Reason</Label>
              <Textarea
                value={formData.wantedReason}
                onChange={(e) => handleInputChange("wantedReason", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {citizen ? "Update" : "Create"} Citizen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
