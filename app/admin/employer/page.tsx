"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function EmployerPage() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/employer");
      setEmployers(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error("Error fetching employers:", error);
      setError("Failed to fetch employer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lower = search.toLowerCase();
    const result = employers.filter(
      (emp) =>
        emp.user.name.toLowerCase().includes(lower) ||
        emp.companyName.toLowerCase().includes(lower)
    );
    setFiltered(result);
  }, [search, employers]);

  const deleteEmployer = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employer?"
    );
    if (!confirmed) return;

    try {
      await axios.delete("/api/employer", { data: { id } });
      const updated = employers.filter((emp) => emp.id !== id);
      setEmployers(updated);
      setFiltered(updated);
    } catch (error) {
      console.error("Error deleting employer:", error);
      alert("Failed to delete employer.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employer Page</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or company..."
        className="mb-4 p-2 border rounded w-full"
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No employers found.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((emp) => (
            <Link href={`/admin/employer/${emp.id}`}>
              <li key={emp.id} className="border p-4 rounded relative">
                <h2 className="text-xl font-semibold">{emp.user.name}</h2>
                <p className="text-gray-600">{emp.companyName}</p>
                <p>{emp.companyWebsite}</p>
                <p>{emp.companyAddress}</p>

                <button
                  onClick={() => deleteEmployer(emp.id)}
                  className="absolute top-4 right-4 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
                >
                  Delete
                </button>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
