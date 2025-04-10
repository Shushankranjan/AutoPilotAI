import { 
  users, 
  plans, 
  type User, 
  type InsertUser, 
  type Plan, 
  type InsertPlan 
} from "@shared/schema";

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

export const storage = new MemStorage();
