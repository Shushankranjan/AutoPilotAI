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
      duration: 45
    },
    {
      startTime: "10:00",
      endTime: "10:30",
      task: "Coffee + Light Reading",
      description: "Take a break to refresh your mind",
      duration: 30
    },
    {
      startTime: "11:00",
      endTime: "11:30",
      task: "Quick Workout",
      description: "Light cardio to boost energy levels",
      duration: 30
    },
    {
      startTime: "12:00",
      endTime: "13:00",
      task: "Portfolio Update",
      description: "Add recent projects and update your skills section",
      duration: 60
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
        <FeaturesSection />
      </main>
      
      <MobileNav />
    </>
  );
}
