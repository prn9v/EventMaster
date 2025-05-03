"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function CreateEvent() {
  const router = useRouter();
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
    organizerName: "",
    eventCategory: "",
    eventPhoto: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleFileChange = (e) => {
    setEventData({ ...eventData, eventPhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/owner/create-event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      if (response.ok) {
        router.push("/admin/dashboard");
        alert("Event created successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white p-4 flex justify-between items-center">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Create New Event</h1>
        </div>
        <div className="bg-white text-red-500 text-center py-2 px-4 rounded-md text-xl font-sans font-semibold">
          LogOut
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Link href="/admin/dashboard">
            <Button className="bg-red-600 text-white hover:bg-red-700">
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/admin/manage-events">
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Manage Events
            </Button>
          </Link>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={eventData.eventName}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  required
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
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDateFrom">Start Date</Label>
                  <Input
                    id="eventDateFrom"
                    name="eventDateFrom"
                    type="date"
                    value={eventData.eventDateFrom}
                    onChange={handleInputChange}
                    required
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
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventTimeFrom">Start Time</Label>
                  <Input
                    id="eventTimeFrom"
                    name="eventTimeFrom"
                    type="time"
                    value={eventData.eventTimeFrom}
                    onChange={handleInputChange}
                    required
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
                    required
                  />
                </div>
              </div>
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
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="arts">Arts & Culture</SelectItem>
                    <SelectItem value="movies">Movies</SelectItem>
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
                  required
                />
              </div>
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketAvailable">Available Tickets</Label>
                <Input
                  id="ticketAvailable"
                  name="ticketAvailable"
                  type="number"
                  min="1"
                  value={eventData.ticketAvailable}
                  onChange={handleInputChange}
                  placeholder="Enter number of available tickets"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizerName">Organizer Name</Label>
                <Input
                  id="organizerName"
                  name="organizerName"
                  value={eventData.organizerName}
                  onChange={handleInputChange}
                  placeholder="Enter organizer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventPhoto">Event Photo</Label>
                <Input
                  id="eventPhoto"
                  name="eventPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="flex justify-between">
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

