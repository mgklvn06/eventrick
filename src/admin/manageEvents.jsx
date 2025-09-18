import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        const data = await res.json();

        console.log("Fetched events:", data);

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      setDeletingId(id);
      await fetch(`http://localhost:4000/api/events/${id}`, {
        method: "DELETE",
      });
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEvents = Array.isArray(events)
    ? events.filter((ev) =>
        ev.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">
            Manage Events
          </h1>
          <p className="text-gray-400 text-lg">
            Create and manage your events
          </p>
        </div>
        <Link
          to="/createEvent"
          className="inline-flex items-center px-5 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg"
        >
          + Create Event
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm pl-4 pr-3 py-2 text-lg text-gray-100 bg-gray-800 border border-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Event Cards */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-2xl shadow-lg border border-purple-800">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            {searchTerm ? "No events found" : "No events yet"}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Create your first event to get started!"}
          </p>
          {!searchTerm && (
            <Link
              to="/createEvent"
              className="inline-flex items-center px-5 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg"
            >
              + Create Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-gray-900 border border-purple-800 rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-purple-900/50 transition"
            >
              <div>
                <h2 className="text-lg text-purple-300 font-bold">
                  {event.title}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {event.description}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  📅 {event.date} at {event.time}
                </p>
                <p className="text-sm text-gray-400">📍 {event.location}</p>
                <p className="mt-2 text-sm font-bold text-purple-400">
                  💵 KES {event.price}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/EditEvent/${event._id}`}
                  className="flex-1 px-3 py-2 border border-purple-700 rounded-md text-sm text-purple-300 hover:bg-purple-700/30 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  disabled={deletingId === event._id}
                  className="px-3 py-2 border border-red-700 rounded-md text-sm text-red-400 hover:bg-red-900/40 transition"
                >
                  {deletingId === event._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
