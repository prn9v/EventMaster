"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);

  // Fetch Events from API
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setAllEvents(data.events || []); // Handle case if `data.events` is undefined
      } else {
        console.error("Failed to fetch Events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching Events data:", error);
    }
  };

  const events = allEvents.filter((event) => event.status === "Approved");

  // Initial Fetch of Events
  useEffect(() => {
    fetchEvents();
  }, []);

  // Only shuffle on the client to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined" && events.length > 0) {
      const shuffled = [...events].sort(() => 0.5 - Math.random());
      const newFeaturedEvents = shuffled.slice(0, 6);
      if (JSON.stringify(newFeaturedEvents) !== JSON.stringify(featuredEvents)) {
        setFeaturedEvents(newFeaturedEvents);
      }
    }
    // eslint-disable-next-line
  }, [events]);

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        'To create an account, click on the "Login" button in the top right corner and select "Sign Up". Fill in your details and follow the prompts to complete your registration.',
    },
    {
      question: "Can I sell tickets to my own event?",
      answer:
        "Yes! EventMaster allows event organizers to create and sell tickets to their events. You'll need to create an organizer account and submit your event for approval.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major credit cards (Visa, MasterCard, American Express) and PayPal. Some events may also offer additional payment options.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team by emailing support@eventmaster.com or by using the contact form on our Contact page. We aim to respond to all inquiries within 24 hours.",
    },
  ];

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
        <p >Time: {startTime} - {endTime}</p>
      </>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Events</h1>
          <p className="text-xl mb-8">
            Find and book tickets for the hottest events in your area
          </p>
          <Link
            href="/events"
            className="bg-white text-red-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="min-h-screen py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            Featured Events
          </h2>
          {featuredEvents.length === 0 ? (
            <p className="text-center text-gray-600">
              No featured events available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <img
                    src={event.eventPhoto || "/3.jpg"}
                    alt={event.eventName || "Event"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 ">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {event.eventName || "Unnamed Event"}
                    </h3>
                    Date:{" "}
                      {formatDateRange(
                        event.eventDateFrom,
                        event.eventDateTo,
                        event.eventTimeFrom,
                        event.eventTimeTo
                      )}
                    <Link
                      href={`/events/${event._id}`}
                      className=" text-lg text-red-600 font-semibold hover:text-red-800 transition duration-300"
                    >
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EventMaster
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 inline-block mb-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Easy Event Discovery
              </h3>
              <p className="text-gray-600">
                Find events that match your interests with our powerful search
                and recommendation engine.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 inline-block mb-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Ticketing</h3>
              <p className="text-gray-600">
                Book tickets with confidence using our secure and reliable
                ticketing system.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 inline-block mb-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals and build your network
                through our events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className=" h-[580px] py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-black text-center mt-8 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="flex justify-between items-center w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-300"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-600">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 ${
                      openFaq === index ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="mt-2 p-4 bg-white rounded-lg shadow">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className=" h-72 bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Amazing Events?
          </h2>
          <p className="text-xl mb-8">
            Join EventMaster today and start discovering unforgettable
            experiences.
          </p>
          <Link
            href="/auth"
            className="bg-white text-red-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
