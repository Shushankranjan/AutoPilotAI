import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { PlanGenerationInput, planGenerationSchema } from "@shared/schema";
import { generatePlan, type PlanGenerationResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { value: "motivated", emoji: "🔥", label: "Motivated" },
  { value: "tired", emoji: "😴", label: "Tired" },
  { value: "overwhelmed", emoji: "😵‍💫", label: "Overwhelmed" },
  { value: "calm", emoji: "🧘", label: "Calm" }
];

const timeOptions = [
  { value: "2", label: "2 hours" },
  { value: "3", label: "3 hours" },
  { value: "4", label: "4 hours" },
  { value: "6", label: "6 hours" },
  { value: "8", label: "8 hours" },
  { value: "full", label: "Full Day" }
];

const energyLevels = ["Low", "Medium", "High"];

const goals = [
  { value: "none", label: "Select a goal" },
  { value: "gate", label: "Crack GATE 2025" },
  { value: "portfolio", label: "Finish Portfolio" },
  { value: "fitness", label: "Improve Fitness" },
  { value: "reading", label: "Read 20 Books This Year" },
  { value: "custom", label: "Custom Goal..." }
];

interface PlanGeneratorFormProps {
  onPlanGenerated: (plan: any, meta?: {
    usedAI: boolean;
    responseTime: string;
    fallbackReason: string;
  }) => void;
}

export function PlanGeneratorForm({ onPlanGenerated }: PlanGeneratorFormProps) {
  const [selectedMood, setSelectedMood] = useState<string>("motivated");
  const [selectedEnergy, setSelectedEnergy] = useState<string>("Medium");
  const [taskInput, setTaskInput] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>(["DBMS Lecture", "Portfolio Update", "Exercise"]);
  const { toast } = useToast();

  const form = useForm<PlanGenerationInput>({
    resolver: zodResolver(planGenerationSchema),
    defaultValues: {
      mood: "motivated",
      timeAvailable: "6",
      energyLevel: "Medium",
      priorityTasks: ["DBMS Lecture", "Portfolio Update", "Exercise"],
      personalGoal: "gate" // If you select "none", using "gate" as default
    }
  });

  const generatePlanMutation = useMutation({
    mutationFn: generatePlan,
    onSuccess: (data) => {
      // Pass both the plan and the AI metadata
      onPlanGenerated(data.plan, data.meta);
      
      // Show a toast notification if AI fallback was used
      if (data.meta && !data.meta.usedAI) {
        toast({
          title: "Using intelligent fallback",
          description: data.meta.fallbackReason ? 
            `Reason: ${data.meta.fallbackReason}` : 
            "Using locally generated plan instead of AI",
          variant: "default"
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error generating plan",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleTaskAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && taskInput.trim()) {
      e.preventDefault();
      setTasks([...tasks, taskInput.trim()]);
      form.setValue('priorityTasks', [...tasks, taskInput.trim()]);
      setTaskInput("");
    }
  };

  const handleTaskRemove = (taskToRemove: string) => {
    const updatedTasks = tasks.filter(task => task !== taskToRemove);
    setTasks(updatedTasks);
    form.setValue('priorityTasks', updatedTasks);
  };

  const onSubmit = (data: PlanGenerationInput) => {
    generatePlanMutation.mutate(data);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-md h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">🎯 Generate Your Daily Plan</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Mood Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">How are you feeling today?</label>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((mood) => (
              <div
                key={mood.value}
                onClick={() => {
                  setSelectedMood(mood.value);
                  form.setValue('mood', mood.value);
                }}
                className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer hover:bg-blue-100 transition-colors ${
                  selectedMood === mood.value
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium mt-1">{mood.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Available */}
        <div>
          <label htmlFor="timeAvailable" className="block text-sm font-medium text-gray-600 mb-2">
            Time Available
          </label>
          <Select 
            defaultValue="6"
            onValueChange={value => form.setValue('timeAvailable', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time available" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Energy Level</label>
          <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
            {energyLevels.map((level) => (
              <Button
                key={level}
                type="button"
                variant="ghost"
                className={`flex-1 py-2 rounded-md text-center text-sm font-medium ${
                  selectedEnergy === level
                    ? "border border-gray-200 bg-white"
                    : ""
                }`}
                onClick={() => {
                  setSelectedEnergy(level);
                  form.setValue('energyLevel', level);
                }}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Priority Tasks */}
        <div>
          <label htmlFor="priorityTasks" className="block text-sm font-medium text-gray-600 mb-2">
            Priority Tasks
          </label>
          <div className="relative">
            <Input
              id="priorityTasks"
              placeholder="Type task and press Enter"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={handleTaskAdd}
            />
            <Plus className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {tasks.map((task, index) => (
              <div
                key={`${task}-${index}`}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {task}
                <span
                  onClick={() => handleTaskRemove(task)}
                  className="ml-1.5 text-blue-500 cursor-pointer"
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Personal Goal */}
        <div>
          <label htmlFor="personalGoal" className="block text-sm font-medium text-gray-600 mb-2">
            Personal Goal (Optional)
          </label>
          <Select 
            defaultValue="gate"
            onValueChange={value => form.setValue('personalGoal', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent>
              {goals.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>
                  {goal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Generate Button */}
        <Button
          type="submit"
          disabled={generatePlanMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all active:translate-y-0.5"
        >
          {generatePlanMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>⚡ Generate Smart Plan</>
          )}
        </Button>
      </form>
    </div>
  );
}
