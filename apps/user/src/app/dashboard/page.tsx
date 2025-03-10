"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WasteHistory {
  id: string;
  type: string;
  points: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  points?: number;
  wasteHistory?: WasteHistory[];
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wasteHistory, setWasteHistory] = useState<WasteHistory[]>([]);

  useEffect(() => {
    // Check if user is logged in and fetch history
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUser(data.user);

        // Fetch waste history
        const historyResponse = await fetch("/api/history");
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setWasteHistory(historyData.history);
        }
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary-600">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-700 mt-1">
            Manage your waste disposal activities here.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/scan")}
                className="w-full py-2 px-4 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                Scan New Item
              </button>
              <button
                onClick={() => router.push("/history")}
                className="w-full py-2 px-4 border border-primary-600 text-primary-600 rounded hover:bg-primary-50 transition-colors"
              >
                View History
              </button>
              <button
                onClick={() => router.push("/points/redeem")}
                className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Redeem Points
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Your Impact
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-700">Items Recycled</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {wasteHistory.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-700">Points Earned</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {user?.points || 0}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {user?.points && user.points >= 10000 ? (
                    <span className="text-green-600">
                      You have enough points to redeem a voucher!
                    </span>
                  ) : (
                    `${10000 - (user?.points || 0)} points needed for your next voucher`
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>
            {wasteHistory.length > 0 ? (
              <div className="space-y-4">
                {wasteHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {item.type} Recycled
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{item.points} pts
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => router.push("/history")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All Activity →
                </button>
              </div>
            ) : (
              <div className="text-gray-700 text-center py-8">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
