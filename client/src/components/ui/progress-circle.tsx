import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

export function ProgressCircle({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  className,
  textClassName,
  children,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn("relative", className)}>
      <svg 
        className="transform -rotate-90" 
        width={size} 
        height={size}
      >
        <circle 
          className="text-gray-200" 
          stroke="currentColor" 
          fill="transparent" 
          strokeWidth={strokeWidth} 
          r={radius} 
          cx={size/2} 
          cy={size/2}
        />
        <circle 
          className="text-blue-500" 
          stroke="currentColor" 
          fill="transparent" 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          r={radius} 
          cx={size/2} 
          cy={size/2}
        />
      </svg>
      <div className={cn("absolute inset-0 flex items-center justify-center flex-col", textClassName)}>
        {children || (
          <>
            <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
            <span className="text-xs text-gray-500">Completed</span>
          </>
        )}
      </div>
    </div>
  );
}
