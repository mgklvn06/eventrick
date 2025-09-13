import React, { useState, useEffect } from "react";
import { EventCard } from "./dashboard";
import MpesaCheckout from "../components/MpesaPaymentModal";
import "font-awesome/css/font-awesome.min.css";

const categories = [
  "All Categories",
  "Technology",
  "Business",
  "Design",
  "Health",
  "Music",
];

function Event() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showMpesa, setShowMpesa] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        const data = await res.json();
        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
          setFilteredEvents(data.events);
        } else {
          setEvents([]);
          setFilteredEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
        setFilteredEvents([]);
      }
    };

    fetchEvents();
  }, []);

  // Filter events whenever searchTerm or selectedCategory changes
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter((ev) =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (ev) => ev.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const handleBuy = (event) => {
    setSelectedEvent(event);
    setShowMpesa(true);
  };

  const closeMpesa = () => {
    setShowMpesa(false);
    setSelectedEvent(null);
  };

  return (
    <section id="events" className="py-16 px-4">
      <div className="container max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing events happening in your area and beyond
          </p>
        </div>

        {/* Search & Category */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => {}} // optional if you want a manual search button
            className="w-full md:w-32 px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} onBuy={handleBuy} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No events found.
            </p>
          )}
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200">
            Load More Events
          </button>
        </div>
      </div>

      {/* Mpesa Modal */}
      {showMpesa && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 relative">
            <button
              onClick={closeMpesa}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>

            <h3 className="text-xl font-semibold mb-4">{selectedEvent.title}</h3>

            <MpesaCheckout
              amount={selectedEvent.price}
              accountRef={`EVT-${selectedEvent._id}`}
              description={selectedEvent.title}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Event;
