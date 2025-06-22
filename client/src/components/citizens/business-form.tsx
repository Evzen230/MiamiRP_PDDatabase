import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { InsertBusiness } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BusinessFormProps {
  citizenId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BusinessForm({ citizenId, onClose, onSuccess }: BusinessFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    businessLicense: "",
    type: "",
    address: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBusiness) => {
      const response = await apiRequest("POST", "/api/businesses", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business registered successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: [`/api/citizens/${citizenId}/businesses`] });
      onSuccess();
      onClose();
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
    
    const submitData = {
      ...formData,
      ownerId: citizenId,
    };

    createMutation.mutate(submitData as InsertBusiness);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Register Business</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Business Name</Label>
            <Input
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., Miami Burger Joint"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Owner</Label>
            <Input
              value="Current Citizen"
              className="bg-slate-700 border-slate-600 text-slate-400"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Type of Business</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="restaurant" className="text-white">Restaurant</SelectItem>
                <SelectItem value="food_truck" className="text-white">Food Truck</SelectItem>
                <SelectItem value="retail" className="text-white">Retail Store</SelectItem>
                <SelectItem value="service" className="text-white">Service Business</SelectItem>
                <SelectItem value="automotive" className="text-white">Automotive</SelectItem>
                <SelectItem value="construction" className="text-white">Construction</SelectItem>
                <SelectItem value="healthcare" className="text-white">Healthcare</SelectItem>
                <SelectItem value="entertainment" className="text-white">Entertainment</SelectItem>
                <SelectItem value="other" className="text-white">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              Address {formData.type === "food_truck" ? "(License Plate)" : ""}
            </Label>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder={
                formData.type === "food_truck" 
                  ? "e.g., MIA-TRUCK-01" 
                  : "e.g., 456 Business Ave, Miami, FL"
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Business License</Label>
            <Input
              value={formData.businessLicense}
              onChange={(e) => handleInputChange("businessLicense", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., BL-2024-001"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Register Business
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}