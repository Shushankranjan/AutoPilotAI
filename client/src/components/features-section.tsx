import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Zap } from "lucide-react";

export function FeaturesSection() {
  const [motivationEnabled, setMotivationEnabled] = useState(true);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Progress Tracker */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Progress</h3>
        
        <div className="flex items-center justify-center py-4">
          <ProgressCircle value={3} max={4}>
            <span className="text-2xl font-bold text-gray-800">75%</span>
            <span className="text-xs text-gray-500">Completed</span>
          </ProgressCircle>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 mb-3">You've completed 3 of 4 tasks today</p>
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
          >
            🥱 I Feel Lazy Today
          </Button>
          
          <Button variant="outline" className="w-full">
            🔋 Quick Energy Boost Tips
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
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg relative">
            <p className="text-gray-700 text-sm">
              <span className="block text-purple-800 font-medium mb-1">Focus Tip</span>
              Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break.
            </p>
            <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              <Lightbulb className="h-4 w-4" />
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg relative">
            <p className="text-gray-700 text-sm">
              <span className="block text-blue-800 font-medium mb-1">Daily Quote</span>
              "The secret of getting ahead is getting started." — Mark Twain
            </p>
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4 text-sm">
            Refresh Tips
          </Button>
        </div>
      </div>
    </div>
  );
}
