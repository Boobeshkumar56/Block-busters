
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hoverEffect = false
}) => {
  return (
    <div
      className={cn(
        "glassmorphism p-6 rounded-2xl transition-all duration-300",
        hoverEffect && "hover:shadow-lg hover:translate-y-[-2px]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
