"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [eventDetails, setEventDetails] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth");
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found");
        return;
      }

      const response = await fetch(`/api/auth/session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedUser = data.fetchedUser;

        if (
          Array.isArray(fetchedUser.eventsBooked) &&
          fetchedUser.eventsBooked.length > 0
        ) {
          const events = await Promise.all(
            fetchedUser.eventsBooked.map(async (eventId) => {
              const eventResponse = await fetch(
                `/api/events/${eventId}`
              );
              if (eventResponse.ok) {
                return await eventResponse.json();
              }
              console.error(`Failed to fetch event with ID: ${eventId}`);
              return null;
            })
          );

          const fetchedEvents = events
            .filter((event) => event && event.fetchedEvent)
            .map((event) => event.fetchedEvent);

          // Separate upcoming and attended events
          const now = Date.now();
          const upcoming = fetchedEvents.filter(
            (event) => new Date(event.eventDateTo) > now
          );
          const attended = fetchedEvents.filter(
            (event) => new Date(event.eventDateTo) <= now
          );

          setUpcomingEvents(upcoming);
          setAttendedEvents(attended);
          setEventDetails(fetchedEvents);
        }

        setUser(fetchedUser);
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
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto py-8 px-6">
          {/* User Profile Card */}
          <Card className="mb-8 relative">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-32 h-32">
                  {user ? (
                    <>
                      <AvatarImage
                        className="object-cover object-top"
                        src={user.photo || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback>
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "?"}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback>?</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-grow space-y-4">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold">
                      {user ? user.name : "Loading..."}
                    </h2>
                    <p className="text-gray-600">
                      {user ? user.description : ""}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-2">
                    <Link href="/profile/edit" passHref>
                      <Button className="bg-red-600 text-white hover:bg-red-700">
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Event Name</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, index) => (
                        <tr
                          key={event._id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {event.eventName}
                          </td>
                          <td className="px-6 py-4">
                            {formatDateRange(
                              event.eventDateFrom,
                              event.eventDateTo,
                              event.eventTimeFrom,
                              event.eventTimeTo
                            )}
                          </td>
                          <td className="px-6 py-4">{event.eventLocation}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No events attended.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Attended Events */}
          <Card>
            <CardHeader>
              <CardTitle>Attended Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Event Name</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendedEvents.length > 0 ? (
                      attendedEvents.map((event, index) => (
                        <tr
                          key={event._id || index}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {event.eventName}
                          </td>
                          <td className="px-6 py-4">
                            {formatDateRange(
                              event.eventDateFrom,
                              event.eventDateTo,
                              event.eventTimeFrom,
                              event.eventTimeTo
                            )}
                          </td>
                          <td className="px-6 py-4">{event.eventLocation}</td>
                          <td className="px-6 py-4">✅</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No events attended.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </Layout>
  );
}
