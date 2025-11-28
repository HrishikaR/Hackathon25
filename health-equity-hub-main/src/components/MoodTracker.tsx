import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Smile, Meh, Frown, ThumbsUp, AlertCircle, TrendingUp } from "lucide-react";

interface MoodTrackerProps {
  userId: string;
}

const moodOptions = [
  { value: "excellent", label: "Excellent", icon: ThumbsUp, color: "from-wellness to-wellness/70" },
  { value: "good", label: "Good", icon: Smile, color: "from-primary to-primary/70" },
  { value: "okay", label: "Okay", icon: Meh, color: "from-accent to-accent/70" },
  { value: "low", label: "Low", icon: Frown, color: "from-secondary to-secondary/70" },
  { value: "struggling", label: "Struggling", icon: AlertCircle, color: "from-destructive to-destructive/70" },
];

const MoodTracker = ({ userId }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWeeklyData();
  }, [userId]);

  const fetchWeeklyData = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (!error && data) {
      setWeeklyData(data);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: userId,
        mood: selectedMood,
        notes: notes.trim() || null,
      });

    if (error) {
      toast.error("Failed to save mood entry");
    } else {
      toast.success("Mood recorded successfully!");
      setSelectedMood("");
      setNotes("");
      fetchWeeklyData();
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-secondary" />
            How are you feeling today?
          </CardTitle>
          <CardDescription>Track your daily mood to understand patterns over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMood === mood.value
                      ? "border-secondary shadow-[var(--shadow-medium)] scale-105"
                      : "border-border hover:border-secondary/50 hover:scale-102"
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${mood.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-center">{mood.label}</p>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              placeholder="What's on your mind today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleMoodSubmit}
            disabled={isLoading || !selectedMood}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Record Mood"}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Weekly Mood Trend
          </CardTitle>
          <CardDescription>Last 7 days of mood entries</CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No mood entries yet. Start tracking today!
            </p>
          ) : (
            <div className="space-y-3">
              {weeklyData.map((entry) => {
                const mood = moodOptions.find((m) => m.value === entry.mood);
                if (!mood) return null;
                const Icon = mood.icon;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${mood.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{mood.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString()} at{" "}
                        {new Date(entry.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;