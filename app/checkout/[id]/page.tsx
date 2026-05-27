"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Fetch reservation details on mount (assuming you create a GET endpoint for this)
  useEffect(() => {
    // Mocking the fetch for brevity: you would fetch the reservation `expiresAt` here.
    // Let's assume we grabbed it and it expires 10 mins from now.
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiresAt - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setError("Reservation expired. Your cart has been cleared.");
      } else {
        setTimeLeft(Math.floor(distance / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [params.id]);

  const handleConfirm = async () => {
    setIsProcessing(true);
    const res = await fetch(`/api/reservations/${params.id}/confirm`, {
      method: "POST",
    });

    if (res.status === 410) {
      setError(
        "Too late! Your reservation has expired and the stock was released.",
      );
      setIsProcessing(false);
      return;
    }

    // Redirect to a success page or show success state
    alert("Payment successful! Stock permanently updated.");
    router.push("/");
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    await fetch(`/api/reservations/${params.id}/release`, { method: "POST" });
    router.push("/");
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 font-mono text-sm">
      <div className="border border-[#30363d] bg-[#161b22] p-8 rounded-lg max-w-md w-full shadow-2xl">
        <h1 className="text-xl font-semibold text-white mb-2">Checkout</h1>
        <p className="text-[#8b949e] mb-6">
          Complete your purchase to secure your items.
        </p>

        {error ? (
          <div className="border border-red-900 bg-red-950/30 text-red-400 p-4 rounded-md mb-6 text-center">
            {error}
            <button
              onClick={() => router.push("/")}
              className="block w-full mt-4 bg-[#21262d] text-white py-2 rounded-md hover:bg-[#30363d] transition-colors"
            >
              Return to Products
            </button>
          </div>
        ) : (
          <>
            <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-md flex justify-between items-center mb-6 text-[#c9d1d9]">
              <span>Time remaining:</span>
              <span
                className={`text-lg font-bold ${timeLeft !== null && timeLeft < 60 ? "text-red-400" : "text-green-400"}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="flex-1 border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing || timeLeft === 0}
                className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-md font-medium transition-colors"
              >
                Confirm Purchase
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
