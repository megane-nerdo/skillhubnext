'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'
import { Router } from 'next/router'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="p-4 shadow flex justify-between items-center">
      <ul className="flex gap-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/jobs">Jobs</Link></li>
        {session?.user?.role === 'EMPLOYER' && (
          <>
            <li><Link href="/post-job">Post Job</Link></li>
            <li><Link href="/employer-dashboard">Dashboard</Link></li>
          </>
        )}
        {session?.user?.role === 'JOBSEEKER' && (
          <li><Link href="/dashboard">My Applications</Link></li>
        )}
      </ul>
      {session ? (
        <div className="flex items-center gap-2">
          <span>{session.user.email} ({session.user.role})</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm underline">Logout</button>
        </div>
      ) : (
        <div>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register" className="ml-4">Register</Link>
        </div>
      )}
    </nav>
  )
}
