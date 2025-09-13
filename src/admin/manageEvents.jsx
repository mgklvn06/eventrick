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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
          <p className="text-gray-500">Create and manage your events</p>
        </div>
        <Link
          to="/createEvent"
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          + Create Event
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm pl-3 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
        />
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? "No events found" : "No events yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Create your first event to get started!"}
          </p>
          {!searchTerm && (
            <Link
              to="/createEvent"
              className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
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
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p className="text-gray-500 text-sm">{event.description}</p>
                <p className="mt-2 text-sm">
                  {event.date} at {event.time}
                </p>
                <p className="text-sm text-gray-500">{event.location}</p>
                <p className="mt-1 text-sm font-medium text-blue-600">
                  KES{event.price}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                {/* Edit event */}
                <Link
                  to={`/EditEvent/${event._id}`}
                  className="flex-1 px-3 py-2 border rounded-md text-sm text-center hover:bg-gray-50"
                >
                  Edit
                </Link>
                {/* Delete event */}
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  disabled={deletingId === event._id}
                  className="px-3 py-2 border rounded-md text-sm text-red-600 hover:bg-red-50"
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
