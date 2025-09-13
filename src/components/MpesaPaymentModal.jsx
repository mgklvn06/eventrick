import React, { useState, useEffect, useRef } from "react";

/**
 * Robust Mpesa checkout + polling UI.
 * - Uses absolute backend URLs (adjust if your backend runs elsewhere)
 * - Handles non-JSON responses and HTTP 5xx/4xx from status endpoint
 * - No reassignment of consts
 */
export default function MpesaCheckout({ amount = 1000, accountRef = "EVENT-TICKET", description = "Ticket purchase" }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const pollRef = useRef(null);
  const timeoutRef = useRef(null);
  const failCountRef = useRef(0);
  const BACKEND = "http://localhost:4000"; // adjust if backend is different

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const normalizePhone = (s) => {
    if (!s) return "";
    let v = s.replace(/\D/g, "");
    if (v.startsWith("0")) v = "254" + v.slice(1);
    if (v.startsWith("7")) v = "254" + v;
    if (v.startsWith("+")) v = v.slice(1);
    return v;
  };

  const safeParse = (text) => {
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  };

  const startPolling = (id) => {
    if (!id) return;
    // clear any existing poll
    if (pollRef.current) clearInterval(pollRef.current);
    failCountRef.current = 0;
    pollRef.current = setInterval(async () => {
      try {
        const url = `${BACKEND}/api/mpesa/status?checkoutRequestID=${encodeURIComponent(id)}`;
        const res = await fetch(url, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
        // if server returns 304 continue
        if (res.status === 304) return;
        const text = await res.text().catch(() => "");
        // handle non-ok responses
        if (!res.ok) {
          const payload = safeParse(text);
          console.warn("Status poll error:", res.status, payload);
          failCountRef.current += 1;
          // stop after 5 consecutive failures to avoid tight infinite loop
          if (failCountRef.current > 5) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setLoading(false);
            setError("Unable to get status from server (multiple errors). Try again later.");
          }
          return;
        }
        // reset fail count on success
        failCountRef.current = 0;
        const payload = safeParse(text);
        const s = payload?.status || payload?.Status || payload?.state || (typeof payload === "string" ? payload : null);
        console.debug("Polled status payload:", payload);
        if (s) setStatus(s);
        // stop polling when final
        if (s === "success" || s === "completed" || s === "failed" || s === "cancelled") {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setLoading(false);
        }
      } catch (err) {
        console.warn("Polling failed:", err);
        failCountRef.current += 1;
        if (failCountRef.current > 5) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setLoading(false);
          setError("Polling failed repeatedly — check backend.");
        }
      }
    }, 3000);
  };

  const handlePay = async (e) => {
    e?.preventDefault();
    setError(null);
    setStatus(null);
    setCheckoutId(null);
    const msisdn = normalizePhone(phone);
    if (!/^2547\d{8}$/.test(msisdn)) {
      setError("Invalid phone. Use 07XXXXXXXX or 2547XXXXXXXX.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/mpesa/stkpush`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: msisdn, amount, accountRef, description }),
      });

      const text = await res.text().catch(() => "");
      const payload = safeParse(text);
      console.log("STK push response:", res.status, payload);

      if (!res.ok) {
        const detail = typeof payload === "string" ? payload : payload?.message || JSON.stringify(payload);
        throw new Error(`STK Push failed (${res.status}) - ${detail}`);
      }

      const responseCode = payload?.ResponseCode || payload?.responseCode || payload?.response_code || null;
      const customerMessage = payload?.CustomerMessage || payload?.customerMessage || payload?.message || null;

      if (responseCode && String(responseCode) !== "0") {
        throw new Error(customerMessage || `Daraja returned ResponseCode ${responseCode}`);
      }

      const id = payload?.checkoutRequestID || payload?.CheckoutRequestID || payload?.CheckoutRequestId || payload?.requestId || payload?.request_id || null;
      setCheckoutId(id || null);
      setStatus(customerMessage || "waiting_for_payment");

      if (id) {
        startPolling(id);
      } else {
        // no checkout id returned — attempt a single poll to let backend respond if it uses a different key
        startPolling(""); // harmless, startPolling will bail out if id falsy
      }

      // safety timeout: stop waiting after 2 minutes
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setLoading(false);
        setError("No confirmation received within 2 minutes. If you didn't get the M-Pesa prompt, try again.");
      }, 2 * 60 * 1000);

    } catch (err) {
      console.error("STK push error:", err);
      setError(err.message || "Payment initiation failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handlePay} className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XXXXXXXX or +2547XXXXXXXX"
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
          <input type="number" value={amount} readOnly className="mt-1 block w-full p-2 border rounded bg-gray-50" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60">
          {loading ? "Processing..." : `Pay ${amount} KES`}
        </button>

        <div className="mt-3 text-sm">
          {error && <div className="text-red-600">{error}</div>}
          {status === "waiting_for_payment" && <div className="text-yellow-600">Waiting — enter your M-Pesa PIN when prompt appears.</div>}
          {status === "success" && <div className="text-green-600">Payment successful — ticket confirmed.</div>}
          {status === "failed" && <div className="text-red-600">Payment failed or cancelled.</div>}
          {checkoutId && <div className="text-gray-700 mt-2">Checkout ID: {checkoutId}</div>}
        </div>
      </form>
    </div>
  );
}