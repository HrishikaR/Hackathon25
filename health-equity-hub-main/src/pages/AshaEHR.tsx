import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Users, Activity, TrendingUp, Construction } from "lucide-react";

const AshaEHR = () => {
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

  const features = [
    {
      icon: FileText,
      title: "Patient Records",
      description: "Digital health records management",
      status: "Coming Soon",
    },
    {
      icon: Users,
      title: "Family Tracking",
      description: "Track entire family health history",
      status: "Coming Soon",
    },
    {
      icon: Activity,
      title: "Vital Signs",
      description: "Record and monitor vital statistics",
      status: "Coming Soon",
    },
    {
      icon: TrendingUp,
      title: "Health Analytics",
      description: "AI-powered health insights",
      status: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical/5 to-primary/10">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-medical">ASHA EHR Companion</h1>
            <p className="text-sm text-muted-foreground">Community health worker tools</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Card className="shadow-[var(--shadow-strong)] mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-medical to-primary flex items-center justify-center">
                <Construction className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Module Under Development</CardTitle>
            <CardDescription className="text-base mt-2">
              The ASHA EHR Companion is being designed for community health workers to manage patient records efficiently, even in low-connectivity areas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-6 border">
              <h3 className="font-semibold text-lg mb-3">Planned Features:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-medical" />
                  Offline-first architecture for rural connectivity
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Voice-to-text data entry in local languages
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-wellness" />
                  AI-assisted preliminary diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Secure patient data encryption
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Multi-device synchronization
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="shadow-[var(--shadow-soft)]">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-medical to-primary flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    {feature.status}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AshaEHR;