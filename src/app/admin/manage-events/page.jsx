"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);

  const router = useRouter();

  const fetchEventsOfAdmin = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/owner/fetch-events`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        }
      );

      const data = await response.json();
      if (data.message === "Events Fetched Successfully") {
        // Sort events by eventDateFrom in descending order
        const sortedEvents = data.events.sort(
          (a, b) => new Date(b.eventDateFrom) - new Date(a.eventDateFrom)
        );
        setEvents(sortedEvents);
      } else {
        alert("Can't fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Error fetching events.");
    }
  };

  useEffect(() => {
    fetchEventsOfAdmin();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/auth"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white p-4 flex items-center justify-between">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Event Organizer Dashboard</h1>
        </div>
        <button
          className="bg-white text-red-500 text-center py-1 px-3 rounded-md text-2xl font-semibold"
          onClick={handleLogout}
        >
          LogOut
        </button>
      </header>
      <main className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6 flex-col gap-6">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Link href="/admin/dashboard">
              <Button className="bg-red-600 text-white hover:bg-red-700">
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/admin/create-event">
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Create New Event
              </Button>
            </Link>
          </div>
          <div className="w-64">
            <Label htmlFor="search" className="sr-only">
              Search Events
            </Label>
            <Input
              id="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Card className="px-4">
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredEvents.length === 0 ? (
                <p className="text-center text-gray-500">No events found.</p>
              ) : (
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Event Name</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Tickets Sold</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr
                        key={event._id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {event.eventName}
                        </td>
                        <td className="px-6 py-4">
                          {formatDate(event.eventDateFrom)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              event.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : event.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {event.ticketsSold} / {event.ticketAvailable}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/edit-event/${event._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
