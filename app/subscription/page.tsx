"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { SubscriptionPlan } from "@prisma/client";
import { Crown, Check, Clock } from "lucide-react";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axios.get("/api/subscription-plan");
        setPlans(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscription();
  }, []);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => a.price - b.price);
  }, [plans]);

  const handleBuy = async (planId: string) => {
    try {
      setPurchasingPlanId(planId);
      setLoading(true);
      const res = await axios.post("/api/subscription", { planId });
      if (res.status === 200) {
        alert("Subscription activated!");
      } else {
        alert("Unable to activate subscription.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while subscribing.");
    } finally {
      setLoading(false);
      setPurchasingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="text-yellow-600" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-600">Unlock more job posts and features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-gray-100 shadow hover:shadow-lg transition-all p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Clock size={14} className="mr-1" /> {plan.duration} days
                    access
                  </p>
                </div>
                <div className="text-3xl font-extrabold text-gray-900">
                  ${plan.price}
                </div>
              </div>

              {Array.isArray((plan as any).features) &&
              (plan as any).features.length > 0 ? (
                <ul className="space-y-2 mb-6">
                  {(plan as any).features.map((feat: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <Check size={16} className="text-emerald-600 mt-1" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-gray-700">
                    <Check size={16} className="text-emerald-600 mt-1" />
                    <span>Up to {plan.limitPerMonth} posts/month</span>
                  </li>
                </ul>
              )}

              <button
                onClick={() => handleBuy(plan.id)}
                disabled={loading && purchasingPlanId === plan.id}
                className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading && purchasingPlanId === plan.id
                  ? "Processing..."
                  : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
