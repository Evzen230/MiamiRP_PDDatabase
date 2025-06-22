import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { InsertProperty } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PropertyFormProps {
  citizenId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PropertyForm({ citizenId, onClose, onSuccess }: PropertyFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: "",
    type: "",
    marketValue: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property registered successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: [`/api/citizens/${citizenId}/properties`] });
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
      marketValue: formData.marketValue ? parseInt(formData.marketValue) : null,
    };

    createMutation.mutate(submitData as InsertProperty);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Register Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., 123 Main Street, Miami, FL"
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
            <Label className="text-slate-300">Type of House</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="house" className="text-white">House</SelectItem>
                <SelectItem value="apartment" className="text-white">Apartment</SelectItem>
                <SelectItem value="condo" className="text-white">Condominium</SelectItem>
                <SelectItem value="townhouse" className="text-white">Townhouse</SelectItem>
                <SelectItem value="commercial" className="text-white">Commercial</SelectItem>
                <SelectItem value="warehouse" className="text-white">Warehouse</SelectItem>
                <SelectItem value="office" className="text-white">Office</SelectItem>
                <SelectItem value="land" className="text-white">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Market Value ($)</Label>
            <Input
              type="number"
              value={formData.marketValue}
              onChange={(e) => handleInputChange("marketValue", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., 250000"
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
              Register Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}