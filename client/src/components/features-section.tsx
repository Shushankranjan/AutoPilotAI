import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Zap, Coffee, BatteryCharging } from "lucide-react";
import { PlanOutput } from "@shared/schema";

interface FeaturesSectionProps {
  plan: PlanOutput;
  onLazyClick: () => void;
}

export function FeaturesSection({ plan, onLazyClick }: FeaturesSectionProps) {
  const [motivationEnabled, setMotivationEnabled] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  
  // Update progress stats when plan changes
  useEffect(() => {
    if (plan && plan.timeline) {
      const total = plan.timeline.length;
      const completed = plan.timeline.filter(task => task.completed).length;
      setTotalTasks(total);
      setCompletedCount(completed);
    }
  }, [plan]);
  
  // Calculate percentage for display
  const percentComplete = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Progress Tracker */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Progress</h3>
        
        <div className="flex items-center justify-center py-4">
          <ProgressCircle value={completedCount} max={totalTasks}>
            <span className="text-2xl font-bold text-gray-800">{percentComplete}%</span>
            <span className="text-xs text-gray-500">Completed</span>
          </ProgressCircle>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 mb-3">
            You've completed {completedCount} of {totalTasks} tasks today
          </p>
          <Button variant="outline" className="w-full text-sm">
            View Details
          </Button>
        </div>
      </div>
      
      {/* I Feel Lazy Button */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-md flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Need a Break?</h3>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">Having trouble staying focused? Try an easier schedule.</p>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg transition-all"
            onClick={onLazyClick}
          >
            🥱 I Feel Lazy Today
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              // Show energy boost tips in a toast
              const energyTips = [
                "Take a 5-minute walk outside for fresh air",
                "Do 10 jumping jacks to get your blood flowing",
                "Drink a glass of water - dehydration causes fatigue",
                "Try the 4-7-8 breathing technique for renewed focus",
                "Have a healthy snack like nuts or fruit"
              ];
              
              const randomTip = energyTips[Math.floor(Math.random() * energyTips.length)];
              
              // Import toast from hooks to show the tip
              const { toast } = require("@/hooks/use-toast");
              toast({
                title: "Quick Energy Boost",
                description: randomTip,
                duration: 5000,
              });
            }}
          >
            <BatteryCharging className="h-4 w-4" /> 
            Quick Energy Boost Tips
          </Button>
        </div>
      </div>
      
      {/* Motivation Buddy */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-md flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Motivation Buddy</h3>
          
          <div className="flex items-center">
            <Switch
              checked={motivationEnabled}
              onCheckedChange={setMotivationEnabled}
            />
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          {motivationEnabled ? (
            <>
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg relative">
                <p className="text-gray-700 text-sm">
                  <span className="block text-purple-800 font-medium mb-1">Focus Tip</span>
                  {plan && plan.timeline.length > 0 && !plan.timeline.every(t => t.completed) ? (
                    "Break your remaining tasks into smaller chunks to make them feel more manageable."
                  ) : completedCount === totalTasks && totalTasks > 0 ? (
                    "Great job completing all your tasks! Take some time to celebrate your achievements."
                  ) : (
                    "Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break."
                  )}
                </p>
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4" />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg relative">
                <p className="text-gray-700 text-sm">
                  <span className="block text-blue-800 font-medium mb-1">Daily Quote</span>
                  {percentComplete < 30 ? (
                    "\"The journey of a thousand miles begins with a single step.\" — Lao Tzu"
                  ) : percentComplete < 70 ? (
                    "\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" — Winston Churchill"
                  ) : (
                    "\"You've got this! Finish strong and be proud of what you've accomplished today.\""
                  )}
                </p>
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <p className="text-center text-sm">Motivation Buddy is currently disabled</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full mt-4 text-sm flex items-center justify-center gap-2"
            onClick={async () => {
              // Use AI to generate personalized motivation if available
              try {
                // Create a payload to send to the API
                const payload = {
                  progress: percentComplete,
                  completedTasks: completedCount,
                  totalTasks: totalTasks,
                  mood: plan?.timeline?.some(t => t.task.toLowerCase().includes("break")) ? "needs-break" : "focused"
                };
                
                // Show loading toast
                const { toast } = require("@/hooks/use-toast");
                toast({
                  title: "Generating AI motivation...",
                  duration: 1500,
                });
                
                // In a real implementation, we would call an API endpoint
                // For now, simulate AI response with a timeout
                setTimeout(() => {
                  const motivationalMessages = [
                    "Remember, consistency beats perfection. Small daily progress adds up to big results!",
                    "Your future self will thank you for the effort you're putting in today. Keep going!",
                    "Don't compare your beginning to someone else's middle. Focus on your own progress.",
                    "The difference between ordinary and extraordinary is that little extra. You've got this!"
                  ];
                  
                  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                  
                  toast({
                    title: "AI Motivation Buddy",
                    description: randomMessage,
                    duration: 5000,
                  });
                }, 1500);
              } catch (error) {
                console.error("Error generating AI motivation:", error);
                // Show fallback message
                const { toast } = require("@/hooks/use-toast");
                toast({
                  title: "Motivation Tip",
                  description: "Stay focused on your journey, not the destination. Every step counts!",
                  duration: 5000,
                });
              }
            }}
          >
            <Zap className="h-4 w-4" />
            Get AI Motivation
          </Button>
        </div>
      </div>
    </div>
  );
}
