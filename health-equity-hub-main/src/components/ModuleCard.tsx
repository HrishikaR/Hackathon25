import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  path: string;
}

export const ModuleCard = ({ title, description, icon: Icon, gradient, path }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-medium)] group overflow-hidden relative"
    >
      <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${gradient}`} />
      <CardHeader>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};