"use client";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export default function CategoryPage() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]); // to store list of industries

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting category:", category);
      const response = await axios.post("/api/category", { name: category });
      console.log("Industry submitted:", response.data);
      setCategory("");
      fetchCategories(); // Clear the input field after submission
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data); // assumes backend returns array of strings or objects
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories(); // fetch when page loads
  }, []);
  useEffect;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Page</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Category Name:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter category name"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Category List</h2>
        <ul className="list-disc pl-6">
          {categories.map((ind, index) => (
            <li key={index}>{ind.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
