import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import MpesaCheckout from "../components/MpesaPaymentModal";
import CreateEvent from "../admin/createEvent";

const EventCard = ({ event, onBuy }) => {
  const {
    _id,
    title,
    description,
    date,
    time,
    location,
    price,
    availableTickets,
    category,
    imageUrl,
  } = event;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatPrice = (p) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(
      p
    );

  return (
    <div className="event-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={`http://localhost:4000${event.imageUrl}`} 
          alt={title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=Event+Image";
          }}
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {category}
        </div>
        {availableTickets < 20 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Almost Sold Out!
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-700">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span>
              {formatDate(date)} {time ? ` at ${time}` : ""}
            </span>
          </div>

          <div className="flex items-center text-gray-700">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span>{location}</span>
          </div>

          <div className="flex items-center text-green-600 font-semibold">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{formatPrice(price)}</span>
          </div>

          <div className="flex items-center text-blue-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2H5z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 5a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V7a2 2 0 012-2h3z"
              ></path>
            </svg>
            <span>{availableTickets} tickets available</span>
          </div>
        </div>

        <button
          onClick={() => onBuy && onBuy(event)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Get Tickets
        </button>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    availableTickets: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired
  }).isRequired
};

EventCard.defaultProps = {
  event: {
    id: '',
    title: 'Untitled Event',
    description: 'No description available',
    date: new Date().toISOString().split('T')[0],
    time: '00:00',
    location: 'Location not specified',
    price: 0,
    availableTickets: 0,
    category: 'General',
    imageUrl: 'https://placehold.co/400x300?text=Event+Image'
  }
};

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [showMpesa, setShowMpesa] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || data || []))
      .catch(() => setEvents([]));
  }, []);

   useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || data || []))
      .catch(() => setEvents([]));
  }, []);

  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleBuy = (event) => {
    setSelectedEvent(event);
    setShowMpesa(true);
  };

  return (
    <section className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
      <div className="w-full max-w-5xl space-y-6 px-4">
        <h2 className="text-3xl font-bold mb-2 text-blue-700">Events</h2>

     <CreateEvent onEventCreated={handleEventCreated} />

        <div className="grid gap-6 md:grid-cols-2">
          {events.map((ev) => (
            <EventCard key={ev._id || ev.id} event={ev} onBuy={handleBuy} />
          ))}
        </div>
      </div>

      {showMpesa && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => {
                setShowMpesa(false);
                setSelectedEvent(null);
              }}
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
};

export { EventCard };
export default Dashboard;
