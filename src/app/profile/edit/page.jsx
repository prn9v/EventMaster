"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/auth/session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.fetchedUser);
      } else {
        console.error("Failed to fetch user:", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    try {
      const response = await fetch(`http://localhost:3000/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId: user._id,
          name: user.name,
          description: user.description,
          profilePhoto: newProfilePhoto || user.photo,
        }),
      });

      console.log('response', response);

      const data = await response.json();

      if (data.message === "Profile updated successfully") {
        router.push('/profile');
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto py-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Edit Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center space-y-8">
                  <Avatar className="w-32 h-32 border-4 border-gray-400 shadow-lg">
                    <AvatarImage className=' object-cover object-top'
                      src={newProfilePhoto || user?.photo}
                      alt={user?.name}
                    />
                    <AvatarFallback className="bg-red-100 text-red-600 text-2xl font-bold">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="photo"
                      className="bg-red-600 text-white font-medium px-6 py-3 rounded-full cursor-pointer hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                    >
                      Change Profile Photo
                    </Label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      className="text-lg font-semibold text-gray-700"
                      htmlFor="name"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={user?.name}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition duration-300 ease-in-out text-lg py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-lg font-semibold text-gray-700"
                      htmlFor="description"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={user?.description}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition duration-300 ease-in-out text-base"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-6 py-2 rounded-full transition duration-300 ease-in-out"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-red-600 text-white hover:bg-red-700 px-8 py-2 rounded-full transition duration-300 ease-in-out shadow-md"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </Layout>
  );
}
