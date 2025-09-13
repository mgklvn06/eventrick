import React, { useEffect, useState } from "react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  // States
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    description: "",
    date: "",
    time: "",
    category: "",
    location: "",
    price: "",
    maxTickets: "",
    imageUrl: "",
  });

  // Helper
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    return fetch(url, { ...options, headers });
  };

  // Fetchers
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

  useEffect(() => {
    if (activeTab === "events") fetchEvents();
    if (activeTab === "users") fetchUsers();
    // tickets fetch can go here later
  }, [activeTab]);

  // Formatters
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

  // Filtering
  const filteredUsers = users.filter(
    (u) =>
      (u.name &&
        u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email &&
        u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredEvents = events.filter(
    (ev) =>
      (ev.title &&
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.description &&
        ev.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Totals
  const totalRevenue = tickets.reduce((sum, t) => {
    const event = events.find((e) => e._id === t.eventId);
    return sum + (event ? Number(event.price) : 0);
  }, 0);

  // Delete handlers
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">
          Manage users, events, and view analytics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Tickets Sold</p>
          <p className="text-2xl font-bold">{tickets.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex space-x-4 border-b">
        {["users", "events", "tickets"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
  <section>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">User Management</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded"
      />
    </div>
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 flex items-center space-x-2">
                {/* Role selector */}
                <select
                  value={u.role}
                  onChange={async (e) => {
                    const newRole = e.target.value;
                    try {
                      await fetchWithAuth(
                        `http://localhost:4000/api/users/${u._id}/role`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ role: newRole }),
                        }
                      );
                      setUsers((prev) =>
                        prev.map((usr) =>
                          usr._id === u._id ? { ...usr, role: newRole } : usr
                        )
                      );
                    } catch (err) {
                      console.error("Error updating role:", err);
                    }
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>

                {/* Delete button */}
                <button
                  onClick={() => handleUserDelete(u._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

      {/* Events */}
      {activeTab === "events" && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Event Management</h2>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev) => (
                  <tr key={ev._id} className="border-t">
                    <td className="p-3">{ev.title}</td>
                    <td className="p-3">{ev.category}</td>
                    <td className="p-3">{formatDate(ev.date)}</td>
                    <td className="p-3">{formatCurrency(ev.price)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEventDelete(ev._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

      {/* Tickets */}
      {activeTab === "tickets" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Ticket Management</h2>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3">Ticket Code</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => {
                  const event = events.find((e) => e._id === t.eventId);
                  const user = users.find((u) => u._id === t.userId);
                  return (
                    <tr key={t._id} className="border-t">
                      <td className="p-3 font-mono">{t.ticketCode}</td>
                      <td className="p-3">{event?.title || "Unknown"}</td>
                      <td className="p-3">{user?.name || "Unknown"}</td>
                      <td className="p-3">{t.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;
