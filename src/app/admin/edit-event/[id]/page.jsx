"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function EditEvent({ params }) {
  const router = useRouter();
  const { id } = params;

  const [eventData, setEventData] = useState({
    eventName: "",
    eventLocation: "",
    eventTimeFrom: "",
    eventTimeTo: "",
    eventDateFrom: "",
    eventDateTo: "",
    eventDescription: "",
    eventPrice: "",
    ticketAvailable: "",
    eventCategory: "",
    eventPhoto: null,
  });

  const fetchEventDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/owner/fetch-events/edit/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEventData(data.fetchedEvent);
      } else {
        console.error("Failed to fetch event details");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/owner/fetch-events/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      if (response.ok) {
        router.push("/admin/manage-events");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Network error. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData((prev) => ({ ...prev, eventPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  

  if (!eventData.eventName) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">
            Edit Event: {eventData.eventName}
          </h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Edit Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input fields */}
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={eventData.eventName}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventLocation">Location</Label>
                <Input
                  id="eventLocation"
                  name="eventLocation"
                  value={eventData.eventLocation}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDateFrom">Start Date</Label>
                  <Input
                    id="eventDateFrom"
                    name="eventDateFrom"
                    type="date"
                    value={eventData.eventDateFrom}
                    onChange={handleInputChange}
                  
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDateTo">End Date</Label>
                  <Input
                    id="eventDateTo"
                    name="eventDateTo"
                    type="date"
                    value={eventData.eventDateTo}
                    onChange={handleInputChange}
                    
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventTimeFrom">Start Time</Label>
                  <Input
                    id="eventTimeFrom"
                    name="eventTimeFrom"
                    type="time"
                    value={eventData.eventTimeFrom}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTimeTo">End Time</Label>
                  <Input
                    id="eventTimeTo"
                    name="eventTimeTo"
                    type="time"
                    value={eventData.eventTimeTo}
                    onChange={handleInputChange}
                    
                  />
                </div>
              </div>
              {/* More fields follow the same pattern */}
              {/* Category Select */}
              <div className="space-y-2">
                <Label htmlFor="eventCategory">Category</Label>
                <Select
                  name="eventCategory"
                  value={eventData.eventCategory}
                  onValueChange={(value) =>
                    setEventData({ ...eventData, eventCategory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movies">Movies</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="arts">Arts & Culture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDescription">Description</Label>
                <Textarea
                  id="eventDescription"
                  name="eventDescription"
                  value={eventData.eventDescription}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  rows={4}
                  
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventPrice">Ticket Price (₹)</Label>
                  <Input
                    id="eventPrice"
                    name="eventPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={eventData.eventPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketAvailable">Total Tickets</Label>
                  <Input
                    id="ticketAvailable"
                    name="ticketAvailable"
                    type="number"
                    min="1"
                    value={eventData.ticketAvailable}
                    onChange={handleInputChange}
                    placeholder="Enter number of available tickets"
                    
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventPhoto">Event Photo</Label>
                <Input
                  id="eventPhoto"
                  name="eventPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700"
                >
                  Edit Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
