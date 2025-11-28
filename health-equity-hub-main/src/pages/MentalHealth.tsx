import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Smile, Frown, Meh, TrendingUp, Timer, BookOpen } from "lucide-react";
import { toast } from "sonner";
import MoodTracker from "@/components/MoodTracker";
import MeditationTimer from "@/components/MeditationTimer";
import SelfHelpLibrary from "@/components/SelfHelpLibrary";

const MentalHealth = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setSession(session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-mental-health/10">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary">Mental Health Hub</h1>
            <p className="text-sm text-muted-foreground">Your wellness companion</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="mood" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Smile className="w-4 h-4" />
              <span className="hidden sm:inline">Mood Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="meditation" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="hidden sm:inline">Meditation</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Self-Help</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-6">
            <MoodTracker userId={session.user.id} />
          </TabsContent>

          <TabsContent value="meditation" className="space-y-6">
            <MeditationTimer userId={session.user.id} />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <SelfHelpLibrary />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MentalHealth;