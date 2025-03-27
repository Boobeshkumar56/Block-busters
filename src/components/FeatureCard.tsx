
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "staggered-item glassmorphism p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] cursor-pointer",
        className
      )}
    >
      <div className="bg-health-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-health-700" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
