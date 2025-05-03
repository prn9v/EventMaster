"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApproveEvents() {
  const [allEvents, setAllEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/events", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setAllEvents(data.events);
      } else {
        console.error("Failed to fetch Events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching Events data:", error);
    }
  };

  const handleAction = async (eventId, status) => {
    try {
      // Remove event locally before making API request
      setAllEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );

      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to update event status:`, response.statusText);
      }
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const pendingEvents = allEvents.filter((event) => event.status === "Pending");

  const formatDateRange = (startDate, endDate, startTime, endTime) => {
    const formattedStartDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(startDate));

    const formattedEndDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(endDate));

    return (
      <>
        {formattedStartDate} - {formattedEndDate} | {startTime} - {endTime}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Approve Events</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className=" text-center items-center gap-10 mb-6">
          <Link href="/owner/dashboard">
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/owner/Messages">
            <Button className="bg-red-600 ml-4 text-white hover:bg-red-700 text-center items-center">
              Messages
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className=" text-center">Pending Event Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingEvents.length > 0 ? (
              <div className="space-y-6">
                {pendingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center"
                  >
                    <div className="flex-1 mr-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {event.eventName}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Organizer: {event.organizerName}
                      </p>
                      <p className="text-gray-600 mb-2">
                        Date:{" "}
                        {formatDateRange(
                          event.eventDateFrom,
                          event.eventDateTo,
                          event.eventTimeFrom,
                          event.eventTimeTo
                        )}
                      </p>
                      <p className="text-gray-600 mb-4">
                        {event.eventDescription}
                      </p>
                      <div className="flex space-x-4">
                        <Button
                          onClick={() => handleAction(event._id, "Approved")}
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleAction(event._id, "Disapproved")}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <img
                        src={event.eventPhoto}
                        alt={event.eventName}
                        className="rounded-lg  object-contain w-96 h-48 max-w-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No pending events.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
