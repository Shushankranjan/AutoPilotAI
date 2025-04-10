import { 
  users, 
  plans, 
  type User, 
  type InsertUser, 
  type Plan, 
  type InsertPlan 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  getPlansByUserId(userId: number): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plans: Map<number, Plan>;
  userCurrentId: number;
  planCurrentId: number;

  constructor() {
    this.users = new Map();
    this.plans = new Map();
    this.userCurrentId = 1;
    this.planCurrentId = 1;
    
    // Add a default user
    this.createUser({
      username: "demo",
      password: "password123",
      name: "Shushank",
      email: "demo@example.com",
      avatar: ""
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = this.planCurrentId++;
    const now = new Date();
    const plan: Plan = { 
      ...insertPlan, 
      id, 
      createdAt: now 
    };
    this.plans.set(id, plan);
    return plan;
  }

  async getPlansByUserId(userId: number): Promise<Plan[]> {
    return Array.from(this.plans.values())
      .filter(plan => plan.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const [plan] = await db
      .insert(plans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async getPlansByUserId(userId: number): Promise<Plan[]> {
    return await db
      .select()
      .from(plans)
      .where(eq(plans.userId, userId))
      .orderBy(plans.createdAt, { direction: 'desc' });
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan || undefined;
  }
}

// Initialize the database and add a default user
async function initializeDatabase() {
  const dbStorage = new DatabaseStorage();
  
  // Check if default user exists
  const existingUser = await dbStorage.getUserByUsername("demo");
  
  if (!existingUser) {
    // Add a default user
    await dbStorage.createUser({
      username: "demo",
      password: "password123",
      name: "Shushank",
      email: "demo@example.com",
      avatar: ""
    });
    console.log("Default user created");
  }
  
  return dbStorage;
}

// Export the storage instance
export const storage = new DatabaseStorage();

// Initialize the database asynchronously
(async () => {
  try {
    await initializeDatabase();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
})();
