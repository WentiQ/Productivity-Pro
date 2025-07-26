import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  timeRemaining: string;
  phase: string;
  isRunning: boolean;
  className?: string;
}

export default function TimerDisplay({ timeRemaining, phase, isRunning, className }: TimerDisplayProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-2xl">
          {/* Inner content */}
          <div className="w-56 h-56 rounded-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center shadow-inner">
            <div className="text-center">
              <div className={cn(
                "text-6xl font-bold transition-colors duration-300",
                isRunning ? "text-primary" : "text-gray-600 dark:text-gray-300"
              )}>
                {timeRemaining}
              </div>
              <div className={cn(
                "text-lg font-medium mt-2 transition-colors duration-300",
                isRunning ? "text-primary opacity-90" : "text-gray-500 dark:text-gray-400"
              )}>
                {phase}
              </div>
            </div>
          </div>
        </div>
        
        {/* Pulse animation when running */}
        {isRunning && (
          <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-pulse" />
        )}
      </div>
      
      {/* Status indicator */}
      <div className="mt-4 flex items-center space-x-2">
        <div className={cn(
          "w-3 h-3 rounded-full transition-colors duration-300",
          isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"
        )} />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {isRunning ? "Active" : "Paused"}
        </span>
      </div>
    </div>
  );
}
