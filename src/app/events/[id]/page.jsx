"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";

export default function EventPage({ params }) {
  const [event, setEvent] = useState(null); // State to hold event data
  const router = useRouter(); // Access Next.js router

  const fetchEvent = async (eventId) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}`,
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
        setEvent(data.fetchedEvent);
      } else {
        console.error("Failed to fetch event details");
        const errorData = await response.json();
        console.error("Error details:", errorData.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    if (params && params.id) {
      fetchEvent(params.id);
    }
  }, [params]);

  const formatDateRange = (startDate, endDate, startTime, endTime) => {
    // Format the dates
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

    // Return formatted string
    return `${formattedStartDate} - ${formattedEndDate} | ${startTime} - ${endTime}`;
  };

  // Render loading state if event data is not yet loaded
  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading event details...</p>
        </div>
      </Layout>
    );
  }

  const result = formatDateRange(
    event.eventDateFrom,
    event.eventDateTo,
    event.eventTimeFrom,
    event.eventTimeTo
  );

  return (
    <Layout>
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-24 bg-white text-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={event.eventPhoto}
              alt={event.eventName}
              className="w-full h-auto border border-black rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              {event.eventName}
            </h1>
            <p className="text-lg text-gray-700 mb-2">{result}</p>
            <p className="text-lg text-gray-700 mb-4">{event.eventLocation}</p>
            <p className="text-2xl font-semibold text-red-500 mb-4">
              ₹{event.eventPrice.toFixed(2)}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              {event.eventDescription}
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Tickets available: {event.ticketAvailable}
            </p>
            <Link href={`/events/${event._id}/payment`}>
              <button className="bg-red-600 text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition duration-300">
                Book Now
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Event Details
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-xl font-medium text-gray-900">
                Additional Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-lg font-medium text-gray-500">
                    Organizer
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                    {event.organizerName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-lg font-medium text-gray-500">
                    Category
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                    {event.eventCategory}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-lg font-medium text-gray-500">
                    Refund Policy
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                    Full refund available up to 7 days before the event
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/events"
            className="text-red-600 hover:text-red-800 font-semibold text-lg"
          >
            &larr; Back to All Events
          </Link>
        </div>
      </div>
    </Layout>
  );
}
