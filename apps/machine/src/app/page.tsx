import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">
          WasteWise Machine Interface
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          Welcome to the machine interface of WasteWise. This interface allows
          you to scan user QR codes and process recycling items efficiently.
        </p>

        <div className="grid gap-4 mt-8">
          <Link href="/machine/scan" className="inline-block">
            <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white">
              Get Started with Scanning
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                Quick Guide
              </h3>
              <ul className="text-left text-sm space-y-2 text-gray-700">
                <li>1. Click "Get Started" to begin</li>
                <li>2. Scan user's QR code</li>
                <li>3. Process recycling items</li>
                <li>4. Confirm points allocation</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                Machine Status
              </h3>
              <div className="text-left text-sm space-y-2">
                <p className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  System Online
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Scanner Ready
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Database Connected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
