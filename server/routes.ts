import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { planGenerationSchema } from "@shared/schema";
import { generateAIPlan } from "./openai";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate a plan
  app.post("/api/plans/generate", async (req: Request, res: Response) => {
    try {
      const planInput = planGenerationSchema.parse(req.body);
      
      // Mark the start time to calculate response time
      const startTime = Date.now();
      
      // Check if we have a valid API key to inform the client
      const hasValidApiKey = process.env.OPENAI_API_KEY && 
                            process.env.OPENAI_API_KEY.startsWith('sk-') && 
                            process.env.OPENAI_API_KEY.length > 20;
      
      let usedAI = true;
      let fallbackReason = '';
      
      try {
        const generatedPlan = await generateAIPlan(planInput);
        const responseTime = Date.now() - startTime;
        
        // If response is too fast, it's likely using the fallback
        if (responseTime < 500 && hasValidApiKey) {
          usedAI = false;
          
          // Check if a fallback reason was set in the global variable
          if ((global as any).aiPlanFallbackReason) {
            fallbackReason = (global as any).aiPlanFallbackReason;
            // Reset the global variable
            (global as any).aiPlanFallbackReason = null;
          } else {
            fallbackReason = 'API error or timeout';
          }
        }
        
        // Return the plan along with AI usage information
        res.json({
          success: true,
          plan: generatedPlan,
          meta: {
            usedAI,
            responseTime: `${responseTime}ms`,
            fallbackReason: usedAI ? '' : (fallbackReason || 'Used smart generation')
          }
        });
      } catch (aiError) {
        // This shouldn't happen since generateAIPlan has its own error handling,
        // but just in case, we'll handle it here
        console.error("Unexpected AI generation error:", aiError);
        
        // Import the fallback generator to use directly
        const { generateSmartFallbackPlan } = require('./openai');
        const fallbackPlan = generateSmartFallbackPlan(planInput);
        
        // Check if a fallback reason was set in the global variable
        let fallbackErrorReason = 'Error in AI processing';
        if ((global as any).aiPlanFallbackReason) {
          fallbackErrorReason = (global as any).aiPlanFallbackReason;
          // Reset the global variable
          (global as any).aiPlanFallbackReason = null;
        }
        
        res.json({
          success: true,
          plan: fallbackPlan,
          meta: {
            usedAI: false,
            responseTime: `${Date.now() - startTime}ms`,
            fallbackReason: fallbackErrorReason
          }
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        console.error("Error generating plan:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to generate plan"
        });
      }
    }
  });
  
  // API endpoint to save a plan (would require authentication in production)
  app.post("/api/plans", async (req: Request, res: Response) => {
    try {
      // For demo purposes, we'll use userId 1 (the demo user)
      const userId = 1;
      
      const plan = await storage.createPlan({
        userId,
        ...req.body
      });
      
      res.json({
        success: true,
        plan
      });
    } catch (error) {
      console.error("Error saving plan:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to save plan"
      });
    }
  });

  // API endpoint to get user's plans (would require authentication in production)
  app.get("/api/plans", async (req: Request, res: Response) => {
    try {
      // For demo purposes, we'll use userId 1 (the demo user)
      const userId = 1;
      
      const plans = await storage.getPlansByUserId(userId);
      
      res.json({
        success: true,
        plans
      });
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch plans"
      });
    }
  });

  // API endpoint to get current user
  app.get("/api/me", async (_req: Request, res: Response) => {
    try {
      // For demo purposes, we'll return the demo user
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch user"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
