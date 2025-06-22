import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Database } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    username: "", 
    password: "", 
    role: "", 
    department: "" 
  });

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerForm);
  };

  const roles = [
    { value: "DMV", label: "DMV" },
    { value: "MPD", label: "MPD Officer" },
    { value: "FHP", label: "FHP Officer" },
    { value: "FSD", label: "FSD Officer" },
    { value: "ICE", label: "ICE Agent" },
    { value: "IRS", label: "IRS Agent" },
    { value: "Director_MPD", label: "MPD Director" },
    { value: "Director_FHP", label: "FHP Director" },
    { value: "Director_FSD", label: "FSD Director" },
    { value: "IT", label: "IT Department" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-900">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-white">Miami RP Database</CardTitle>
            <CardDescription className="text-slate-400">
              Law Enforcement Access Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="login" className="text-slate-300 data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-slate-300 data-[state=active]:text-white">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-slate-300">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-slate-300">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-slate-300">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role" className="text-slate-300">Role</Label>
                    <Select onValueChange={(value) => setRegisterForm(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {roles.map(role => (
                          <SelectItem key={role.value} value={role.value} className="text-white focus:bg-slate-600">
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-department" className="text-slate-300">Department</Label>
                    <Input
                      id="register-department"
                      type="text"
                      value={registerForm.department}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, department: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter department"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Registering..." : "Register"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-lg">
          <div className="flex justify-center space-x-8 mb-8">
            <Users className="h-16 w-16 text-blue-400" />
            <Database className="h-16 w-16 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-6">
            Miami RP Database System
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Comprehensive citizen database management system for law enforcement agencies
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-400 mb-2">Citizens Database</h3>
              <p className="text-slate-400">Complete citizen records with photos, licenses, and criminal history</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-2">Vehicle Registry</h3>
              <p className="text-slate-400">License plate tracking and vehicle ownership records</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-400 mb-2">Criminal Records</h3>
              <p className="text-slate-400">Track violations, fines, and wanted individuals</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-2">Role-Based Access</h3>
              <p className="text-slate-400">Secure access control for different departments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
