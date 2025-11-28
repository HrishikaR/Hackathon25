import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const DiseaseAwareness = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setSession(session);
      loadChatHistory(session.user.id);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (!error && data) {
      setMessages(data.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
        id: msg.id,
      })));
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !session) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save user message
      await supabase.from("chat_messages").insert({
        user_id: session.user.id,
        role: "user",
        content: userMessage.content,
      });

      // Call AI chatbot edge function
      const { data, error } = await supabase.functions.invoke("disease-chatbot", {
        body: { message: userMessage.content },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        id: Date.now().toString() + "_ai",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      await supabase.from("chat_messages").insert({
        user_id: session.user.id,
        role: "assistant",
        content: assistantMessage.content,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-wellness/10 flex flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Disease Awareness Chatbot</h1>
            <p className="text-sm text-muted-foreground">AI-powered health education assistant</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col">
        <Card className="flex-1 flex flex-col shadow-[var(--shadow-medium)]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              Ask me about diseases, symptoms, prevention, and treatment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-wellness flex items-center justify-center mb-4">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Welcome to Disease Awareness</h3>
                  <p className="text-muted-foreground max-w-md">
                    I'm your AI health education assistant. Ask me about diseases, symptoms, prevention methods, treatments, and general health information.
                  </p>
                  <div className="mt-6 grid gap-2 text-sm text-left">
                    <p className="text-muted-foreground">Try asking:</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("What are the symptoms of diabetes?")}
                    >
                      "What are the symptoms of diabetes?"
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("How can I prevent the flu?")}
                    >
                      "How can I prevent the flu?"
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-wellness flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-wellness flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about diseases, symptoms, prevention..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This is an educational tool. Always consult healthcare professionals for medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DiseaseAwareness;