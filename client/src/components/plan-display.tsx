import { useState, useEffect } from "react";
import { PlanOutput } from "@shared/schema";
import { Check, Copy, Download, RefreshCw, Cpu, AlertTriangle, Clock, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { savePlan } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanDisplayProps {
  plan: PlanOutput;
  inputData: {
    mood: string;
    timeAvailable: string;
    energyLevel: string;
    priorityTasks: string[];
    personalGoal?: string;
  };
  onRegenerate: () => void;
  aiMetadata?: {
    usedAI: boolean;
    responseTime: string;
    fallbackReason: string;
  } | null;
}

export function PlanDisplay({ plan, inputData, onRegenerate, aiMetadata }: PlanDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(plan);
  const { toast } = useToast();
  
  // Update the current plan when the prop changes
  useEffect(() => {
    setCurrentPlan(plan);
  }, [plan]);
  
  const savePlanMutation = useMutation({
    mutationFn: savePlan,
    onSuccess: () => {
      toast({
        title: "Plan saved successfully",
        description: "You can view it in your plans page.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save plan",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleCopyPlan = async () => {
    try {
      const planText = `
${plan.greeting}

${plan.timeline.map(item => `${item.startTime}–${item.endTime} – ${item.task}${item.description ? `\n${item.description}` : ''}`).join('\n\n')}

Motivational Tip: ${plan.motivationalTip}
      `.trim();
      
      await navigator.clipboard.writeText(planText);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      toast({
        title: "Plan copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy plan",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSavePlan = () => {
    savePlanMutation.mutate({
      ...inputData,
      planData: plan
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-md h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">🗓️ Your Smart Schedule</h2>
        
        {/* AI Status Badge with Tooltip */}
        {aiMetadata && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant={aiMetadata.usedAI ? "default" : "outline"}
                  className={`flex items-center gap-1 cursor-help ${
                    aiMetadata.usedAI 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                      : "border-amber-500 text-amber-500"
                  }`}
                >
                  {aiMetadata.usedAI ? (
                    <>
                      <Cpu className="h-3 w-3" />
                      <span>AI Generated</span>
                      <span className="text-xs opacity-80">({aiMetadata.responseTime})</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      <span>Smart Fallback</span>
                      <Info className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {aiMetadata.usedAI ? (
                  <p className="text-xs">
                    This plan was generated using OpenAI GPT-4o model in {aiMetadata.responseTime}.
                    AI-generated plans are customized based on your mood, energy level, and priorities.
                  </p>
                ) : (
                  <p className="text-xs">
                    Using smart local generation due to: {aiMetadata.fallbackReason || "API unavailable"}.
                    AutoPilot still creates quality plans even when AI services aren't accessible.
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Personalized greeting */}
        <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
          {plan.greeting}
        </p>
        
        {/* Timeline-style plan */}
        <div className="space-y-3">
          {currentPlan.timeline.map((task, index) => {
            // Calculate duration in minutes for display
            const duration = task.duration || 30; // Default to 30 minutes if not provided
            
            // Determine color based on duration
            let durationColor = "bg-blue-100 text-blue-700";
            if (duration <= 30) {
              durationColor = "bg-green-100 text-green-700";
            } else if (duration >= 60) {
              durationColor = "bg-purple-100 text-purple-700"; 
            }
            
            // Handle task completion
            const handleTaskToggle = () => {
              const updatedPlan = {...currentPlan};
              updatedPlan.timeline[index].completed = !task.completed;
              setCurrentPlan(updatedPlan);
            };
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${task.completed 
                  ? "border-green-200 bg-green-50" 
                  : "border-gray-200 bg-white"} shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleTaskToggle} 
                      className={`rounded-full w-5 h-5 flex items-center justify-center ${
                        task.completed ? "bg-green-500 text-white" : "border border-gray-300"
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                    </button>
                    <span className="text-sm font-semibold text-blue-600">{task.startTime}–{task.endTime}</span>
                  </div>
                  <span className={`text-xs py-0.5 px-2 rounded-full ${durationColor}`}>{duration} min</span>
                </div>
                <h3 className={`font-medium ${task.completed ? "text-gray-500 line-through" : "text-gray-800"} mt-1 ml-7`}>
                  {task.task}
                </h3>
                {task.description && (
                  <p className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-500"} mt-1 ml-7`}>
                    {task.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Motivational Tip */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-800">
            <span className="font-bold">Motivational Tip:</span> {plan.motivationalTip}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleCopyPlan}
            className="flex items-center space-x-2"
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-500" />}
            <span>{copied ? "Copied!" : "Copy Plan"}</span>
          </Button>
          
          <Button
            onClick={handleSavePlan}
            disabled={savePlanMutation.isPending}
            className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            <Download className="h-5 w-5" />
            <span>Save Plan</span>
          </Button>
          
          <Button
            onClick={onRegenerate}
            className="flex items-center space-x-2 bg-purple-500 text-white hover:bg-purple-600"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Regenerate</span>
          </Button>
        </div>
      </div>
      
      {/* Pro Badge Watermark */}
      <div className="absolute top-5 right-5">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-xs text-white px-2 py-0.5 rounded-full">
          PRO
        </div>
      </div>
    </div>
  );
}
