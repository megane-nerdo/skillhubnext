"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogOut } from "lucide-react";
export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="p-4 shadow-sm flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Skillhub
      </Link>

      <button
        className="md:hidden"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className="hidden md:flex gap-4 items-center">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/jobs">Jobs</Link>
        </li>
        {session?.user?.role === "EMPLOYER" && (
          <>
            <li>
              <Link href="/post-job">Post Job</Link>
            </li>
            <li>
              <Link href="/employer-dashboard">Dashboard</Link>
            </li>
          </>
        )}
        {session?.user?.role === "JOBSEEKER" && (
          <li>
            <Link href="/dashboard">My Applications</Link>
          </li>
        )}
        {session ? (
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded transition"
            >
              <LogOut size={16} />
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>

      {isOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col gap-4 px-6 py-4 md:hidden z-50">
          <li>
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/jobs" onClick={closeMenu}>
              Jobs
            </Link>
          </li>
          {session?.user?.role === "EMPLOYER" && (
            <>
              <li>
                <Link href="/post-job" onClick={closeMenu}>
                  Post Job
                </Link>
              </li>
              <li>
                <Link href="/employer-dashboard" onClick={closeMenu}>
                  Dashboard
                </Link>
              </li>
            </>
          )}
          {session?.user?.role === "JOBSEEKER" && (
            <li>
              <Link href="/dashboard" onClick={closeMenu}>
                My Applications
              </Link>
            </li>
          )}
          {session ? (
            <li>
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: "/" });
                }}
                className="text-sm underline"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}
