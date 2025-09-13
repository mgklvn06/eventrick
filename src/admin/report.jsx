import React, { useEffect, useState } from "react";

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <div className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition ${bgColor}`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="p-2 rounded-full bg-white shadow">{icon}</div>
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
        console.log("✅ Events API response:", data);
        setEvents(data.events || []);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch events:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading report...</p>;
  }

  const safeEvents = Array.isArray(events) ? events : [];

  const totalEvents = safeEvents.length;
  const totalTicketsSold = safeEvents.reduce(
    (sum, ev) => sum + (ev.soldTickets || 0),
    0
  );
  const totalRevenue = safeEvents.reduce(
    (sum, ev) => sum + ((ev.soldTickets || 0) * (ev.price || 0)),
    0
  );

  const revenueByEvent = safeEvents.map((ev) => ({
    eventId: ev._id,
    eventTitle: ev.title,
    ticketsSold: ev.soldTickets || 0,
    revenue: (ev.soldTickets || 0) * (ev.price || 0),
  }));

  const revenueByCategory = Object.values(
    safeEvents.reduce((acc, ev) => {
      const cat = ev.category || "Uncategorized";
      if (!acc[cat]) {
        acc[cat] = { category: cat, ticketsSold: 0, revenue: 0 };
      }
      acc[cat].ticketsSold += ev.soldTickets || 0;
      acc[cat].revenue += (ev.soldTickets || 0) * (ev.price || 0);
      return acc;
    }, {})
  );

  const formatCurrency = (num) =>
    `KES ${Number(num || 0).toLocaleString()}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-gray-500">
            View performance metrics for your events
          </p>
        </div>

        {/* Period filter */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="mt-4 sm:mt-0 border px-3 py-2 rounded-md"
        >
          <option value="all">All Time</option>
          <option value="30d">Last 30 Days</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          color="text-green-600"
          bgColor="bg-green-50"
          icon={<span>💰</span>}
        />
        <StatCard
          title="Tickets Sold"
          value={totalTicketsSold}
          color="text-blue-600"
          bgColor="bg-blue-50"
          icon={<span>🎟️</span>}
        />
        <StatCard
          title="Total Events"
          value={totalEvents}
          color="text-purple-600"
          bgColor="bg-purple-50"
          icon={<span>📅</span>}
        />
        <StatCard
          title="Avg. Revenue/Event"
          value={formatCurrency(
            totalEvents > 0 ? totalRevenue / totalEvents : 0
          )}
          color="text-orange-600"
          bgColor="bg-orange-50"
          icon={<span>📈</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Event */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue by Event</h3>
          <p className="text-gray-500 text-sm mb-4">
            Top performing events by revenue
          </p>
          {revenueByEvent.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No event data available
            </p>
          ) : (
            revenueByEvent
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 10)
              .map((event) => (
                <div
                  key={event.eventId}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{event.eventTitle}</p>
                    <p className="text-xs text-gray-500">
                      {event.ticketsSold} tickets sold
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(event.revenue)}
                  </p>
                </div>
              ))
          )}
        </div>

        {/* Revenue by Category */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue by Category</h3>
          <p className="text-gray-500 text-sm mb-4">
            Performance breakdown by category
          </p>
          {revenueByCategory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No category data available
            </p>
          ) : (
            revenueByCategory.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 mr-2">
                    {cat.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {cat.ticketsSold} tickets
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(cat.revenue)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
