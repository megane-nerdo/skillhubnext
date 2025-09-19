"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Employer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
export default function EmployerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employer, setEmployer] = useState<Employer>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Employer>>({});
  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const res = await axios.get(`/api/employer/${id}`);
        setEmployer(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error("Failed to fetch employer:", error);
      }
    };
    if (id) {
      fetchEmployer();
    }
  }, [id]);
  console.log(employer);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSave = async () => {
    try {
      await axios.put(`/api/employer/${id}`, formData);
      setEmployer((prev) => ({ ...prev, ...formData } as Employer));
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update employer:", error);
    }
  };
  return (
    <div className="max-w-md mx-auto space-y-4">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            name="name"
            value={formData.user?.name || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                user: { ...prev.user, name: e.target.value },
              }));
            }}
            placeholder="Username"
          />
          <Input
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            placeholder="Company Name"
          />
          <Input
            name="companyWebsite"
            value={formData.companyWebsite || ""}
            onChange={handleChange}
            placeholder="Company Website"
          />
          <Input
            name="companyAddress"
            value={formData.companyAddress || ""}
            onChange={handleChange}
            placeholder="Company Address"
          />
          <div>
            <Input
              type="checkbox"
              name="verifiedStatus"
              checked={formData.verifiedStatus || false}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  verifiedStatus: e.target.checked,
                }));
                console.log(e.target.checked);
              }}
            />
            <label>Verified</label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>{employer?.user.name}</p>
          <p>{employer?.subscriptions?.[0].plan?.name ?? "No active plan"}</p>
          <p>
            <strong>Name:</strong> {employer?.companyName}
          </p>
          <p>
            <strong>Address:</strong> {employer?.companyAddress}
          </p>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </div>
      )}
    </div>
  );
}
