import { apiRequest } from "./queryClient";
import { PlanGenerationInput, PlanOutput } from "@shared/schema";

export type PlanGenerationResponse = {
  plan: PlanOutput;
  meta?: {
    usedAI: boolean;
    responseTime: string;
    fallbackReason: string;
  };
  success: boolean;
}

export async function generatePlan(input: PlanGenerationInput): Promise<PlanGenerationResponse> {
  const response = await apiRequest("POST", "/api/plans/generate", input);
  return response.json();
}

export async function savePlan(plan: {
  mood: string;
  timeAvailable: string;
  energyLevel: string;
  priorityTasks: string[];
  personalGoal?: string;
  planData: PlanOutput;
}): Promise<{ success: boolean }> {
  const response = await apiRequest("POST", "/api/plans", plan);
  return response.json();
}

export async function getUser(): Promise<{ 
  user: { 
    id: number; 
    username: string; 
    name?: string; 
    email?: string;
    avatar?: string;
  } 
}> {
  const response = await fetch("/api/me", {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  
  return response.json();
}
