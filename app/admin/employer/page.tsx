"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EmployerRow = {
  id: string;
  companyName: string | null;
  companyWebsite: string | null;
  companyAddress: string | null;
  verifiedStatus?: boolean | null;
  user: { name: string };
};

const PAGE_SIZE = 10;

export default function EmployerPage() {
  const [employers, setEmployers] = useState<EmployerRow[]>([]);
  const [search, setSearch] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "company">("name");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/employer");
        setEmployers(response.data);
      } catch (err) {
        console.error("Error fetching employers:", err);
        setError("Failed to fetch employer data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSorted = useMemo(() => {
    const lower = search.toLowerCase();
    let result = employers.filter((emp) => {
      const matches =
        emp.user?.name?.toLowerCase?.().includes(lower) ||
        emp.companyName?.toLowerCase?.().includes(lower);
      const verifiedOk = !onlyVerified || !!emp.verifiedStatus;
      return matches && verifiedOk;
    });
    result.sort((a, b) => {
      const aKey = (sortBy === "name" ? a.user?.name : a.companyName) || "";
      const bKey = (sortBy === "name" ? b.user?.name : b.companyName) || "";
      return aKey.localeCompare(bKey);
    });
    return result;
  }, [employers, search, onlyVerified, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, currentPage]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this employer?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await axios.delete("/api/employer", { data: { id } });
      setEmployers((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting employer:", err);
      alert("Failed to delete employer.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Employers</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by user or company"
          />
          <Button
            variant={onlyVerified ? "default" : "outline"}
            onClick={() => {
              setOnlyVerified((v) => !v);
              setPage(1);
            }}
            aria-pressed={onlyVerified}
          >
            {onlyVerified ? "Verified" : "All"}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setSortBy((s) => (s === "name" ? "company" : "name"))
            }
            title={`Sort by ${sortBy === "name" ? "company" : "name"}`}
          >
            Sort: {sortBy === "name" ? "Name" : "Company"}
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredSorted.length === 0 ? (
        <p>No employers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pageItems.map((emp) => (
            <Card key={emp.id} className="relative">
              <CardHeader>
                <CardTitle>{emp.user?.name ?? "Unnamed"}</CardTitle>
                <CardDescription>
                  {emp.companyName ?? "No company name"}
                </CardDescription>
                <CardAction>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/employer/${emp.id}`}>
                      <Button size="sm" variant="outline">
                        Open
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(emp.id)}
                      disabled={deletingId === emp.id}
                    >
                      {deletingId === emp.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-1">
                {emp.companyWebsite && (
                  <p className="text-sm truncate">{emp.companyWebsite}</p>
                )}
                {emp.companyAddress && (
                  <p className="text-sm text-muted-foreground truncate">
                    {emp.companyAddress}
                  </p>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <span
                  className={
                    emp.verifiedStatus
                      ? "text-green-600 text-sm"
                      : "text-amber-600 text-sm"
                  }
                >
                  {emp.verifiedStatus ? "Verified" : "Unverified"}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredSorted.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
