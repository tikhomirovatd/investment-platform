/**
 * Интеграционный файл для перехода с JavaScript на Kotlin-сервер
 * Этот файл будет предоставлять единый интерфейс для работы с бэкендом,
 * чтобы в будущем можно было легко переключиться на Kotlin-сервер
 */

import type { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { storage, IStorage } from './storage';
import { User, Project, Request as RequestModel, InsertUser, InsertProject, InsertRequest } from '@shared/schema';

// Конфигурация для Kotlin-сервера
const KOTLIN_SERVER_URL = process.env.KOTLIN_SERVER_URL || 'http://localhost:5000/api';
const USE_KOTLIN_SERVER = process.env.USE_KOTLIN_SERVER === 'true';

// Типы сервера для маршрутизации запросов
type ServerType = 'js' | 'kotlin';

/**
 * Определяет, какую реализацию сервера использовать
 */
function getServerType(): ServerType {
  return USE_KOTLIN_SERVER ? 'kotlin' : 'js';
}

/**
 * Прокси-реализация хранилища данных, перенаправляющая запросы в Kotlin-сервер
 */
class KotlinStorageAdapter implements IStorage {
  // Пользователи
  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${KOTLIN_SERVER_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      return [];
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const response = await axios.get(`${KOTLIN_SERVER_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении пользователя с ID ${id}:`, error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const users = await this.getUsers();
      return users.find(user => user.username === username);
    } catch (error) {
      console.error(`Ошибка при получении пользователя по имени ${username}:`, error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const response = await axios.post(`${KOTLIN_SERVER_URL}/users`, user);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw error;
    }
  }

  // Проекты
  async getProjects(filters?: { isCompleted?: boolean }): Promise<Project[]> {
    try {
      const params = filters ? { params: filters } : {};
      const response = await axios.get(`${KOTLIN_SERVER_URL}/projects`, params);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении проектов:', error);
      return [];
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const response = await axios.get(`${KOTLIN_SERVER_URL}/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении проекта с ID ${id}:`, error);
      return undefined;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    try {
      const response = await axios.post(`${KOTLIN_SERVER_URL}/projects`, project);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      throw error;
    }
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    try {
      const response = await axios.patch(`${KOTLIN_SERVER_URL}/projects/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении проекта с ID ${id}:`, error);
      return undefined;
    }
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      await axios.delete(`${KOTLIN_SERVER_URL}/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении проекта с ID ${id}:`, error);
      return false;
    }
  }

  // Запросы
  async getRequests(): Promise<RequestModel[]> {
    try {
      const response = await axios.get(`${KOTLIN_SERVER_URL}/requests`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении запросов:', error);
      return [];
    }
  }

  async getRequest(id: number): Promise<RequestModel | undefined> {
    try {
      const response = await axios.get(`${KOTLIN_SERVER_URL}/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении запроса с ID ${id}:`, error);
      return undefined;
    }
  }

  async createRequest(request: InsertRequest): Promise<RequestModel> {
    try {
      const response = await axios.post(`${KOTLIN_SERVER_URL}/requests`, request);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании запроса:', error);
      throw error;
    }
  }

  async updateRequest(id: number, data: Partial<RequestModel>): Promise<RequestModel | undefined> {
    try {
      const response = await axios.patch(`${KOTLIN_SERVER_URL}/requests/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении запроса с ID ${id}:`, error);
      return undefined;
    }
  }
}

// Экземпляр адаптера для Kotlin-сервера
const kotlinStorage = new KotlinStorageAdapter();

/**
 * Получает соответствующую реализацию хранилища данных
 */
export function getStorage(): IStorage {
  const serverType = getServerType();
  return serverType === 'kotlin' ? kotlinStorage : storage;
}

/**
 * Middleware для обработки ошибок интеграции с Kotlin-сервером
 */
export function kotlinIntegrationErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.name === 'KotlinServerIntegrationError') {
    return res.status(502).json({ error: 'Ошибка интеграции с Kotlin-сервером', details: err.message });
  }
  next(err);
}

/**
 * Создаст промежуточный объект, реализующий IStorage, который будет
 * перенаправлять запросы либо в JavaScript, либо в Kotlin-реализацию
 */
export class StorageProxy implements IStorage {
  private getImpl(): IStorage {
    return getStorage();
  }

  // Пользователи
  async getUsers(): Promise<User[]> {
    return this.getImpl().getUsers();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.getImpl().getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.getImpl().getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.getImpl().createUser(user);
  }

  // Проекты
  async getProjects(filters?: { isCompleted?: boolean }): Promise<Project[]> {
    return this.getImpl().getProjects(filters);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.getImpl().getProject(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    return this.getImpl().createProject(project);
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    return this.getImpl().updateProject(id, data);
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.getImpl().deleteProject(id);
  }

  // Запросы
  async getRequests(): Promise<RequestModel[]> {
    return this.getImpl().getRequests();
  }

  async getRequest(id: number): Promise<RequestModel | undefined> {
    return this.getImpl().getRequest(id);
  }

  async createRequest(request: InsertRequest): Promise<RequestModel> {
    return this.getImpl().createRequest(request);
  }

  async updateRequest(id: number, data: Partial<RequestModel>): Promise<RequestModel | undefined> {
    return this.getImpl().updateRequest(id, data);
  }
}

// Экспортируем прокси-объект для использования в роутах
export const storageProxy = new StorageProxy();