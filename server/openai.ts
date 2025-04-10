import OpenAI from "openai";
import { planOutputSchema, type PlanGenerationInput } from "@shared/schema";
import { z } from "zod";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-demo-key",
});

// Function to get a greeting based on mood and time of day
function getPersonalizedGreeting(mood: string, name: string = "there"): string {
  const hour = new Date().getHours();
  let timeOfDay = "day";
  
  if (hour < 12) timeOfDay = "morning";
  else if (hour < 17) timeOfDay = "afternoon";
  else timeOfDay = "evening";
  
  const moodGreetings: Record<string, string[]> = {
    motivated: [
      `Good ${timeOfDay}, ${name}! I see you're feeling motivated today - let's channel that energy!`,
      `Hey ${name}! Loving your motivation today. Let's make it count!`,
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

// Function to get a motivational tip
function getMotivationalTip(): string {
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

// Generate a smart fallback plan based on user input
export function generateSmartFallbackPlan(input: PlanGenerationInput): z.infer<typeof planOutputSchema> {
  const { mood, timeAvailable, energyLevel, priorityTasks } = input;
  const greeting = getPersonalizedGreeting(mood);
  const motivationalTip = getMotivationalTip();
  
  // Convert timeAvailable to number of hours (or default to 4)
  const hoursAvailable = timeAvailable === 'full' ? 8 : parseInt(timeAvailable) || 4;
  const startHour = 9; // Default start at 9 AM
  
  const timeline = [];
  let currentHour = startHour;
  let totalHours = 0;
  
  // Add tasks based on priorityTasks with appropriate durations
  for (const task of priorityTasks) {
    if (totalHours >= hoursAvailable) break;
    
    // Determine task duration based on energy level
    let taskDuration = 45; // Default 45 minutes
    if (energyLevel === 'Low') {
      taskDuration = 30;
    } else if (energyLevel === 'High') {
      taskDuration = 60;
    }
    
    // Cap task duration to not exceed available time
    const remainingMinutes = (hoursAvailable - totalHours) * 60;
    if (taskDuration > remainingMinutes) {
      taskDuration = remainingMinutes;
    }
    
    // Calculate end time
    const startMinutes = currentHour * 60;
    const endMinutes = startMinutes + taskDuration;
    const endHour = Math.floor(endMinutes / 60);
    const endMinuteRemainder = endMinutes % 60;
    
    timeline.push({
      startTime: `${String(currentHour).padStart(2, '0')}:00`,
      endTime: `${String(endHour).padStart(2, '0')}:${String(endMinuteRemainder).padStart(2, '0')}`,
      task: task,
      description: `Focus on completing ${task}`,
      duration: taskDuration
    });
    
    // Add a break if not the last task and not exceeding available time
    if (totalHours + (taskDuration + 15) / 60 < hoursAvailable) {
      const breakStartMinutes = endMinutes;
      const breakEndMinutes = breakStartMinutes + 15;
      const breakEndHour = Math.floor(breakEndMinutes / 60);
      const breakEndMinuteRemainder = breakEndMinutes % 60;
      
      timeline.push({
        startTime: `${String(endHour).padStart(2, '0')}:${String(endMinuteRemainder).padStart(2, '0')}`,
        endTime: `${String(breakEndHour).padStart(2, '0')}:${String(breakEndMinuteRemainder).padStart(2, '0')}`,
        task: "Quick Break",
        description: "Rest and recharge",
        duration: 15
      });
      
      currentHour = breakEndHour + breakEndMinuteRemainder / 60;
    } else {
      currentHour = endHour + endMinuteRemainder / 60;
    }
    
    totalHours = (currentHour - startHour);
  }
  
  // If we still have time, add a generic task
  if (totalHours < hoursAvailable && timeline.length > 0) {
    const remainingHours = hoursAvailable - totalHours;
    const remainingMinutes = Math.floor(remainingHours * 60);
    
    const startMinutes = currentHour * 60;
    const endMinutes = startMinutes + remainingMinutes;
    const endHour = Math.floor(endMinutes / 60);
    const endMinuteRemainder = endMinutes % 60;
    
    timeline.push({
      startTime: `${String(Math.floor(currentHour)).padStart(2, '0')}:${String(Math.floor(currentHour % 1 * 60)).padStart(2, '0')}`,
      endTime: `${String(endHour).padStart(2, '0')}:${String(endMinuteRemainder).padStart(2, '0')}`,
      task: "Flexible Work Session",
      description: "Work on any pending tasks or take time to relax",
      duration: remainingMinutes
    });
  }
  
  return {
    greeting,
    timeline,
    motivationalTip
  };
}

export async function generateAIPlan(input: PlanGenerationInput): Promise<z.infer<typeof planOutputSchema>> {
  // Check if we have a valid API key
  const hasValidApiKey = process.env.OPENAI_API_KEY && 
                        process.env.OPENAI_API_KEY.startsWith('sk-') && 
                        process.env.OPENAI_API_KEY.length > 20;
  
  // If no valid API key, use our smart fallback immediately
  if (!hasValidApiKey) {
    console.log("No valid OpenAI API key found. Using smart fallback plan generation.");
    return generateSmartFallbackPlan(input);
  }
  
  try {
    const { mood, timeAvailable, energyLevel, priorityTasks, personalGoal } = input;
    
    const systemPrompt = `You are an intelligent daily planner AI assistant called AutoPilot AI. 
Create a personalized daily plan based on the following user information:
- Mood: ${mood}
- Available Time: ${timeAvailable}
- Energy Level: ${energyLevel}
- Priority Tasks: ${priorityTasks.join(', ')}
- Personal Goal: ${personalGoal || 'Not specified'}

Provide your response as a JSON object with the following structure:
{
  "greeting": "A personalized greeting that acknowledges their mood",
  "timeline": [
    {
      "startTime": "Start time in HH:MM format",
      "endTime": "End time in HH:MM format",
      "task": "Task name",
      "description": "Brief description of the task",
      "duration": Duration in minutes
    }
  ],
  "motivationalTip": "A short motivational tip or advice"
}

Your response should:
1. Include a greeting that acknowledges their current mood
2. Break down the available time into appropriate tasks based on their priorities
3. Account for their energy level (easier tasks for low energy, challenging tasks for high energy)
4. Include breaks between focused work sessions
5. Incorporate their personal goal if provided
6. End with a motivational tip that encourages them to stay productive

The timeline should be realistic and well-balanced, with proper work-break intervals.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please generate a daily plan for me based on my preferences." }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate plan: Empty response from OpenAI");
    }

    try {
      const parsedPlan = JSON.parse(content);
      return planOutputSchema.parse(parsedPlan);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error("Failed to parse the AI response");
    }
  } catch (error: any) {
    console.error("Error generating AI plan:", error);
    
    // Check for specific OpenAI errors
    const errorMessage = error?.message || '';
    const errorType = error?.type || '';
    let fallbackReason = 'General OpenAI API error';
    
    if (errorType === 'insufficient_quota' || errorMessage.includes('quota') || error?.status === 429) {
      fallbackReason = 'API rate limit exceeded';
      console.log("OpenAI API quota exceeded. Using smart fallback plan generation.");
    } else if (error?.status === 401 || errorMessage.includes('invalid api key')) {
      fallbackReason = 'Invalid API key';
      console.log("Invalid OpenAI API key. Using smart fallback plan generation.");
    } else if (errorMessage.includes('timeout') || error?.status === 408) {
      fallbackReason = 'API request timeout';
      console.log("OpenAI API timeout. Using smart fallback plan generation.");
    } else {
      console.log("OpenAI API error. Using smart fallback plan generation.");
    }
    
    // Set a global variable to indicate fallback was used
    (global as any).aiPlanFallbackReason = fallbackReason;
    
    // Use our smart fallback generator
    return generateSmartFallbackPlan(input);
  }
}
