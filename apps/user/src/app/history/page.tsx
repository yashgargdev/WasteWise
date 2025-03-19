"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
}

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<WasteHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/auth/me");
        if (!userResponse.ok) {
          throw new Error("Not authenticated");
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch history data
        const historyResponse = await fetch("/api/history");
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData.history);
        }
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <header className="bg-white dark:bg-dark-card shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
            Recycling History
          </h1>
          <p className="text-gray-700 dark:text-dark-text-muted mt-1">
            View your recycling activity and earned points
          </p>
          <div className="mt-4 text-sm text-gray-600 dark:text-dark-text-muted">
            Total Items: {history.length} | Total Points:{" "}
            {history.reduce((sum, item) => sum + item.points, 0)}
          </div>
        </header>

        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm">
          {history.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-dark-border">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-card/80"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text">
                      {record.type}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-dark-text-muted">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      +{record.points} points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600 dark:text-dark-text-muted">
              <p className="mb-4">
                No recycling history yet. Start recycling items to earn points!
              </p>
              <button
                onClick={() => router.push("/scan")}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Start Recycling
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
