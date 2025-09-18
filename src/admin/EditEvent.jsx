import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const categories = [
  "Technology",
  "Music",
  "Business",
  "Sports",
  "Art",
  "Food",
  "Education",
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/events/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch event");

        const eventData = data.event || data;

        setFormData({
          title: eventData.title || "",
          organizer: eventData.organizer || "",
          description: eventData.description || "",
          date: eventData.date || "",
          time: eventData.time || "",
          category: eventData.category || "",
          location: eventData.location || "",
          price: eventData.price || "",
          maxTickets: eventData.maxTickets || "",
          imageUrl: eventData.imageUrl || "",
        });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:4000/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || " Could not update event.");

      setSuccess(" Event updated successfully!");
      setTimeout(() => navigate("/manageEvents"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-5xl text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight font-bold">Edit Event</h1>
          <p className="text-white text-2xl font-bold">Update your event details below</p>
        </div>
        <Link
          to="/manageEvents"
          className="inline-flex items-center px-4 py-2 rounded-md bg-purple-900 hover:bg-purple-950 text-white text-sm font-medium"
        >
          ← Back to Events
        </Link>
      </div>

      {error && (
        <p className="text-red-600 mb-4 border border-red-300 p-2 rounded bg-red-50">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 mb-4 border border-green-300 p-2 rounded bg-green-50">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg shadow-md space-y-6 max-w-3xl mx-auto text-gray-400 font-bold"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-extrabold text-white">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Organizer
            </label>
            <input
              type="text"
              value={formData.organizer}
              onChange={(e) => handleChange("organizer", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white">Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Maximum Tickets
            </label>
            <input
              type="number"
              value={formData.maxTickets}
              onChange={(e) => handleChange("maxTickets", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Image URL</label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
          />
          {formData.imageUrl && (
            <img
              src={`http://localhost:4000${formData.imageUrl}`}
              alt="Preview"
              className="w-40 h-40 object-cover mt-2 border rounded"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-900 text-white px-4 py-2 rounded-md hover:bg-purple-950"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
