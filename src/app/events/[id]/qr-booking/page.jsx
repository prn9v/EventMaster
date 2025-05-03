"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function QRBookingPage({ params }) {
  const router = useRouter();
  const [isBooked, setIsBooked] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.id) {
      setEventId(params.id);
    }
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event data");
        const data = await response.json();
        setEvent(data.fetchedEvent);
      } catch (err) {
        setError("Failed to load event data");
        console.error(err);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
  
        if (token) {
          const response = await fetch(
            `http://localhost:3000/api/auth/session`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Sending token in the Authorization header
              },
            }
          );
          const data = await response.json();
          console.log(data);
  
          if (response.status === 200) {
            setUser(data.fetchedUser);
          }
        }
      } catch (err) {
        console.error("Error fetching user data", err);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  const handleBook = async () => {
    try {
      if (!user || !user._id) {
        throw new Error("User not authenticated or data is missing");
      }

      const response = await fetch(`/api/events/${params.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book event");
      }

      const data = await response.json();
      alert(`${data.event.eventName} booked successfully!`);
      setIsBooked(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-red-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            Event Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && <p className="text-center text-red-600 mb-4">{error}</p>}
          {!isBooked ? (
            <div className="space-y-6">
              {event ? (
                <p className="text-center text-gray-700 text-lg">
                  Would you like to book the{" "}
                  <span className="font-bold">{event.eventName}</span> event?
                </p>
              ) : (
                <p className="text-center text-gray-700 text-lg">
                  Loading event details...
                </p>
              )}

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleBook}
                  className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 w-full sm:w-auto"
                  disabled={!event}
                >
                  Book the Event
                </Button>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 transition-colors duration-300 w-full sm:w-auto"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">
                Booking Confirmed!
              </h2>
              <p className="text-gray-700">Thank you for booking the event.</p>
              <Link href={`/events`} passHref>
                <Button className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-300">
                  Back to Events
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
