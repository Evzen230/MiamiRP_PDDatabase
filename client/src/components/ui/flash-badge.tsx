import { useEffect, useState } from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FlashBadgeProps extends BadgeProps {
  children: React.ReactNode;
}

export default function FlashBadge({ children, className, ...props }: FlashBadgeProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // Start flashing when component mounts
    setIsFlashing(true);
    
    // Stop flashing after 3 seconds
    const timer = setTimeout(() => {
      setIsFlashing(false);
    }, 3000);

    // Set up interval to flash periodically
    const interval = setInterval(() => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 3000);
    }, 30000); // Flash every 30 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <Badge
      {...props}
      className={cn(
        className,
        isFlashing && "animate-pulse"
      )}
      style={{
        animation: isFlashing 
          ? "flash 1s ease-in-out 3" 
          : undefined,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes flash {
          0%, 50% { background-color: hsl(0, 84.2%, 60.2%); }
          25%, 75% { background-color: hsl(221, 83%, 53%); }
        }
      `}</style>
    </Badge>
  );
}
