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
    // Создаем пользователей напрямую в Map, минуя асинхронные методы
    const user1 = {
      id: this.userCurrentId++,
      userType: 'SELLER' as const,
      username: 'seller1',
      password: 'password',
      organizationName: 'Acme Corp',
      fullName: 'John Doe',
      phone: '+1234567890',
      comments: 'Regular seller',
      lastAccess: new Date()
    };
    
    const user2 = {
      id: this.userCurrentId++,
      userType: 'BUYER' as const,
      username: 'buyer1',
      password: 'password',
      organizationName: 'Globex Corp',
      fullName: 'Jane Smith',
      phone: '+0987654321',
      comments: 'Strategic buyer',
      lastAccess: new Date()
    };
    
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    
    // Создаем проекты с разными датами
    
    // Создаем объекты проектов
    const projects = [
      {
        id: this.projectCurrentId++,
        name: 'Food Processing Plant',
        dealType: 'SALE' as const,
        industry: 'Food & Beverage',
        isVisible: true,
        isCompleted: false,
        createdAt: new Date(), // текущая дата (новый проект)
        contactName1: 'Иванов Петр Сергеевич',
        contactPhone1: '+7 (900) 123-45-67',
        contactPosition1: 'Генеральный директор',
        contactPhone2: null,
        inn: '1234567890',
        location: 'Москва',
        revenue: '120 млн ₽',
        ebitda: '30 млн ₽',
        price: '450 млн ₽',
        salePercent: '100%',
        website: 'foodprocessing.ru',
        hideUntilNda: false,
        comments: 'Перспективный проект'
      },
      {
        id: this.projectCurrentId++,
        name: 'Semiconductor Manufacturer',
        dealType: 'INVESTMENT' as const,
        industry: 'Electronics',
        isVisible: true,
        isCompleted: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)), // 3 дня назад
        contactName1: 'Петров Алексей Владимирович',
        contactPhone1: '+7 (922) 345-67-89',
        contactPosition1: 'Финансовый директор',
        contactPhone2: '+7 (922) 345-67-80',
        inn: '0987654321',
        location: 'Санкт-Петербург',
        revenue: '350 млн ₽',
        ebitda: '80 млн ₽',
        price: '1200 млн ₽',
        salePercent: '49%',
        website: 'semiconductor.ru',
        hideUntilNda: true,
        comments: 'Требуются инвестиции в оборудование'
      },
      {
        id: this.projectCurrentId++,
        name: 'IT Management Services',
        dealType: 'SALE' as const,
        industry: 'IT',
        isVisible: true,
        isCompleted: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 дней назад
        contactName1: 'Смирнова Анна Ивановна',
        contactPhone1: '+7 (911) 987-65-43',
        contactPosition1: 'Руководитель отдела продаж',
        contactPhone2: null,
        inn: '5678901234',
        location: 'Казань',
        revenue: '80 млн ₽',
        ebitda: '20 млн ₽',
        price: '300 млн ₽',
        salePercent: '100%',
        website: 'itmanagement.ru',
        hideUntilNda: false,
        comments: 'Стабильный денежный поток'
      },
      {
        id: this.projectCurrentId++,
        name: 'Agricultural Complex',
        dealType: 'SALE' as const,
        industry: 'Agriculture',
        isVisible: true,
        isCompleted: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 дней назад
        contactName1: 'Козлов Дмитрий Андреевич',
        contactPhone1: '+7 (933) 456-78-90',
        contactPosition1: 'Собственник',
        contactPhone2: null,
        inn: '9012345678',
        location: 'Краснодар',
        revenue: '200 млн ₽',
        ebitda: '50 млн ₽',
        price: '600 млн ₽',
        salePercent: '100%',
        website: 'agro-complex.ru',
        hideUntilNda: false,
        comments: 'Земельный банк 5000 га'
      }
    ];
    
    // Установка времени (часы, минуты)
    projects[0].createdAt.setHours(10, 15, 0);
    projects[1].createdAt.setHours(14, 30, 0);
    projects[2].createdAt.setHours(9, 15, 0);
    projects[3].createdAt.setHours(11, 45, 0);
    
    // Добавляем проекты в хранилище
    for (const project of projects) {
      // Добавляем с правильными типами для null-значений
      const fullProject: Project = {
        ...project,
        contactName1: project.contactName1 || null,
        contactPhone1: project.contactPhone1 || null,
        contactPosition1: project.contactPosition1 || null,
        contactPhone2: project.contactPhone2 || null,
        inn: project.inn || null,
        location: project.location || null,
        revenue: project.revenue || null,
        ebitda: project.ebitda || null,
        price: project.price || null,
        salePercent: project.salePercent || null,
        website: project.website || null,
        hideUntilNda: project.hideUntilNda !== undefined ? project.hideUntilNda : false,
        comments: project.comments || null
      };
      this.projects.set(fullProject.id, fullProject);
    }
    
    // Создаем запросы с разными датами
    
    // Создаем объекты запросов
    const requests = [
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Заявка на размещение',
        status: 'NEW' as const,
        fullName: 'Иванов Петр Сергеевич',
        organizationName: 'АО "ИнвестФинанс"',
        cnum: '123456',
        login: 'ivanov_ps',
        phone: '+7 (900) 123-45-67',
        comments: 'Хочу разместить свой проект на платформе',
        createdAt: new Date() // сегодня
      },
      {
        id: this.requestCurrentId++,
        userType: 'BUYER' as const,
        topic: 'Запрос доступа',
        status: 'IN_PROGRESS' as const,
        fullName: 'Смирнова Анна Ивановна',
        organizationName: 'ООО "ТехИнвест"',
        cnum: '789012',
        login: 'smirnova_ai',
        phone: '+7 (911) 987-65-43',
        comments: 'Необходим доступ к закрытым проектам',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)) // 2 дня назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Вопросы по проекту',
        status: 'COMPLETED' as const,
        fullName: 'Петров Алексей Владимирович',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (922) 345-67-89',
        comments: 'Требуется консультация по оформлению документов',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)) // 5 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'BUYER' as const,
        topic: 'Заявка на размещение',
        status: 'REJECTED' as const,
        fullName: 'Козлов Дмитрий Андреевич',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (933) 456-78-90',
        comments: 'Не прошли требования по безопасности',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 7)) // 7 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Запрос доступа',
        status: 'NEW' as const,
        fullName: 'Соколова Екатерина Михайловна',
        organizationName: 'ЗАО "ИнвестСтрой"',
        cnum: '345678',
        login: 'sokolova_em',
        phone: '+7 (944) 567-89-01',
        comments: 'Требуется расширенный доступ',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) // 1 день назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'BUYER' as const,
        topic: 'Вопросы по проекту',
        status: 'IN_PROGRESS' as const,
        fullName: 'Морозов Сергей Александрович',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (955) 678-90-12',
        comments: 'Необходима встреча для обсуждения деталей',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4)) // 4 дня назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Заявка на размещение',
        status: 'COMPLETED' as const,
        fullName: 'Волкова Ольга Дмитриевна',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (966) 789-01-23',
        comments: 'Проект успешно размещен',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 6)) // 6 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'BUYER' as const,
        topic: 'Запрос доступа',
        status: 'REJECTED' as const,
        fullName: 'Зайцев Игорь Петрович',
        organizationName: 'ООО "АгроПром"',
        cnum: '456789',
        login: 'zaitsev_ip',
        phone: '+7 (977) 890-12-34',
        comments: 'Отклонено из-за подозрительной активности',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 9)) // 9 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Вопросы по проекту',
        status: 'NEW' as const,
        fullName: 'Лебедева Наталья Сергеевна',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (988) 901-23-45',
        comments: 'Нужна помощь с юридическими вопросами',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) // 3 дня назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'BUYER' as const,
        topic: 'Заявка на размещение',
        status: 'IN_PROGRESS' as const,
        fullName: 'Семенов Виктор Александрович',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (999) 012-34-56',
        comments: 'В процессе подготовки документов',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 8)) // 8 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Запрос доступа',
        status: 'COMPLETED' as const,
        fullName: 'Егорова Марина Владимировна',
        organizationName: 'ПАО "ФинансГрупп"',
        cnum: '567890',
        login: 'egorova_mv',
        phone: '+7 (900) 234-56-78',
        comments: 'Доступ предоставлен',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 12)) // 12 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'BUYER' as const,
        topic: 'Вопросы по проекту',
        status: 'REJECTED' as const,
        fullName: 'Павлов Андрей Игоревич',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (911) 345-67-89',
        comments: 'Вопрос не относится к компетенции платформы',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 14)) // 14 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Заявка на размещение',
        status: 'NEW' as const,
        fullName: 'Никитина Юлия Дмитриевна',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (922) 456-78-90',
        comments: 'Первичное размещение проекта',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 0.5)) // сегодня (12 часов назад)
      },
      {
        id: this.requestCurrentId++,
        userType: 'BUYER' as const,
        topic: 'Запрос доступа',
        status: 'IN_PROGRESS' as const,
        fullName: 'Орлов Станислав Олегович',
        organizationName: 'ООО "ИнТрейд"',
        cnum: '678901',
        login: 'orlov_so',
        phone: '+7 (933) 567-89-01',
        comments: 'Проверка документов',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)) // 20 дней назад
      },
      {
        id: this.requestCurrentId++,
        userType: 'SELLER' as const,
        topic: 'Вопросы по проекту',
        status: 'COMPLETED' as const,
        fullName: 'Крылова Елена Алексеевна',
        organizationName: null,
        cnum: null,
        login: null,
        phone: '+7 (944) 678-90-12',
        comments: 'Все вопросы решены',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 25)) // 25 дней назад
      }
    ];
    
    // Установка времени (часы, минуты) для запросов
    for (let i = 0; i < requests.length; i++) {
      requests[i].createdAt.setHours(
        8 + Math.floor(Math.random() * 10), // от 8 до 18 часов
        Math.floor(Math.random() * 60), // от 0 до 59 минут
        0
      );
    }
    
    // Добавляем запросы в хранилище
    for (const request of requests) {
      this.requests.set(request.id, request);
    }
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
    const user: User = { 
      ...insertUser, 
      id, 
      lastAccess: now,
      phone: insertUser.phone || null,
      comments: insertUser.comments || null
    };
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
    
    // Создаем проект с правильными типами полей
    const project: Project = {
      id, 
      name: insertProject.name,
      industry: insertProject.industry,
      dealType: insertProject.dealType,
      createdAt: now,
      isVisible: insertProject.isVisible !== undefined ? insertProject.isVisible : true,
      isCompleted: insertProject.isCompleted !== undefined ? insertProject.isCompleted : false,
      contactName1: insertProject.contactName1 || null,
      contactPhone1: insertProject.contactPhone1 || null,
      contactPosition1: insertProject.contactPosition1 || null,
      contactPhone2: insertProject.contactPhone2 || null,
      inn: insertProject.inn || null,
      location: insertProject.location || null,
      revenue: insertProject.revenue || null,
      ebitda: insertProject.ebitda || null,
      price: insertProject.price || null,
      salePercent: insertProject.salePercent || null,
      website: insertProject.website || null,
      hideUntilNda: insertProject.hideUntilNda !== undefined ? insertProject.hideUntilNda : false,
      comments: insertProject.comments || null
    };
    
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
    const request: Request = { 
      ...insertRequest, 
      id, 
      createdAt: now,
      status: insertRequest.status || 'NEW',
      organizationName: insertRequest.organizationName || null,
      cnum: insertRequest.cnum || null,
      login: insertRequest.login || null,
      phone: insertRequest.phone || null,
      comments: insertRequest.comments || null
    };
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
