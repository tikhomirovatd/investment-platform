import type { Express } from "express";
import { createServer, type Server } from "http";
import { storageProxy } from "./kotlin-integration";
import { insertUserSchema, insertProjectSchema, insertRequestSchema } from "@shared/schema";
import { z } from "zod";
import { kotlinIntegrationErrorHandler } from "./kotlin-integration";

export async function registerRoutes(app: Express): Promise<Server> {
  // Добавляем middleware для обработки ошибок Kotlin-интеграции
  app.use(kotlinIntegrationErrorHandler);

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storageProxy.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const newUser = await storageProxy.createUser(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const isCompleted = req.query.isCompleted === 'true' ? true : 
                         req.query.isCompleted === 'false' ? false : undefined;
      
      const projects = await storageProxy.getProjects({ isCompleted });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const newProject = await storageProxy.createProject(validatedData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storageProxy.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updatedProject = await storageProxy.updateProject(id, req.body);
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storageProxy.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      await storageProxy.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Requests routes
  app.get("/api/requests", async (req, res) => {
    try {
      const requests = await storageProxy.getRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const validatedData = insertRequestSchema.parse(req.body);
      const newRequest = await storageProxy.createRequest(validatedData);
      res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.patch("/api/requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }
      
      const request = await storageProxy.getRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      const updatedRequest = await storageProxy.updateRequest(id, req.body);
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
