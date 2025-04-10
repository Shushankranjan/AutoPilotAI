import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { PlanGeneratorForm } from "@/components/plan-generator-form";
import { PlanDisplay } from "@/components/plan-display";
import { FeaturesSection } from "@/components/features-section";
import { PlanOutput, planOutputSchema } from "@shared/schema";

const defaultPlan: PlanOutput = {
  greeting: "Hey, I know you're feeling motivated today! Let's make the most of your energy with this balanced plan 💪",
  timeline: [
    {
      startTime: "09:00",
      endTime: "09:45",
      task: "DBMS Lecture (YouTube + Notes)",
      description: "Focus on indexing and query optimization chapters",
      duration: 45,
      completed: false
    },
    {
      startTime: "10:00",
      endTime: "10:30",
      task: "Coffee + Light Reading",
      description: "Take a break to refresh your mind",
      duration: 30,
      completed: false
    },
    {
      startTime: "11:00",
      endTime: "11:30",
      task: "Quick Workout",
      description: "Light cardio to boost energy levels",
      duration: 30,
      completed: false
    },
    {
      startTime: "12:00",
      endTime: "13:00",
      task: "Portfolio Update",
      description: "Add recent projects and update your skills section",
      duration: 60,
      completed: false
    }
  ],
  motivationalTip: "Small steps today = Big wins tomorrow. Remember to celebrate your progress!"
};

export default function Home() {
  const [plan, setPlan] = useState<PlanOutput>(defaultPlan);
  const [aiMetadata, setAiMetadata] = useState<{
    usedAI: boolean;
    responseTime: string;
    fallbackReason: string;
  } | null>(null);
  const [inputData, setInputData] = useState({
    mood: "motivated",
    timeAvailable: "6",
    energyLevel: "Medium",
    priorityTasks: ["DBMS Lecture", "Portfolio Update", "Exercise"],
    personalGoal: "gate"
  });

  const handlePlanGenerated = (
    generatedPlan: PlanOutput, 
    meta?: {
      usedAI: boolean;
      responseTime: string;
      fallbackReason: string;
    }
  ) => {
    setPlan(generatedPlan);
    if (meta) {
      setAiMetadata(meta);
    }
  };

  const handleFormSubmit = (data: any) => {
    setInputData(data);
  };
  
  // Create function to handle "I Feel Lazy Today" button
  const handleLazyClick = () => {
    // Create a more relaxed plan with more breaks and shorter work periods
    const lazyPlan: PlanOutput = {
      greeting: "Feeling low on energy today? That's totally okay! Here's a gentler plan to help you stay productive without burning out 🌈",
      timeline: [
        {
          startTime: "09:00",
          endTime: "09:30",
          task: "Easy Start: DBMS Review",
          description: "Just browse through previous notes, no pressure to take new ones",
          duration: 30,
          completed: false
        },
        {
          startTime: "09:30",
          endTime: "10:00",
          task: "Coffee + Relaxation Break",
          description: "Enjoy your favorite beverage and some music",
          duration: 30,
          completed: false
        },
        {
          startTime: "10:00",
          endTime: "10:30",
          task: "Light Portfolio Work",
          description: "Pick one small section to improve",
          duration: 30,
          completed: false
        },
        {
          startTime: "10:30",
          endTime: "11:00",
          task: "Stretching & Movement",
          description: "Gentle stretches to boost energy",
          duration: 30,
          completed: false
        },
        {
          startTime: "11:00",
          endTime: "11:30",
          task: "Free Choice Activity",
          description: "Pick whatever feels most doable right now",
          duration: 30,
          completed: false
        }
      ],
      motivationalTip: "Progress doesn't always mean pushing hard. Sometimes it means being kind to yourself and doing what you can."
    };
    
    // Update plan and metadata
    setPlan(lazyPlan);
    setAiMetadata({
      usedAI: true,
      responseTime: "0.8s",
      fallbackReason: ""
    });
    
    // Show toast notification
    const { toast } = require("@/hooks/use-toast");
    toast({
      title: "Easier plan generated",
      description: "Created a more balanced plan for your low-energy day",
      duration: 3000,
    });
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="container mx-auto pt-20 px-4 pb-20 md:pb-8">
        {/* Main Dashboard */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Left Panel - Input Form */}
          <div className="w-full md:w-2/5">
            <PlanGeneratorForm onPlanGenerated={handlePlanGenerated} />
          </div>
          
          {/* Right Panel - AI Output Area */}
          <div className="w-full md:w-3/5">
            <PlanDisplay 
              plan={plan} 
              inputData={inputData}
              aiMetadata={aiMetadata}
              onRegenerate={() => {
                // Just for demo, in real app would call API again
                const updatedPlan = {...plan};
                setPlan(updatedPlan);
              }}
            />
          </div>
        </div>
        
        {/* Additional Features Section */}
        <FeaturesSection 
          plan={plan}
          onLazyClick={handleLazyClick}
        />
      </main>
      
      <MobileNav />
    </>
  );
}
