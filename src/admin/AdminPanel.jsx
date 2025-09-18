import React, { useEffect, useState } from "react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    return fetch(url, { ...options, headers });
  };

  const fetchEvents = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:4000/api/events");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch events");
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:4000/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:4000/api/tickets");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === "events") fetchEvents();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "tickets") fetchTickets();
  }, [activeTab]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredUsers = users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredEvents = events.filter(
    (ev) =>
      (ev.title && ev.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.description &&
        ev.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = tickets.reduce((sum, t) => {
    const event = events.find((e) => e._id === t.eventId);
    return sum + (event ? Number(event.price) : 0);
  }, 0);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:4000/api/users/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role. Check backend logs.");
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchWithAuth(`http://localhost:4000/api/users/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEventDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetchWithAuth(`http://localhost:4000/api/events/${id}`, {
        method: "DELETE",
      });
      setEvents(events.filter((ev) => ev._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-gray-400 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-5xl text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight font-bold">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-2xl font-bold">
          Manage users, events, and view analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Users", value: users.length, color: "text-purple-400" },
          { label: "Total Events", value: events.length, color: "text-purple-400" },
          { label: "Tickets Sold", value: tickets.length, color: "text-blue-400" },
          { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "text-green-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gray-900 border border-purple-800 p-4 rounded-lg shadow`}
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex space-x-4 border-b border-gray-700">
        {["users", "events", "tickets"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-purple-400 text-purple-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-purple-400 font-semibold">User Management</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-gray-200 border border-gray-700 p-2 rounded focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="overflow-x-auto bg-gray-900 shadow rounded-lg">
            <table className="w-full text-left text-gray-200">
              <thead className="bg-gray-800 text-purple-300 font-bold">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr
                    key={u._id}
                    className={`border-t border-gray-700 ${
                      i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-gray-700`}
                  >
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3 flex items-center space-x-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="customer">Customer</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleUserDelete(u._id)}
                        className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "events" && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-purple-400 font-semibold">Event Management</h2>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-gray-200 border border-gray-700 p-2 rounded focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="overflow-x-auto bg-gray-900 shadow rounded-lg">
            <table className="w-full text-left text-gray-200">
              <thead className="bg-gray-800 text-purple-300 font-bold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev, i) => (
                  <tr
                    key={ev._id}
                    className={`border-t border-gray-700 ${
                      i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-gray-700`}
                  >
                    <td className="p-3">{ev.title}</td>
                    <td className="p-3">{ev.category}</td>
                    <td className="p-3">{formatDate(ev.date)}</td>
                    <td className="p-3">{formatCurrency(ev.price)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEventDelete(ev._id)}
                        className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "tickets" && (
        <section>
          <h2 className="text-xl text-purple-400 font-semibold mb-4">
            Ticket Management
          </h2>
          <div className="overflow-x-auto bg-gray-900 shadow rounded-lg">
            <table className="w-full text-left text-gray-200">
              <thead className="bg-gray-800 text-purple-300 font-bold">
                <tr>
                  <th className="p-3">Ticket Code</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t, i) => (
                  <tr
                    key={t._id}
                    className={`border-t border-gray-700 ${
                      i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-gray-700`}
                  >
                    <td className="p-3 font-mono">{t.ticketCode || "—"}</td>
                    <td className="p-3">{t.eventId?.title || "Unknown"}</td>
                    <td className="p-3">{t.userId?.email || "Unknown"}</td>
                    <td className="p-3">{t.paymentStatus || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;
