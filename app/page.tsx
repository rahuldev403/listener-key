"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // In a real app, use SWR or React Query. Using fetch for simplicity here.
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleReserve = async (stockId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockId, quantity: 1 }),
      });

      if (res.status === 409) {
        setError(
          "Not enough stock available. Another customer just reserved the last unit.",
        );
        setLoading(false);
        return;
      }

      const reservation = await res.json();
      router.push(`/checkout/${reservation.id}`);
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8 font-mono text-sm">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Available Inventory
        </h1>

        {error && (
          <div className="border border-red-900 bg-red-950/30 text-red-400 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-[#30363d] bg-[#161b22] p-5 rounded-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-base font-medium text-white">
                  {product.name}
                </h2>
                <p className="text-[#8b949e] mt-1">{product.description}</p>

                {product.stocks.map((stock: any) => {
                  const available = stock.totalUnits - stock.reservedUnits;
                  return (
                    <div
                      key={stock.id}
                      className="mt-3 flex items-center space-x-4 text-xs"
                    >
                      <span className="bg-[#21262d] px-2 py-1 rounded text-[#8b949e]">
                        {stock.warehouse.name}
                      </span>
                      <span
                        className={
                          available > 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {available} units available
                      </span>
                      <button
                        onClick={() => handleReserve(stock.id)}
                        disabled={available === 0 || loading}
                        className="bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#238636]/50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-md transition-colors font-medium"
                      >
                        Reserve
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
