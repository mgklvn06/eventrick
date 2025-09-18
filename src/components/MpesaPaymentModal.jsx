import React, { useState } from "react";

function TicketPurchase({ eventId }) {
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!eventId) {
    return <p className="text-red-600"> Missing event ID.</p>;
  }

  const handlePurchase = async () => {
    setLoading(true);
    setMessage("");

    const payload = {
      eventId, 
      ticketQuantity: quantity,
      phoneNumber: phone,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/payments/initiate", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,   
  },
  body: JSON.stringify(payload),
});

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Payment initiated.");
      } else {
        setMessage(" " + (data.message || "Failed"));
      }
    } catch (err) {
      setMessage(" Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl text-white w-96">
      <label>Phone Number:</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 mb-4 rounded text-black"
      />

      <label>Quantity:</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full p-2 mb-4 rounded text-black"
      />

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-green-600 px-4 py-2 rounded w-full"
      >
        {loading ? "Processing..." : `Buy ${quantity} Ticket(s)`}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default TicketPurchase;
