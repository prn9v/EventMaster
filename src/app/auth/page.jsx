"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData(e.currentTarget);
    const userData = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      role: data.get("role"),
    };
  
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/${activeTab}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
  
      const data = await response.json();
      console.log("Success:", data);
  
      const token = data.token;
      localStorage.setItem("authToken", token); // Store token securely
      alert(`Welcome, ${data.user.name}`);
      if (data.user.role === 'Admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-red-600 text-white p-6">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to EventMaster
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              defaultValue="login"
              onValueChange={(value) => setActiveTab(value)}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-lg p-1">
                <TabsTrigger
                  value="login"
                  className="py-2 text-sm font-medium transition-colors data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="py-2 text-sm font-medium transition-colors data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      // value={formData.email}
                      // onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      // value={formData.password}
                      // onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 text-white"
                  >
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      // value={formData.name}
                      // onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      // value={formData.email}
                      // onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      // value={formData.password}
                      // onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-sm font-medium text-gray-700"
                    >
                      User Type
                    </Label>
                    <select
                      id="role"
                      name="role"
                      // value={formData.role}
                      // onChange={handleChange}
                      required
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select user type</option>
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 text-white"
                  >
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
