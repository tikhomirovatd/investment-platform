/**
 * Интеграционный файл для перехода с JavaScript на Kotlin-сервер
 * Этот файл будет предоставлять единый интерфейс для работы с бэкендом,
 * чтобы в будущем можно было легко переключиться на Kotlin-сервер
 */

import type { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import { storage, IStorage } from './storage';
import { User, Project, Request as RequestModel, InsertUser, InsertProject, InsertRequest } from '@shared/schema';

// Конфигурация для Kotlin-сервера
const KOTLIN_SERVER_URL = process.env.KOTLIN_SERVER_URL || 'http://localhost:8080/api';
let USE_KOTLIN_SERVER = process.env.USE_KOTLIN_SERVER === 'true';

// Статус работоспособности серверов
const serverStatus = {
  kotlin: false,
  lastCheck: 0
};

/**
 * Включает или выключает использование Kotlin-сервера
 * @param enabled true для использования Kotlin-сервера, false для JS-сервера
 */
export function toggleKotlinServerUsage(enabled: boolean): void {
  USE_KOTLIN_SERVER = enabled;
  // Сбрасываем кэш проверки при переключении режимов
  serverStatus.lastCheck = 0;
}

/**
 * Возвращает текущую настройку использования Kotlin-сервера
 */
export function isKotlinServerEnabled(): boolean {
  return USE_KOTLIN_SERVER;
}

/**
 * Проверяет доступность Kotlin-сервера и возвращает его статус
 * @returns true если Kotlin-сервер доступен, false в противном случае
 */
export async function checkKotlinServerAvailability(): Promise<boolean> {
  // Проверяем не чаще чем раз в 30 секунд
  const now = Date.now();
  if (now - serverStatus.lastCheck < 30000) {
    return serverStatus.kotlin;
  }

  try {
    await axios.get(`${KOTLIN_SERVER_URL}/health`, { timeout: 2000 });
    serverStatus.kotlin = true;
  } catch (error) {
    serverStatus.kotlin = false;
    console.warn('Kotlin server is not available. Using JS implementation instead.');
  }
  
  serverStatus.lastCheck = now;
  return serverStatus.kotlin;
}

// Типы сервера для маршрутизации запросов
type ServerType = 'js' | 'kotlin';

/**
 * Определяет, какую реализацию сервера использовать
 * Учитывает как настройки, так и доступность сервера Kotlin
 */
async function getServerType(): Promise<ServerType> {
  if (!USE_KOTLIN_SERVER) {
    return 'js';
  }
  
  // Проверяем доступность Kotlin-сервера
  const isKotlinAvailable = await checkKotlinServerAvailability();
  return isKotlinAvailable ? 'kotlin' : 'js';
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
 * В случае использования среды с переключением не гарантирует,
 * что то же самое хранилище будет использоваться для всех запросов,
 * т.к. статус сервера может меняться
 */
export async function getStorageAsync(): Promise<IStorage> {
  const serverType = await getServerType();
  return serverType === 'kotlin' ? kotlinStorage : storage;
}

/**
 * Получает соответствующую реализацию хранилища данных
 * Для обратной совместимости всегда использует JS-реализацию
 * если полная проверка доступности не была выполнена
 */
export function getStorage(): IStorage {
  // Если сервер точно был проверен и доступен, используем его
  if (USE_KOTLIN_SERVER && serverStatus.kotlin) {
    return kotlinStorage;
  }
  
  // В противном случае, используем JS реализацию
  return storage;
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
 * 
 * При использовании с USE_KOTLIN_SERVER=true будет проверять доступность
 * Kotlin-сервера перед каждым запросом и переключаться на JS-реализацию,
 * если Kotlin-сервер недоступен
 */
export class StorageProxy implements IStorage {
  /**
   * Получает актуальную реализацию хранилища данных
   * В "динамическом" режиме (USE_KOTLIN_SERVER=true) проверяет доступность
   * Kotlin-сервера перед каждым запросом
   */
  private async getAsyncImpl(): Promise<IStorage> {
    if (USE_KOTLIN_SERVER) {
      return await getStorageAsync();
    }
    return storage;
  }
  
  /**
   * Синхронная версия для обратной совместимости
   */
  private getImpl(): IStorage {
    return getStorage();
  }

  // Пользователи
  async getUsers(): Promise<User[]> {
    const impl = await this.getAsyncImpl();
    return impl.getUsers();
  }

  async getUser(id: number): Promise<User | undefined> {
    const impl = await this.getAsyncImpl();
    return impl.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const impl = await this.getAsyncImpl();
    return impl.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const impl = await this.getAsyncImpl();
    return impl.createUser(user);
  }

  // Проекты
  async getProjects(filters?: { isCompleted?: boolean }): Promise<Project[]> {
    const impl = await this.getAsyncImpl();
    return impl.getProjects(filters);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const impl = await this.getAsyncImpl();
    return impl.getProject(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const impl = await this.getAsyncImpl();
    return impl.createProject(project);
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    const impl = await this.getAsyncImpl();
    return impl.updateProject(id, data);
  }

  async deleteProject(id: number): Promise<boolean> {
    const impl = await this.getAsyncImpl();
    return impl.deleteProject(id);
  }

  // Запросы
  async getRequests(): Promise<RequestModel[]> {
    const impl = await this.getAsyncImpl();
    return impl.getRequests();
  }

  async getRequest(id: number): Promise<RequestModel | undefined> {
    const impl = await this.getAsyncImpl();
    return impl.getRequest(id);
  }

  async createRequest(request: InsertRequest): Promise<RequestModel> {
    const impl = await this.getAsyncImpl();
    return impl.createRequest(request);
  }

  async updateRequest(id: number, data: Partial<RequestModel>): Promise<RequestModel | undefined> {
    const impl = await this.getAsyncImpl();
    return impl.updateRequest(id, data);
  }
}

// Экспортируем прокси-объект для использования в роутах
export const storageProxy = new StorageProxy();