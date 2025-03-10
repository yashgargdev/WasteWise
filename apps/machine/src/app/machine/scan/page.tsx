"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QrScanner from "qr-scanner";

const WASTE_POINTS = {
  plastic: 10,
  paper: 5,
  glass: 15,
  metal: 20,
};

interface UserInfo {
  id: string;
  name: string;
  email: string;
  points: number;
}

export default function ScanPage() {
  const [mounted, setMounted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserInfo = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setUserInfo(data);
    } catch (err) {
      setError("Failed to fetch user information");
      setUserId(null);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      setUserId(result);
      fetchUserInfo(result);
      setScanning(false);
      console.log("Scanned user ID:", result);
    } catch (error) {
      setError("Could not read QR code from image. Please try again.");
      console.error("QR scan error:", error);
    }
  };

  const handleManualInput = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const manualId = formData.get("userId") as string;
    if (manualId) {
      setUserId(manualId);
      fetchUserInfo(manualId);
      setScanning(false);
    }
  };

  const processWaste = async (wasteType: keyof typeof WASTE_POINTS) => {
    if (!userId || !userInfo) return;

    setProcessing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/points/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          points: WASTE_POINTS[wasteType],
          wasteType: wasteType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process waste");
      }

      // Update local user info with new points
      setUserInfo((prev) =>
        prev
          ? {
              ...prev,
              points: prev.points + WASTE_POINTS[wasteType],
            }
          : null
      );

      setSuccessMessage(
        `Successfully processed ${wasteType}! +${WASTE_POINTS[wasteType]} points`
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process waste");
    } finally {
      setProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-700 text-lg">Loading scanner...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-2xl p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Scan User QR Code
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {!userId && (
          <div className="space-y-6">
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 bg-blue-600 hover:bg-blue-700 text-white w-full py-6"
              >
                Upload QR Code Image
              </Button>
              <p className="text-sm text-gray-700 mb-6">
                Upload an image containing a QR code
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manual ID Entry
              </h3>
              <form onSubmit={handleManualInput} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="userId"
                    placeholder="Enter User ID manually"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit ID
                </Button>
              </form>
            </div>
          </div>
        )}

        {userId && userInfo && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">User Identified</h3>
              <div className="space-y-2 mt-2">
                <p className="text-sm text-gray-700">ID: {userId}</p>
                <p className="text-sm text-gray-700">Name: {userInfo.name}</p>
                <p className="text-sm text-gray-700">Email: {userInfo.email}</p>
                <p className="text-sm font-semibold text-green-700">
                  Current Points: {userInfo.points}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Process Items</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => processWaste("plastic")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : `Process Plastic (+${WASTE_POINTS.plastic}pts)`}
                </Button>
                <Button
                  onClick={() => processWaste("paper")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : `Process Paper (+${WASTE_POINTS.paper}pts)`}
                </Button>
                <Button
                  onClick={() => processWaste("glass")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : `Process Glass (+${WASTE_POINTS.glass}pts)`}
                </Button>
                <Button
                  onClick={() => processWaste("metal")}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : `Process Metal (+${WASTE_POINTS.metal}pts)`}
                </Button>
              </div>
            </div>

            <Button
              onClick={() => {
                setUserId(null);
                setUserInfo(null);
                setError(null);
                setSuccessMessage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              variant="outline"
              className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={processing}
            >
              Reset
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
