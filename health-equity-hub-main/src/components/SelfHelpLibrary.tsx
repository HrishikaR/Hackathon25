import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Heart, Brain, Sparkles, Wind, Moon } from "lucide-react";

const articles = [
  {
    title: "5-Minute Breathing Exercise",
    description: "Quick breathing technique to reduce stress and anxiety instantly",
    icon: Wind,
    color: "from-primary to-wellness",
    content: "Practice box breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5 times.",
  },
  {
    title: "Mindful Walking",
    description: "Turn a simple walk into a powerful meditation practice",
    icon: Sparkles,
    color: "from-wellness to-accent",
    content: "Focus on each step, feel your feet touching the ground, notice your surroundings without judgment.",
  },
  {
    title: "Sleep Hygiene Tips",
    description: "Improve your sleep quality with these evidence-based practices",
    icon: Moon,
    color: "from-secondary to-mental-health",
    content: "Keep consistent sleep schedule, avoid screens 1hr before bed, keep room cool and dark.",
  },
  {
    title: "Gratitude Journaling",
    description: "Boost your mood by focusing on positive aspects of life",
    icon: Heart,
    color: "from-accent to-wellness",
    content: "Write 3 things you're grateful for each day. Be specific and reflect on why they matter.",
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Release tension from your body systematically",
    icon: Brain,
    color: "from-medical to-primary",
    content: "Tense each muscle group for 5 seconds, then release. Start from toes, work up to head.",
  },
  {
    title: "Positive Affirmations",
    description: "Rewire your thinking patterns with affirming statements",
    icon: Sparkles,
    color: "from-secondary to-accent",
    content: "Repeat daily: 'I am capable', 'I deserve happiness', 'I am growing stronger every day'.",
  },
];

const SelfHelpLibrary = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-wellness" />
            Self-Help Resource Library
          </CardTitle>
          <CardDescription>
            Quick techniques and tips for stress reduction and mental wellness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {articles.map((article, index) => {
              const Icon = article.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-[var(--shadow-medium)] transition-all duration-300 group cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${article.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-base">{article.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {article.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfHelpLibrary;