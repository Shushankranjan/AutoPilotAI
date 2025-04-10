import { PlanGenerationInput, PlanOutput } from "@shared/schema";
import { apiRequest } from "./queryClient";

/**
 * Generates an AI-powered daily plan based on user input
 * 
 * @param input The user's plan generation preferences
 * @returns A promise resolving to the generated plan
 */
export async function generateAIPlan(input: PlanGenerationInput): Promise<PlanOutput> {
  try {
    const response = await apiRequest("POST", "/api/plans/generate", input);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to generate plan");
    }
    
    return data.plan;
  } catch (error) {
    console.error("Error generating AI plan:", error);
    throw error;
  }
}

/**
 * Creates a reformatted plan text for copying to clipboard
 * 
 * @param plan The plan to format as text
 * @returns A formatted string representation of the plan
 */
export function formatPlanForCopy(plan: PlanOutput): string {
  const taskList = plan.timeline.map(task => {
    return `${task.startTime}–${task.endTime} – ${task.task}${
      task.description ? `\n${task.description}` : ''
    }`;
  }).join('\n\n');

  return `
${plan.greeting}

${taskList}

Motivational Tip: ${plan.motivationalTip}
  `.trim();
}

/**
 * Gets a personalized greeting based on mood and time of day
 * 
 * @param mood The user's current mood
 * @returns A personalized greeting string
 */
export function getPersonalizedGreeting(mood: string, name: string = "there"): string {
  const timeOfDay = getTimeOfDay();
  const moodGreetings: Record<string, string[]> = {
    motivated: [
      `Good ${timeOfDay}, ${name}! You're feeling motivated today - let's channel that energy!`,
      `Hey ${name}! I love your motivation today. Let's make it count!`,
      `${name}, your motivated energy is perfect for tackling today's challenges!`
    ],
    tired: [
      `Good ${timeOfDay}, ${name}. I see you're feeling tired - let's plan a gentle day.`,
      `Hey ${name}, we all get tired. I've crafted a manageable plan for your energy levels.`,
      `Rest is important, ${name}. Here's a balanced plan that respects your tired state.`
    ],
    overwhelmed: [
      `Good ${timeOfDay}, ${name}. Feeling overwhelmed? Let's break things down into small steps.`,
      `Hey ${name}, I can help simplify things when you're overwhelmed. One task at a time.`,
      `${name}, I've created a focused plan to help you navigate through the overwhelm.`
    ],
    calm: [
      `Good ${timeOfDay}, ${name}. Your calm state is perfect for thoughtful work today.`,
      `Hey ${name}, love that calm energy! Let's maintain that balance throughout the day.`,
      `${name}, I've designed a plan that complements your calm mindset perfectly.`
    ]
  };

  // Default to motivated if mood not found
  const greetings = moodGreetings[mood] || moodGreetings.motivated;
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Helper function to get time of day
 * 
 * @returns String representing the time of day (morning, afternoon, evening)
 */
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/**
 * Get a motivational tip based on context
 * 
 * @param context Optional context to customize the tip
 * @returns A motivational tip string
 */
export function getMotivationalTip(context?: string): string {
  const tips = [
    "Small steps today = Big wins tomorrow.",
    "Progress over perfection. Keep moving forward!",
    "You don't have to be perfect to make progress.",
    "Focus on what matters most, let go of the rest.",
    "Every productive day begins with a solid plan.",
    "The difference between ordinary and extraordinary is that little extra.",
    "Your future self will thank you for the effort you put in today.",
    "Remember to celebrate your wins, no matter how small."
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}
