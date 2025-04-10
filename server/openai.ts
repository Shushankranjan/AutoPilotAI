import OpenAI from "openai";
import { planOutputSchema, type PlanGenerationInput } from "@shared/schema";
import { z } from "zod";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-demo-key",
});

export async function generateAIPlan(input: PlanGenerationInput): Promise<z.infer<typeof planOutputSchema>> {
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
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate plan: Empty response from OpenAI");
    }

    const parsedPlan = JSON.parse(content);
    return planOutputSchema.parse(parsedPlan);
  } catch (error) {
    console.error("Error generating AI plan:", error);
    
    // Return a fallback plan if API fails
    return {
      greeting: `Sorry, I couldn't generate a personalized plan right now. Here's a standard plan instead.`,
      timeline: [
        {
          startTime: "09:00",
          endTime: "09:45",
          task: "Focus Session",
          description: "Work on your priority task",
          duration: 45
        },
        {
          startTime: "09:45",
          endTime: "10:00",
          task: "Short Break",
          description: "Stretch and grab some water",
          duration: 15
        },
        {
          startTime: "10:00",
          endTime: "11:00",
          task: "Deep Work",
          description: "Continue with your most important task",
          duration: 60
        }
      ],
      motivationalTip: "Small steps today lead to big progress tomorrow!"
    };
  }
}
