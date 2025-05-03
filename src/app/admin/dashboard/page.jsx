"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [allEvents, setAllEvents] = useState([]);
  const [upcomeEvents, setUpcomeEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
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
        setAllEvents(data.events);
        const now = Date.now();
        const upcoming = data.events.filter(
          (event) => (new Date(event.eventDateTo) > now && event.status === "Approved")
        );
        const attended = data.events.filter(
          (event) => (new Date(event.eventDateTo) <= now && event.status === "Approved")
        );

        setUpcomeEvents(upcoming);
        setAttendedEvents(attended); 
      } else {
        alert("Can't Fetch Events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Error fetching events.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/auth"); // Redirect to login page
  };

  useEffect(() => {
    fetchEventsOfAdmin();
  }, []);

  const events = allEvents.filter((event) => event.status === "Approved");
  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDateTo) > new Date()
  ).length;
  const totalTicketsSold = events.reduce(
    (sum, event) => sum + event.ticketsSold || 0,
    0
  );
  const totalRevenue = events.reduce(
    (sum, event) => sum + event.ticketsSold * event.eventPrice || 0,
    0
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

  const stats = [
    { title: "Total Events", value: totalEvents },
    { title: "Upcoming Events", value: upcomingEvents },
    { title: "Total Tickets Sold", value: totalTicketsSold },
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white p-4 flex items-center">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Event Organizer Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className=" bg-white text-red-500 text-center py-1 px-3 rounded-md text-2xl font-semibold"
        >
          LogOut
        </button>
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
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Link href="/admin/create-event">
            <Button className="bg-red-600 text-white hover:bg-red-700">
              Create New Event
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
        <Card>
          <CardHeader>
            <CardTitle className="items-center text-center">
              Your Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Event Name</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Tickets Sold</th>
                    <th className="px-6 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomeEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {event.eventName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">Date:</span>{" "}
                        {formatDateRange(
                          event.eventDateFrom,
                          event.eventDateTo,
                          event.eventTimeFrom,
                          event.eventTimeTo
                        )}
                      </td>
                      <td className="px-6 py-4">{event.ticketsSold}</td>
                      <td className="px-6 py-4">
                        ₹{event.ticketsSold * event.eventPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <br></br>
        <Card>
          <CardHeader>
            <CardTitle className="items-center text-center">
              Your Previous Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Event Name</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Tickets Sold</th>
                    <th className="px-6 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {attendedEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {event.eventName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">Date:</span>{" "}
                        {formatDateRange(
                          event.eventDateFrom,
                          event.eventDateTo,
                          event.eventTimeFrom,
                          event.eventTimeTo
                        )}
                      </td>
                      <td className="px-6 py-4">{event.ticketsSold}</td>
                      <td className="px-6 py-4">
                        ₹{event.ticketsSold * event.eventPrice}
                      </td>
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
