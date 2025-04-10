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
      const generatedPlan = await generateAIPlan(planInput);
      
      res.json({
        success: true,
        plan: generatedPlan
      });
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
