import Link from "next/link";
import { Home, ArrowLeft, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-indigo-600 mb-4">404</div>
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/">
            <Button className="flex items-center gap-2 px-6 py-3">
              <Home size={20} />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/jobs"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              Browse Jobs
            </Link>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              Register
            </Link>
            <Link
              href="/profile"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Still can't find what you're looking for?</p>
          <Link
            href="mailto:support@skillhub.com"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            <Mail size={16} />
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
