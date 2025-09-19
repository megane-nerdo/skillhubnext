"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Employer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function EmployerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employer, setEmployer] = useState<Employer>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Employer>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const res = await axios.get(`/api/employer/${id}`);
        setEmployer(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error("Failed to fetch employer:", error);
      } finally {
        setLoading(false);
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
      setSaving(true);
      await axios.put(`/api/employer/${id}`, formData);
      setEmployer((prev) => ({ ...prev, ...formData } as Employer));
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update employer:", error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{employer?.user?.name ?? "Employer"}</CardTitle>
          <CardDescription>
            {employer?.companyName ?? "No company name"}
          </CardDescription>
          <CardAction>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // reset form to current employer values
                    if (employer) setFormData(employer);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : isEditing ? (
            <div className="grid gap-3 max-w-xl">
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
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="verifiedStatus"
                  checked={formData.verifiedStatus || false}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      verifiedStatus: e.target.checked,
                    }));
                  }}
                />
                Verified
              </label>
            </div>
          ) : (
            <div className="grid gap-2 text-sm">
              <p className="text-muted-foreground">
                Plan:{" "}
                {employer?.subscriptions?.[0]?.plan?.name ?? "No active plan"}
              </p>
              <p>
                <span className="font-medium">Company:</span>{" "}
                {employer?.companyName}
              </p>
              <p>
                <span className="font-medium">Website:</span>{" "}
                {employer?.companyWebsite}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {employer?.companyAddress}
              </p>
              <p
                className={
                  employer?.verifiedStatus ? "text-green-600" : "text-amber-600"
                }
              >
                {employer?.verifiedStatus ? "Verified" : "Unverified"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
