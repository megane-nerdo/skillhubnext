"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          We encountered an unexpected error. Don't worry, our team has been
          notified and is working to fix it.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              Error Details:
            </h3>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button onClick={reset} className="flex items-center gap-2 px-6 py-3">
            <RefreshCw size={20} />
            Try Again
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-3"
            >
              <Home size={20} />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Helpful Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What you can do:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li>• Try refreshing the page</li>
            <li>• Check your internet connection</li>
            <li>• Go back to the homepage</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">
            If this error continues, please contact our support team.
          </p>
          <Link
            href="mailto:support@skillhub.com"
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
