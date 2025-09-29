"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Clock,
  Users,
  Check,
  AlertCircle,
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  limitPerMonth: number;
  features: string[];
}

export default function AdminSubscriptionPlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    limitPerMonth: "",
    features: "",
  });

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

    fetchPlans();
  }, [session, status, router]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("/api/subscription-plan");
      setPlans(res.data);
    } catch (err) {
      setError("Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingPlan(null);
    setFormData({
      name: "",
      price: "",
      duration: "",
      limitPerMonth: "",
      features: "",
    });
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsCreating(false);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      limitPerMonth: plan.limitPerMonth.toString(),
      features: plan.features.join("\n"),
    });
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setIsCreating(false);
    setFormData({
      name: "",
      price: "",
      duration: "",
      limitPerMonth: "",
      features: "",
    });
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      const planData = {
        name: formData.name,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        limitPerMonth: parseInt(formData.limitPerMonth),
        features: formData.features.split("\n").filter((f) => f.trim() !== ""),
      };

      if (isCreating) {
        await axios.post("/api/subscription-plan", planData);
        setSuccess("Subscription plan created successfully!");
      } else if (editingPlan) {
        await axios.put(`/api/subscription-plan/${editingPlan.id}`, planData);
        setSuccess("Subscription plan updated successfully!");
      }

      await fetchPlans();
      handleCancel();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save subscription plan");
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this subscription plan?")) {
      return;
    }

    try {
      await axios.delete(`/api/subscription-plan/${planId}`);
      setSuccess("Subscription plan deleted successfully!");
      await fetchPlans();
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to delete subscription plan"
      );
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Subscription Plans Management
        </h1>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Create New Plan
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle size={20} />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <Check size={20} />
            <span className="font-medium">Success</span>
          </div>
          <p className="text-green-700 mt-1">{success}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingPlan) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {isCreating
                ? "Create New Subscription Plan"
                : "Edit Subscription Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Basic Plan"
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="limitPerMonth">Job Posts Limit per Month</Label>
                <Input
                  id="limitPerMonth"
                  type="number"
                  value={formData.limitPerMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, limitPerMonth: e.target.value })
                  }
                  placeholder="10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save size={16} className="mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      {plans.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                No subscription plans found
              </h3>
              <p className="mb-4">
                Create your first subscription plan to get started.
              </p>
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={20} className="mr-2" />
                Create First Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="divide-y rounded-xl border">
          {plans.map((plan) => (
            <div key={plan.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                      <DollarSign size={24} />
                      {plan.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{plan.duration} days duration</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{plan.limitPerMonth} job posts per month</span>
                    </div>
                  </div>

                  {plan.features && plan.features.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Features:
                      </h4>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <Check
                              size={14}
                              className="text-green-600 mt-0.5 flex-shrink-0"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(plan)}
                    className="flex items-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(plan.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
