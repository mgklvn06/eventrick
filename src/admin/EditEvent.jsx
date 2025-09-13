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
      if (!res.ok) throw new Error(data.message || "❌ Could not update event.");

      setSuccess("✅ Event updated successfully!");
      setTimeout(() => navigate("/manageEvents"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
          <p className="text-gray-500">Update your event details below</p>
        </div>
        <Link
          to="/manageEvents"
          className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
        >
          ← Back to Events
        </Link>
      </div>

      {/* Alerts */}
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-3xl mx-auto"
      >
        {/* Title + Organizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
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

        {/* Date, Time, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
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

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
          />
        </div>

        {/* Price + Tickets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
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

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
