import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, PlusCircle, Bell } from "lucide-react";

export default function HostelMealBookingApp() {
  const [name, setName] = useState("");
  const [meals, setMeals] = useState("");
  const [mealType, setMealType] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isBookingOpen = () => {
    const now = new Date();
    if (mealType === "breakfast") return now.getHours() < 8;
    if (mealType === "lunch") return now.getHours() >= 8 && now.getHours() < 12;
    if (mealType === "dinner") return now.getHours() >= 12 && now.getHours() < 19;
    return false;
  };

  const hasSubmittedPreviousMeal = () => {
    const previousMeal = mealType === "lunch" ? "breakfast" : mealType === "dinner" ? "lunch" : null;
    if (!previousMeal) return true;

    const requests = JSON.parse(localStorage.getItem("mealRequests") || "[]");
    return requests.some(req => req.name === name && req.mealType === previousMeal);
  };

  const handleSubmit = () => {
    if (name && meals && mealType && isBookingOpen() && hasSubmittedPreviousMeal()) {
      const requests = JSON.parse(localStorage.getItem("mealRequests") || "[]");
      requests.push({ name, meals, mealType, time: new Date().toISOString() });
      localStorage.setItem("mealRequests", JSON.stringify(requests));
      setSubmitted(true);
    } else if (!hasSubmittedPreviousMeal()) {
      alert(`You must submit your ${mealType === "lunch" ? "breakfast" : "lunch"} request first.`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Hostel Meal Booking</h1>

      {/* Student Meal Entry */}
      <Card className="shadow-md">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Book Your Meal</h2>

          <Input
            placeholder="Your Name or Roll Number"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Number of Meals Needed (e.g., 1)"
            type="number"
            value={meals}
            onChange={(e) => setMeals(e.target.value)}
          />

          <select
            className="w-full border rounded-md p-2 text-sm"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="">Select Meal</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>

          <div className="text-sm text-muted-foreground">
            🕒 Submit before 8:00 AM for breakfast, 12:00 PM for lunch, 7:00 PM for dinner
          </div>

          <Button
            className="w-full flex items-center gap-2"
            onClick={handleSubmit}
            disabled={!isBookingOpen()}
          >
            <PlusCircle size={18} /> Submit Meal Request
          </Button>

          {submitted && (
            <div className="text-green-600 text-sm">✅ Meal request submitted successfully!</div>
          )}
        </CardContent>
      </Card>

      {/* Notification Reminder */}
      <Card className="shadow-md">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Reminders</h2>

          <div className="p-4 rounded-xl bg-yellow-100">
            <p className="text-sm">⏰ Reminder will be sent 30 minutes before each cutoff time.</p>
            <Button variant="outline" className="mt-2 w-full flex items-center gap-2">
              <Bell size={18} /> Enable Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kitchen Staff Dashboard Preview */}
      <Card className="shadow-md">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Today's Meal Count</h2>

          <div className="p-4 rounded-xl bg-blue-100">
            <p className="font-medium">🍽️ Meals booked: {JSON.parse(localStorage.getItem("mealRequests") || "[]").length}</p>
            <p className="text-sm text-muted-foreground">Auto-updated every time someone books</p>
            <Button variant="outline" className="mt-2 w-full flex items-center gap-2">
              <Clock size={18} /> View Full List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
