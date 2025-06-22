import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { InsertVehicle } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VehicleFormProps {
  citizenId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VehicleForm({ citizenId, onClose, onSuccess }: VehicleFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "",
    color: "",
    licensePlate: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    modifications: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertVehicle) => {
      const response = await apiRequest("POST", "/api/vehicles", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle registered successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      queryClient.invalidateQueries({ queryKey: [`/api/citizens/${citizenId}/vehicles`] });
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

    createMutation.mutate(submitData as InsertVehicle);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Register Vehicle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Type of Car</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="sedan" className="text-white">Sedan</SelectItem>
                  <SelectItem value="suv" className="text-white">SUV</SelectItem>
                  <SelectItem value="truck" className="text-white">Truck</SelectItem>
                  <SelectItem value="coupe" className="text-white">Coupe</SelectItem>
                  <SelectItem value="hatchback" className="text-white">Hatchback</SelectItem>
                  <SelectItem value="convertible" className="text-white">Convertible</SelectItem>
                  <SelectItem value="motorcycle" className="text-white">Motorcycle</SelectItem>
                  <SelectItem value="van" className="text-white">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Color</Label>
              <Input
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., Black, White, Red"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">License Plate</Label>
              <Input
                value={formData.licensePlate}
                onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., MIA-2024"
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
              <Label className="text-slate-300">Make</Label>
              <Input
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., Toyota, Ford, BMW"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Model</Label>
              <Input
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., Camry, F-150, X5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Year</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white"
                min="1900"
                max="2025"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Modifications (if any)</Label>
            <Textarea
              value={formData.modifications}
              onChange={(e) => handleInputChange("modifications", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
              placeholder="Describe any modifications to the vehicle..."
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
              Register Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}