"use client";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export default function IndustryPage() {
  const [industry, setIndustry] = useState("");
  const [industries, setIndustries] = useState<string[]>([]); // to store list of industries

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting industry:", industry);
      const response = await axios.post("/api/industry", { name: industry });
      console.log("Industry submitted:", response.data);
      setIndustry("");
      fetchIndustries(); // Clear the input field after submission
    } catch (error) {
      console.error("Error submitting industry:", error);
    }
  };
  const fetchIndustries = async () => {
    try {
      const response = await axios.get("/api/industry");
      setIndustries(response.data); // assumes backend returns array of strings or objects
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };
  useEffect(() => {
    fetchIndustries(); // fetch when page loads
  }, []);
  useEffect;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Industry Page</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Industry Name:
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter industry name"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Industry
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Industry List</h2>
        <ul className="list-disc pl-6">
          {industries.map((ind, index) => (
            <li key={index}>{typeof ind === "string" ? ind : ind.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
