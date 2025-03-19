"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  points?: number;
}

interface VoucherOption {
  id: string;
  name: string;
  provider: "Amazon" | "Zomato" | "Swiggy" | "Flipkart";
  pointsCost: number;
  value: number;
  image: string;
}

const voucherOptions: VoucherOption[] = [
  {
    id: "amazon-100",
    name: "₹100 Amazon Voucher",
    provider: "Amazon",
    pointsCost: 10000,
    value: 100,
    image: "/amazon-logo.png",
  },
  {
    id: "zomato-100",
    name: "₹100 Zomato Voucher",
    provider: "Zomato",
    pointsCost: 10000,
    value: 100,
    image: "/zomato-logo.png",
  },
  {
    id: "swiggy-10",
    name: "₹10 Swiggy Voucher",
    provider: "Swiggy",
    pointsCost: 100,
    value: 10,
    image: "/swiggy-logo.png",
  },
  {
    id: "flipkart-10",
    name: "₹10 Flipkart Voucher",
    provider: "Flipkart",
    pointsCost: 100,
    value: 10,
    image: "/flipkart-logo.png",
  },
];

export default function RedeemPoints() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [redeemStatus, setRedeemStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: string;
  }>({ loading: false });

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

  const handleRedeem = async (voucher: VoucherOption) => {
    if (!user || (user.points || 0) < voucher.pointsCost) {
      setRedeemStatus({
        loading: false,
        error: "Insufficient points for redemption",
      });
      return;
    }

    setRedeemStatus({ loading: true });
    setSelectedVoucher(voucher.id);

    try {
      const response = await fetch("/api/points/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voucherId: voucher.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to redeem voucher");
      }

      setUser(data.user);
      setRedeemStatus({
        loading: false,
        success: `Successfully redeemed ${voucher.name}! Your voucher code is: ${data.voucherCode}`,
      });
    } catch (error: any) {
      setRedeemStatus({
        loading: false,
        error: error.message || "Failed to redeem voucher. Please try again.",
      });
    }
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
            Redeem Your Points
          </h1>
          <p className="text-gray-700 dark:text-dark-text-muted mt-1">
            Current Balance: {user?.points || 0} points
          </p>
        </header>

        {redeemStatus.error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
            {redeemStatus.error}
          </div>
        )}

        {redeemStatus.success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
            {redeemStatus.success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {voucherOptions.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 border border-gray-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
                  {voucher.name}
                </h2>
                <div className="text-sm font-medium text-gray-600 dark:text-dark-text-muted">
                  {voucher.pointsCost} points
                </div>
              </div>
              <div className="mb-6 h-32 relative bg-gray-50 dark:bg-dark-card/50 rounded-lg">
                {/* Placeholder for voucher image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">
                    {(() => {
                      switch (voucher.provider) {
                        case "Amazon":
                          return "🛍️";
                        case "Zomato":
                          return "🍽️";
                        case "Swiggy":
                          return "🍴";
                        case "Flipkart":
                          return "🛒";
                        default:
                          return "🎁";
                      }
                    })()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(voucher)}
                disabled={
                  redeemStatus.loading ||
                  selectedVoucher === voucher.id ||
                  (user?.points || 0) < voucher.pointsCost
                }
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  (user?.points || 0) < voucher.pointsCost
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                } ${
                  redeemStatus.loading && selectedVoucher === voucher.id
                    ? "opacity-75 cursor-wait"
                    : ""
                }`}
              >
                {redeemStatus.loading && selectedVoucher === voucher.id
                  ? "Redeeming..."
                  : (user?.points || 0) < voucher.pointsCost
                    ? "Insufficient Points"
                    : "Redeem Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
