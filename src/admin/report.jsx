import React, { useEffect, useState } from "react";

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <div className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition border ${bgColor}`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-extrabold text-gray-300">{title}</h3>
      <div className="p-2 rounded-full bg-gray-800 shadow">{icon}</div>
    </div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);

const Report = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then((res) => res.json())
      .then((data) => {
        console.log("Events API response:", data);
        setEvents(Array.isArray(data) ? data : data.events || []);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading report...</p>;
  }

  const safeEvents = Array.isArray(events) ? events : [];

  const now = new Date();
  const filteredEvents = safeEvents.filter((ev) => {
    if (!ev.date) return true; 
    const eventDate = new Date(ev.date);

    if (selectedPeriod === "7d") {
      return eventDate >= new Date(now.setDate(now.getDate() - 7));
    }
    if (selectedPeriod === "30d") {
      return eventDate >= new Date(now.setDate(now.getDate() - 30));
    }
    return true; 
  });

  const totalEvents = filteredEvents.length;
  const totalTicketsSold = filteredEvents.reduce(
    (sum, ev) => sum + (ev.soldTickets || 0),
    0
  );
  const totalRevenue = filteredEvents.reduce(
    (sum, ev) => sum + ((ev.soldTickets || 0) * (ev.price || 0)),
    0
  );

  const revenueByEvent = filteredEvents.map((ev) => ({
    eventId: ev._id,
    eventTitle: ev.title,
    ticketsSold: ev.soldTickets || 0,
    revenue: (ev.soldTickets || 0) * (ev.price || 0),
  }));

  const revenueByCategory = Object.values(
    filteredEvents.reduce((acc, ev) => {
      const cat = ev.category || "Uncategorized";
      if (!acc[cat]) {
        acc[cat] = { category: cat, ticketsSold: 0, revenue: 0 };
      }
      acc[cat].ticketsSold += ev.soldTickets || 0;
      acc[cat].revenue += (ev.soldTickets || 0) * (ev.price || 0);
      return acc;
    }, {})
  );

  const formatCurrency = (num) => `KES ${Number(num || 0).toLocaleString()}`;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">
            Reports & Analytics
          </h1>
          <p className="text-gray-400 text-lg font-semibold">
            View performance metrics for your events
          </p>
        </div>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="mt-4 sm:mt-0 border border-purple-700 bg-gray-800 text-gray-200 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-600"
        >
          <option value="all">All Time</option>
          <option value="30d">Last 30 Days</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} color="text-green-400" bgColor="border-green-700 bg-gray-900" icon={<span>💰</span>} />
        <StatCard title="Tickets Sold" value={totalTicketsSold} color="text-blue-400" bgColor="border-blue-700 bg-gray-900" icon={<span>🎟️</span>} />
        <StatCard title="Total Events" value={totalEvents} color="text-purple-400" bgColor="border-purple-700 bg-gray-900" icon={<span>📅</span>} />
        <StatCard title="Avg. Revenue/Event" value={formatCurrency(totalEvents > 0 ? totalRevenue / totalEvents : 0)} color="text-orange-400" bgColor="border-orange-700 bg-gray-900" icon={<span>📈</span>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-xl shadow border border-purple-800">
          <h3 className="text-2xl text-purple-300 font-bold">Revenue by Event</h3>
          <p className="text-gray-400 text-sm mb-4">Top performing events by revenue</p>
          {revenueByEvent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No event data available</p>
          ) : (
            revenueByEvent
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 10)
              .map((event) => (
                <div key={event.eventId} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{event.eventTitle}</p>
                    <p className="text-xs text-gray-500">{event.ticketsSold} tickets sold</p>
                  </div>
                  <p className="text-sm font-semibold text-green-400">{formatCurrency(event.revenue)}</p>
                </div>
              ))
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow border border-purple-800">
          <h3 className="text-2xl text-purple-300 font-bold">Revenue by Category</h3>
          <p className="text-gray-400 text-sm mb-4">Performance breakdown by category</p>
          {revenueByCategory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No category data available</p>
          ) : (
            revenueByCategory.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <span className="inline-block px-2 py-1 text-xs rounded-md bg-purple-800/50 text-purple-300 mr-2">{cat.category}</span>
                  <span className="text-xs text-gray-500">{cat.ticketsSold} tickets</span>
                </div>
                <p className="text-sm font-bold text-green-400">{formatCurrency(cat.revenue)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
