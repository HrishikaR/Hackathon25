import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "@/components/ModuleCard";
import { Brain, MessageSquare, FileText, LogOut, User } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name || "User");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-wellness/5">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">HealthSync AI</h1>
            <p className="text-sm text-muted-foreground">Digital Health Ecosystem</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-wellness to-secondary bg-clip-text text-transparent">
            Welcome to Your Health Hub
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access AI-powered mental health support, disease awareness education, and mobile health records management - all in one place.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <ModuleCard
            title="Mental Health Hub"
            description="Track your mood, access meditation tools, and get personalized support"
            icon={Brain}
            gradient="from-secondary to-secondary/70"
            path="/mental-health"
          />
          <ModuleCard
            title="Disease Awareness"
            description="AI-powered chatbot for health education and disease information"
            icon={MessageSquare}
            gradient="from-primary to-wellness"
            path="/disease-awareness"
          />
          <ModuleCard
            title="ASHA EHR Companion"
            description="Mobile health records management for community health workers"
            icon={FileText}
            gradient="from-medical to-primary"
            path="/asha-ehr"
          />
        </section>

        <section className="mt-12 max-w-3xl mx-auto bg-card/50 backdrop-blur-sm rounded-xl p-6 border">
          <h3 className="text-xl font-semibold mb-3">Platform Features</h3>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Offline-capable functionality
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-wellness" />
              Privacy-first data handling
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Multilingual support
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-medical" />
              AI-driven insights
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;