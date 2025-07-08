"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, User, MessageSquare } from "lucide-react";
import Layout from "@/components/layout";
import Link from "next/link";
const API_BASE_URL = process.env.API_BASE_URL;

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/message`, {
          method: "GET",
        });
        const result = await response.json();

        if (response.ok) {
          setMessages(result.data); // Use result.data since API returns `{ message, data }`
        } else {
          console.error("Error:", result.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (messageId) => {
    try {
      const response = await fetch(`/api/message`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }), // Send messageId in body
      });

      const result = await response.json();

      if (response.ok) {
        setMessages(result.data); // Update state with new messages list
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <>
      <header className="bg-red-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Messages Of Users</h1>
        </div>
      </header>

      <div className=" mt-6 text-center items-center gap-10 mb-6">
          <Link href="/owner/dashboard">
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/owner/approve-events">
            <Button className="bg-red-600 ml-4 text-white hover:bg-red-700 text-center items-center">
              Approve Events
            </Button>
          </Link>
        </div>

      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Messages
          </h1>
          {loading ? (
            <div className="text-center">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-600">No messages found.</div>
          ) : (
            <div className="space-y-6">
              {messages.map((item) => (
                <Card
                  key={item._id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-600 rounded-full p-2 mr-4">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {item.name}
                        </h2>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {item.email}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.subject}
                      </h3>
                      <p className="text-gray-700">{item.message}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-300"
                      >
                        DELETE
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
