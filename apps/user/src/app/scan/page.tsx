"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUser(data.user);
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
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary-600">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  // Create QR code data
  const qrData = user
    ? JSON.stringify({
        userId: user.id,
        name: user.name,
        timestamp: new Date().toISOString(),
      })
    : "";

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Scan Your Code</h1>
          <p className="text-gray-700 mt-1">
            Show this code to the recycling machine to start scanning items
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Your Recycling ID
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome, {user?.name}! Present this code to the recycling
                machine.
              </p>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <QRCodeSVG
                    value={qrData}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500">User ID: {user?.id}</div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-gray-700">Instructions:</p>
              <ol className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                <li>1. Approach the recycling machine</li>
                <li>2. Press "Start Scanning" on the machine</li>
                <li>3. Show this QR code to the machine's scanner</li>
                <li>4. Once verified, begin placing your recyclable items</li>
                <li>5. Points will be automatically added to your account</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
