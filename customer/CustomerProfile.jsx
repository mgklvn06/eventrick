import React, { useEffect, useState } from "react";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
        }));
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update profile info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser((prev) => ({ ...prev, name: formData.name, email: formData.email }));

      alert("Profile updated successfully!");
    } catch (err) {
      alert("Profile update failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password change failed");

      alert("Password changed successfully!");

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      alert("Password change failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p className="text-center py-8">Loading profile...</p>;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-500">You need to be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

 <div className="bg-white shadow rounded-lg p-6">
  <h2 className="text-lg font-semibold mb-4 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.79.735 6.879 2.004M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    Account Information
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Email */}
    <div className="flex items-center space-x-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0l-8 8m8-8l-8-8" />
      </svg>
      <div>
        <p className="text-sm font-medium">Email</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>

    {/* Role */}
    <div className="flex items-center space-x-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 .552-.895 2-2 2s-2-1.448-2-2 .895-2 2-2 2 1.448 2 2zM12 11c0 .552.895 2 2 2s2-1.448 2-2-.895-2-2-2-2 1.448-2 2zM12 11v10" />
      </svg>
      <div>
        <p className="text-sm font-medium">Role</p>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            user.role === "admin"
              ? "bg-blue-600 text-white"
              : user.role === "employee"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {user.role}
        </span>
      </div>
    </div>

    {/* Member Since */}
    <div className="flex items-center space-x-3 sm:col-span-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <div>
        <p className="text-sm font-medium">Member since</p>
        <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>
      </div>
    </div>
  </div>
</div>



      {/* Update Profile */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
            {formData.newPassword !== formData.confirmPassword &&
              formData.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
              )}
          </div>

          <button
            type="submit"
            disabled={saving || formData.newPassword !== formData.confirmPassword}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {saving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
