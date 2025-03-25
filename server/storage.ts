import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  requests, type Request, type InsertRequest
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project operations
  getProjects(filters?: { isCompleted?: boolean }): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Request operations
  getRequests(): Promise<Request[]>;
  getRequest(id: number): Promise<Request | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: number, data: Partial<Request>): Promise<Request | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private requests: Map<number, Request>;
  
  private userCurrentId: number;
  private projectCurrentId: number;
  private requestCurrentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.requests = new Map();
    
    this.userCurrentId = 1;
    this.projectCurrentId = 1;
    this.requestCurrentId = 1;
    
    // Add some initial data
    this.initializeData();
  }

  private initializeData() {
    // Add initial users
    this.createUser({
      userType: 'SELLER',
      username: 'seller1',
      password: 'password',
      organizationName: 'Acme Corp',
      fullName: 'John Doe',
      phone: '+1234567890',
      comments: 'Regular seller',
    });
    
    this.createUser({
      userType: 'BUYER',
      username: 'buyer1',
      password: 'password',
      organizationName: 'Globex Corp',
      fullName: 'Jane Smith',
      phone: '+0987654321',
      comments: 'Strategic buyer',
    });
    
    // Add initial projects
    this.createProject({
      name: 'Food Processing Plant',
      dealType: 'SALE',
      industry: 'Food & Beverage',
      isVisible: true,
      isCompleted: false,
    });
    
    this.createProject({
      name: 'Semiconductor Manufacturer',
      dealType: 'INVESTMENT',
      industry: 'Electronics',
      isVisible: true,
      isCompleted: false,
    });
    
    this.createProject({
      name: 'IT Management Services',
      dealType: 'SALE',
      industry: 'IT',
      isVisible: true,
      isCompleted: false,
    });
    
    this.createProject({
      name: 'Agricultural Complex',
      dealType: 'SALE',
      industry: 'Agriculture',
      isVisible: true,
      isCompleted: false,
    });
    
    // Add initial requests
    this.createRequest({
      userType: 'SELLER',
      topic: 'Selling retail business',
      status: 'NEW',
      fullName: 'Robert Johnson',
      phone: '+1122334455',
      comments: 'Looking for quick exit',
    });
    
    this.createRequest({
      userType: 'BUYER',
      topic: 'Seeking IT acquisition',
      status: 'IN_PROGRESS',
      fullName: 'Mary Williams',
      phone: '+5566778899',
      comments: 'Strategic expansion',
    });
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
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
    const now = new Date();
    const user: User = { ...insertUser, id, lastAccess: now };
    this.users.set(id, user);
    return user;
  }
  
  // Project operations
  async getProjects(filters?: { isCompleted?: boolean }): Promise<Project[]> {
    let result = Array.from(this.projects.values());
    
    if (filters) {
      if (filters.isCompleted !== undefined) {
        result = result.filter(p => p.isCompleted === filters.isCompleted);
      }
    }
    
    return result;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const now = new Date();
    const project: Project = { ...insertProject, id, createdAt: now };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...data };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Request operations
  async getRequests(): Promise<Request[]> {
    return Array.from(this.requests.values());
  }

  async getRequest(id: number): Promise<Request | undefined> {
    return this.requests.get(id);
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const id = this.requestCurrentId++;
    const now = new Date();
    const request: Request = { ...insertRequest, id, createdAt: now };
    this.requests.set(id, request);
    return request;
  }

  async updateRequest(id: number, data: Partial<Request>): Promise<Request | undefined> {
    const request = this.requests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...data };
    this.requests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
