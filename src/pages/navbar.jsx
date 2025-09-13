import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [rawUser, setRawUser] = useState(null); 
  const [user, setUser] = useState(null); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const safeParse = (v) => {
    if (!v) return null;
    try { return JSON.parse(v); } catch { return null; }
  };

  const normalize = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const token = obj.accessToken || obj.token || obj.access_token || null;
    const role = obj.role || (obj.user && obj.user.role) || null;
    const name = obj.name || obj.user?.name || obj.user?.fullName || obj.fullName || null;
    const email = obj.email || obj.user?.email || null;
    return { name, email, role: role || "customer", token };
  };

  useEffect(() => {
    const load = () => {
      const raw = safeParse(localStorage.getItem("user"));
      setRawUser(raw);
      setUser(normalize(raw));
    };
    load();

    const onStorage = (e) => { if (e.key === "user") load(); };
    const onUserChanged = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("user-changed", onUserChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user-changed", onUserChanged);
    };
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [dropdownOpen]);

  const isAuthenticated = Boolean(user?.token || user?.role);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-changed"));
    setDropdownOpen(false);
    navigate("/login");
  };

  const avatarInitial = user?.name ? String(user.name).charAt(0).toUpperCase() : (user?.role ? String(user.role).charAt(0).toUpperCase() : "U");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">Eventrick</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/events" className="text-gray-700 hover:text-gray-900">Events</Link>

          {(user?.role === "admin" || user?.role === "employee") && (
            <>
              <Link to="/manageEvents" className="text-gray-700 hover:text-gray-900">Manage Events</Link>
              <Link to="/report" className="text-gray-700 hover:text-gray-900">Reports</Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/AdminPanel" className="text-gray-700 hover:text-gray-900">Admin Panel</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
              <Link to="/signin" className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Sign Up</Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((s) => !s)}
                className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-gray-100 focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {avatarInitial}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-800">{user?.name || user?.role || "User"}</span>
                  <span className="text-xs text-gray-500">{user?.email || user?.role}</span>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border">
                  <div className="px-4 py-3 border-b">
                    <div className="text-sm font-semibold">{user?.name || "User"}</div>
                    <div className="text-xs text-gray-500">{user?.email || ""}</div>
                    <div className="text-xs text-gray-500">Role: {user?.role}</div>
                  </div>

                  <ul className="py-2">
                    <li>
                      <Link to="/CustomerProfile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                    </li>
                  </ul>

                  <div className="px-4 py-2 border-t">
                    <button onClick={handleLogout} className="w-full text-left text-sm text-red-600 hover:text-red-700">Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;