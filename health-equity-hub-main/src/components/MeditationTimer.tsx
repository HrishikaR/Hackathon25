import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";

interface MeditationTimerProps {
  userId: string;
}

const MeditationTimer = ({ userId }: MeditationTimerProps) => {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchSessionCount();
  }, [userId]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const fetchSessionCount = async () => {
    const { count } = await supabase
      .from("meditation_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (count !== null) {
      setTotalSessions(count);
    }
  };

  const handleComplete = async () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const { error } = await supabase
      .from("meditation_sessions")
      .insert({
        user_id: userId,
        duration_seconds: duration * 60,
        completed: true,
      });

    if (!error) {
      toast.success("Meditation session completed! 🧘");
      fetchSessionCount();
    }
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (newDuration: number) => {
    if (!isRunning) {
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-secondary" />
            Guided Meditation Timer
          </CardTitle>
          <CardDescription>
            Take a moment to breathe and center yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className="text-secondary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-secondary">{formatTime(timeLeft)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isRunning ? "Meditating..." : "Ready to start"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg" className="px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={handlePause} size="lg" variant="secondary" className="px-8">
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} size="lg" variant="outline">
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="60"
                value={duration}
                onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1)}
                disabled={isRunning}
                className="w-24"
              />
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((mins) => (
                  <Button
                    key={mins}
                    size="sm"
                    variant={duration === mins ? "default" : "outline"}
                    onClick={() => handleDurationChange(mins)}
                    disabled={isRunning}
                  >
                    {mins}m
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground">
              Total sessions completed: <span className="font-semibold text-foreground">{totalSessions}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationTimer;