"use client";
import Layout from "@/components/layout";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/events", {
        method: "GET", // Corrected method
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events); // Assuming setAllEvents is correctly defined
      } else {
        console.error("Failed to fetch Events:", response.message); // Corrected to use statusText
      }
    } catch (error) {
      console.error("Error fetching Events data:", error);
    }
  };

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
    return (
      <>
        {formattedStartDate} - {formattedEndDate} <br />
        <p className=" mt-2">Time: {startTime} - {endTime}</p>
      </>
    );
  };

  const allEvents = events.filter((event) => event.status === "Approved");

  useEffect(() => {
    fetchEvents();
  }, []);

  const categories = [
    ...new Set(allEvents.map((event) => event.eventCategory)),
  ];

  const filteredEvents = allEvents.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || event.eventCategory === selectedCategory)
  );

  return (
    <Layout>
      <div className="bg-gradient-to-r bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center text-red-500 mb-12">
            Upcoming Events
          </h1>

          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
            <input
              type="text"
              placeholder="Search events..."
              className="mb-4 sm:mb-0 p-3 border border-gray-300 rounded-md w-full sm:w-64 text-black shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border border-gray-300 rounded-md w-full sm:w-64 text-black shadow-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link href={`/events/${event._id}`} key={event._id}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  <img
                    src={event.eventPhoto}
                    alt={event.eventName}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">
                      {event.eventName}
                    </h2>
                    <p className="text-gray-700 mb-2">
                      Date:{" "}
                      {formatDateRange(
                        event.eventDateFrom,
                        event.eventDateTo,
                        event.eventTimeFrom,
                        event.eventTimeTo
                      )}
                    </p>
                    <p className="text-gray-600 mb-4">{event.eventLocation}</p>
                    <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {event.eventCategory}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <p className="text-center text-white mt-8">
              No events found. Please try a different search or category.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
