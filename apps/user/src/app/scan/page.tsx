"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  points?: number;
}

export default function ScanPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUser(data.user);
        setQrData(JSON.stringify({ id: data.user.id, name: data.user.name }));
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Scan Your Code</h1>
          <p className="text-gray-700 dark:text-dark-text-muted mt-1">
            Show this code to the recycling machine to start scanning items
          </p>
        </header>

        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
                Your Recycling ID
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted mb-6">
                Welcome, {user?.name}! Present this code to the recycling
                machine.
              </p>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <QRCodeSVG
                    value={qrData}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-dark-text-muted">User ID: {user?.id}</div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-gray-700 dark:text-dark-text">Instructions:</p>
              <ol className="text-left text-gray-600 dark:text-dark-text-muted space-y-2 max-w-md mx-auto">
                <li>1. Approach the recycling machine</li>
                <li>2. Press "Start Scanning" on the machine</li>
                <li>3. Show this QR code to the machine's scanner</li>
                <li>4. Once verified, begin placing your recyclable items</li>
                <li>5. Points will be automatically added to your account</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
