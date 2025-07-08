"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OwnerDashboard() {
  const [events, setEvents] = useState([]);
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        method: "GET", // Corrected method
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events); // Assuming setAllEvents is correctly define
      } else {
        console.error("Failed to fetch Events:", response.message); // Corrected to use statusText
      }
    } catch (error) {
      console.error("Error fetching Events data:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const allEvents = events.filter((event) => event.status === "Approved");
  const currentDate = new Date();
  const totalEvents = allEvents.length;
  const upcomingEvents = allEvents.filter(
    (event) => new Date(event.eventDateFrom) > currentDate
  );
  const totalTicketsSold = allEvents.reduce(
    (sum, event) => sum + event.ticketsSold,
    0
  );
  const pendingApprovals = events.filter((event) => event.status === "Pending");

  const stats = [
    { title: "Total Events", value: totalEvents },
    { title: "Upcoming Events", value: upcomingEvents.length },
    { title: "Total Tickets Sold", value: totalTicketsSold },
    { title: "Pending Approvals", value: pendingApprovals.length },
  ];

  const topEvents = [...allEvents]
    .sort((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 10);
  const sortedUpcomingEvents = [...upcomingEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

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
    <div className="min-h-screen bg-gray-100 ">
      <header className="bg-red-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mb-8 flex flex-col justify-center items-center">
          <div className=" flex gap-5">
            <Link href="/owner/approve-events">
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Approve Events
              </Button>
            </Link>
            <Link href="/owner/Messages">
              <Button className="bg-red-600 text-white hover:bg-red-700 text-center items-center">
                Messages
              </Button>
            </Link>
          </div>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center items-center ">
              Top 10 Events by Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Event Name</th>
                    <th className="px-6 py-3">Organizer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Tickets Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {topEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {event.eventName}
                      </td>
                      <td className="px-6 py-4">{event.organizerName}</td>
                      <td className="px-6 py-4">
                        {formatDateRange(
                          event.eventDateFrom,
                          event.eventDateTo,
                          event.eventTimeFrom,
                          event.eventTimeTo
                        )}
                      </td>
                      <td className="px-6 py-4">{event.ticketsSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center items-center ">
              All Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Event Name</th>
                    <th className="px-6 py-3">Organizer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Tickets Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {event.eventName}
                      </td>
                      <td className="px-6 py-4">{event.organizerName}</td>
                      <td className="px-6 py-4">
                        {formatDateRange(
                          event.eventDateFrom,
                          event.eventDateTo,
                          event.eventTimeFrom,
                          event.eventTimeTo
                        )}
                      </td>
                      <td className="px-6 py-4">{event.ticketsSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
