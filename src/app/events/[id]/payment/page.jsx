"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function QRPaymentPage({ params }) {
  const router = useRouter();
  const [eventId, setEventId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  // const [user, setUser] = useState(null);

  // Unwrap params using React.use()
  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setEventId(resolvedParams.id); // Set the eventId
    })();
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        setEvent(data.fetchedEvent);
      } catch (err) {
        setError("Failed to load event data");
      }
    };

    // const fetchUser = async () => {
    //   try {
    //     const response = await fetch(`/api/auth/session`);
    //     const data = await response.json();

    //     setUser(data.fetchedUser);
    //   } catch (error) {
    //     setError("Failed to load user data");
    //   }
    // };

    fetchEvent();
    // fetchUser();
  }, [eventId]);

  // Generate a QR code URL
  const qrCodeUrl = `/events/${eventId}/qr-booking`;

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
          <h1 className="text-2xl font-bold">
            QR Payment for {event?.eventName || "Loading..."}
          </h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600 text-center">
              Scan to Complete Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {event ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-center">
                    Event Summary
                  </h2>
                  <p className="text-center">
                    <span className="font-medium">Event:</span>{" "}
                    {event.eventName}
                  </p>
                  <p className="text-center">
                    <span className="font-medium">Date:</span>{" "}
                    {formatDateRange(
                      event.eventDateFrom,
                      event.eventDateTo,
                      event.eventTimeFrom,
                      event.eventTimeTo
                    )}
                  </p>
                  <p className="text-center">
                    <span className="font-medium">Price:</span> ₹
                    {event.eventPrice}
                  </p>
                </div>

                {!isBooked ? (
                  <>
                    <div className="mb-6 relative">
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          qrCodeUrl
                        )}`}
                        alt="QR Code for payment"
                        width={200}
                        height={200}
                        className={isScanning ? "opacity-50" : ""}
                      />
                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
                        </div>
                      )}
                    </div>
                    {error && (
                      <p className="text-red-600 text-center mt-2">{error}</p>
                    )}
                  </>
                ) : (
                  <div className="text-center mb-6">
                    <svg
                      className="w-16 h-16 text-green-500 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-xl font-semibold text-green-600">
                      Booking Confirmed!
                    </p>
                    <p className="mt-2">Thank you for your purchase.</p>
                  </div>
                )}
              </>
            ) : (
              <p>Loading event details...</p>
            )}

            <Button
              variant="outline"
              className="border-2 border-red-600 text-red-600 hover:bg-red-50 w-full"
              onClick={() => router.back()}
            >
              {isBooked ? "Back to Event" : "Cancel"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
