"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import QR Reader with no SSR
const QrReader = dynamic(
  () => import("react-qr-reader").then((mod) => mod.QrReader),
  {
    ssr: false,
  }
);

interface User {
  id: string;
  name: string;
  timestamp: string;
}

interface WasteItem {
  name: string;
  points: number;
}

const WASTE_ITEMS: WasteItem[] = [
  { name: "Plastic Bottle", points: 50 },
  { name: "Glass Container", points: 75 },
  { name: "Aluminum Can", points: 60 },
  { name: "Paper Box", points: 40 },
  { name: "Cardboard", points: 45 },
  { name: "Metal Scrap", points: 80 },
];

export default function MachineDashboard() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  }>({ text: "", type: "info" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScan = (data: string | null) => {
    if (data) {
      try {
        const userData = JSON.parse(data);
        if (userData.id && userData.name) {
          setUser(userData);
          setScanning(false);
          setMessage({
            text: `Welcome ${userData.name}! Please select a waste item to recycle.`,
            type: "success",
          });
        }
      } catch (error) {
        setMessage({ text: "Invalid QR code", type: "error" });
      }
    }
  };

  const handleError = (err: any) => {
    setMessage({
      text: "Error accessing camera: " + err.message,
      type: "error",
    });
  };

  const processWaste = async () => {
    if (!selectedItem || !user) return;

    setProcessing(true);
    setMessage({ text: "Processing waste item...", type: "info" });

    try {
      const response = await fetch("/api/points/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          points: selectedItem.points,
        }),
      });

      if (response.ok) {
        setMessage({
          text: `Successfully processed ${selectedItem.name}! ${selectedItem.points} points awarded.`,
          type: "success",
        });
      } else {
        throw new Error("Failed to process waste");
      }
    } catch (error) {
      setMessage({ text: "Failed to process waste item", type: "error" });
    } finally {
      setProcessing(false);
      setSelectedItem(null);
    }
  };

  const resetMachine = () => {
    setUser(null);
    setSelectedItem(null);
    setScanning(false);
    setMessage({ text: "", type: "info" });
  };

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary-600">
            Loading Machine Dashboard...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Recycling Machine Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Scan user QR code to begin recycling
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {!user && !scanning && (
            <div className="text-center">
              <button
                onClick={() => setScanning(true)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Scanning QR Code
              </button>
            </div>
          )}

          {scanning && mounted && (
            <div className="max-w-md mx-auto">
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  if (result) {
                    handleScan(result?.getText());
                  }
                  if (error) {
                    handleError(error);
                  }
                }}
                className="w-full"
              />
              <button
                onClick={() => setScanning(false)}
                className="mt-4 text-gray-600 hover:text-gray-800"
              >
                Cancel Scanning
              </button>
            </div>
          )}

          {user && !scanning && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h2 className="text-lg font-semibold text-green-800">
                  User Authenticated: {user.name}
                </h2>
              </div>

              {!selectedItem && (
                <div className="grid grid-cols-2 gap-4">
                  {WASTE_ITEMS.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setSelectedItem(item)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.points} points
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {selectedItem && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">
                      Selected: {selectedItem.name}
                    </h3>
                    <p className="text-sm text-blue-600">
                      Points: {selectedItem.points}
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={processWaste}
                      disabled={processing}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {processing ? "Processing..." : "Process Item"}
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {message.text && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800"
                      : message.type === "error"
                        ? "bg-red-50 text-red-800"
                        : "bg-blue-50 text-blue-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="mt-8 border-t pt-6">
                <button
                  onClick={resetMachine}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Reset Machine
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
