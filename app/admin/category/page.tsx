"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";

type Category = { id: string; name: string };

export default function CategoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(lower));
  }, [categories, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) return;
    try {
      setSaving(true);
      const response = await axios.post("/api/category", {
        name: category.trim(),
      });
      setCategories((prev) => [response.data, ...prev]);
      setCategory("");
    } catch (err) {
      console.error("Error submitting category:", err);
      alert("Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;
    try {
      setDeletingId(id);
      await axios.delete("/api/category", { data: { id } });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      setUpdatingId(id);
      const response = await axios.put(`/api/category/${id}`, {
        name: editName.trim(),
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? response.data : c))
      );
      setEditingId(null);
      setEditName("");
    } catch (err: any) {
      console.error("Error updating category:", err);
      alert(err.response?.data?.error || "Failed to update category");
    } finally {
      setUpdatingId(null);
    }
  };

  if (status === "loading") {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="w-full sm:w-64">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
          <CardDescription>Create a new category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name"
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="divide-y rounded-xl border">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4">
              {editingId === c.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(c.id)}
                    disabled={updatingId === c.id || !editName.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {updatingId === c.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={updatingId === c.id}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(c)}
                      disabled={editingId !== null}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id || editingId !== null}
                    >
                      {deletingId === c.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
