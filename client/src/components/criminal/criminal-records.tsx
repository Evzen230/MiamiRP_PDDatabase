import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2, Save, AlertTriangle } from "lucide-react";
import { CriminalRecord, InsertCriminalRecord } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function CriminalRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CriminalRecord | null>(null);
  const [formData, setFormData] = useState({
    citizenId: "",
    crimeType: "",
    description: "",
    dateOfCrime: "",
    status: "active",
    fine: "",
    isPaid: false,
    jailTime: "",
    courtDate: "",
  });

  const { toast } = useToast();
  const { user } = useAuth();

  const { data: records = [], isLoading, refetch } = useQuery<CriminalRecord[]>({
    queryKey: ["/api/criminal-records"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCriminalRecord) => {
      const response = await apiRequest("POST", "/api/criminal-records", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Criminal record created successfully",
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

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === "" ||
      record.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.citizenId.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "" || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      citizenId: "",
      crimeType: "",
      description: "",
      dateOfCrime: "",
      status: "active",
      fine: "",
      isPaid: false,
      jailTime: "",
      courtDate: "",
    });
    setSelectedRecord(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      citizenId: parseInt(formData.citizenId),
      fine: formData.fine ? parseInt(formData.fine) : null,
    };

    createMutation.mutate(submitData as InsertCriminalRecord);
  };

  const getStatusBadge = (record: CriminalRecord) => {
    switch (record.status) {
      case "active":
        return <Badge variant="destructive">ACTIVE</Badge>;
      case "resolved":
        return <Badge variant="default" className="bg-green-600">RESOLVED</Badge>;
      case "warrant":
        return <Badge variant="destructive" className="bg-orange-600">WARRANT</Badge>;
      default:
        return <Badge variant="secondary">{record.status.toUpperCase()}</Badge>;
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Check if user can add criminal records
  const canAddRecords = user?.role && ["MPD", "FHP", "FSD", "Director_MPD", "Director_FHP", "Director_FSD", "IT"].includes(user.role);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Criminal Records</CardTitle>
            {canAddRecords && (
              <Button 
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            )}
          </div>
          
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                placeholder="Search by crime type or citizen ID..."
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="" className="text-white">All Status</SelectItem>
                <SelectItem value="active" className="text-white">Active</SelectItem>
                <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
                <SelectItem value="warrant" className="text-white">Warrant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Loading criminal records...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Citizen ID</TableHead>
                  <TableHead className="text-slate-300">Crime Type</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Fine</TableHead>
                  <TableHead className="text-slate-300">Court Date</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="border-slate-700 hover:bg-slate-700">
                    <TableCell>
                      <div className="text-white font-medium">{record.citizenId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{record.crimeType}</div>
                      {record.description && (
                        <div className="text-slate-400 text-sm truncate max-w-xs">
                          {record.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">{record.dateOfCrime}</TableCell>
                    <TableCell>{getStatusBadge(record)}</TableCell>
                    <TableCell>
                      <div className="text-slate-300">{formatCurrency(record.fine)}</div>
                      {record.fine && (
                        <div className={`text-xs ${record.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                          {record.isPaid ? "Paid" : "Unpaid"}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {record.courtDate || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canAddRecords && (
                          <>
                            <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredRecords.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No criminal records found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Criminal Record Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Add Criminal Record</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label className="text-slate-300">Crime Type</Label>
                <Input
                  value={formData.crimeType}
                  onChange={(e) => setFormData(prev => ({ ...prev, crimeType: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Speeding, Theft, Assault"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Date of Crime</Label>
                <Input
                  type="date"
                  value={formData.dateOfCrime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfCrime: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="active" className="text-white">Active</SelectItem>
                    <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
                    <SelectItem value="warrant" className="text-white">Warrant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Fine Amount ($)</Label>
                <Input
                  type="number"
                  value={formData.fine}
                  onChange={(e) => setFormData(prev => ({ ...prev, fine: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Court Date</Label>
                <Input
                  type="date"
                  value={formData.courtDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, courtDate: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
                placeholder="Additional details about the crime..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Jail Time</Label>
              <Input
                value={formData.jailTime}
                onChange={(e) => setFormData(prev => ({ ...prev, jailTime: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 30 days, 6 months"
              />
            </div>

            {formData.fine && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: !!checked }))}
                  className="border-slate-600"
                />
                <Label className="text-slate-300">Fine has been paid</Label>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
