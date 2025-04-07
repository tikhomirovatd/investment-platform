package com.ma.platform.service

import com.ma.platform.model.*
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

interface StorageService {
    // User operations
    fun getUsers(): List<User>
    fun getUser(id: Int): User?
    fun getUserByUsername(username: String): User?
    fun createUser(user: UserDTO): User
    
    // Project operations
    fun getProjects(isCompleted: Boolean? = null): List<Project>
    fun getProject(id: Int): Project?
    fun createProject(project: ProjectDTO): Project
    fun updateProject(id: Int, data: Map<String, Any>): Project?
    fun deleteProject(id: Int): Boolean
    
    // Request operations
    fun getRequests(): List<Request>
    fun getRequest(id: Int): Request?
    fun createRequest(request: RequestDTO): Request
    fun updateRequest(id: Int, data: Map<String, Any>): Request?
}

@Service
class MemoryStorageService : StorageService {
    private val users = ConcurrentHashMap<Int, User>()
    private val projects = ConcurrentHashMap<Int, Project>()
    private val requests = ConcurrentHashMap<Int, Request>()
    
    private val userIdGenerator = AtomicInteger(0)
    private val projectIdGenerator = AtomicInteger(0)
    private val requestIdGenerator = AtomicInteger(0)
    
    init {
        initializeData()
    }
    
    private fun initializeData() {
        // Создание нескольких пользователей
        val user1 = User(
            id = userIdGenerator.incrementAndGet(),
            userType = UserType.SELLER,
            username = "seller1",
            organizationName = "ООО Продавец",
            fullName = "Иванов Иван",
            phone = "+7 (999) 123-4567",
            lastAccess = LocalDateTime.now().minusDays(1),
            comments = "Активный продавец"
        )
        
        val user2 = User(
            id = userIdGenerator.incrementAndGet(),
            userType = UserType.BUYER,
            username = "buyer1",
            organizationName = "ЗАО Покупатель",
            fullName = "Петров Петр",
            phone = "+7 (999) 765-4321",
            lastAccess = LocalDateTime.now().minusHours(5),
            comments = "Крупный инвестор"
        )
        
        users[user1.id] = user1
        users[user2.id] = user2
        
        // Создание нескольких проектов
        val project1 = Project(
            id = projectIdGenerator.incrementAndGet(),
            name = "Продажа IT-компании",
            dealType = DealType.SALE,
            industry = "IT",
            createdAt = LocalDateTime.now().minusDays(30),
            isVisible = true,
            isCompleted = false
        )
        
        val project2 = Project(
            id = projectIdGenerator.incrementAndGet(),
            name = "Инвестиции в стартап",
            dealType = DealType.INVESTMENT,
            industry = "Финтех",
            createdAt = LocalDateTime.now().minusDays(15),
            isVisible = true,
            isCompleted = false
        )
        
        val project3 = Project(
            id = projectIdGenerator.incrementAndGet(),
            name = "Продажа сети ресторанов",
            dealType = DealType.SALE,
            industry = "Общественное питание",
            createdAt = LocalDateTime.now().minusDays(60),
            isVisible = false,
            isCompleted = true
        )
        
        projects[project1.id] = project1
        projects[project2.id] = project2
        projects[project3.id] = project3
        
        // Создание нескольких заявок
        val request1 = Request(
            id = requestIdGenerator.incrementAndGet(),
            userType = UserType.SELLER,
            topic = "Заявка на продажу бизнеса",
            createdAt = LocalDateTime.now().minusDays(5),
            status = RequestStatus.NEW,
            fullName = "Сидоров Сидор",
            organizationName = "ИП Сидоров",
            phone = "+7 (999) 111-2233",
            comments = "Хочу продать свой бизнес"
        )
        
        val request2 = Request(
            id = requestIdGenerator.incrementAndGet(),
            userType = UserType.BUYER,
            topic = "Заявка на инвестирование",
            createdAt = LocalDateTime.now().minusDays(3),
            status = RequestStatus.IN_PROGRESS,
            fullName = "Алексеев Алексей",
            organizationName = "Инвест Групп",
            phone = "+7 (999) 444-5566",
            comments = "Ищем объекты для инвестирования"
        )
        
        requests[request1.id] = request1
        requests[request2.id] = request2
    }
    
    override fun getUsers(): List<User> {
        return users.values.toList()
    }
    
    override fun getUser(id: Int): User? {
        return users[id]
    }
    
    override fun getUserByUsername(username: String): User? {
        return users.values.find { it.username == username }
    }
    
    override fun createUser(user: UserDTO): User {
        val id = userIdGenerator.incrementAndGet()
        val newUser = User(
            id = id,
            userType = user.userType,
            username = user.username,
            organizationName = user.organizationName,
            fullName = user.fullName,
            phone = user.phone,
            lastAccess = LocalDateTime.now(),
            comments = user.comments
        )
        users[id] = newUser
        return newUser
    }
    
    override fun getProjects(isCompleted: Boolean?): List<Project> {
        return projects.values.toList().let { projectList ->
            isCompleted?.let { completed ->
                projectList.filter { it.isCompleted == completed }
            } ?: projectList
        }
    }
    
    override fun getProject(id: Int): Project? {
        return projects[id]
    }
    
    override fun createProject(project: ProjectDTO): Project {
        val id = projectIdGenerator.incrementAndGet()
        val newProject = Project(
            id = id,
            name = project.name,
            dealType = project.dealType,
            industry = project.industry,
            createdAt = LocalDateTime.now(),
            isVisible = project.isVisible,
            isCompleted = project.isCompleted
        )
        projects[id] = newProject
        return newProject
    }
    
    override fun updateProject(id: Int, data: Map<String, Any>): Project? {
        val existingProject = projects[id] ?: return null
        
        val updatedProject = existingProject.copy(
            name = data["name"]?.toString() ?: existingProject.name,
            dealType = data["dealType"]?.let { DealType.valueOf(it.toString()) } ?: existingProject.dealType,
            industry = data["industry"]?.toString() ?: existingProject.industry,
            isVisible = data["isVisible"]?.toString()?.toBoolean() ?: existingProject.isVisible,
            isCompleted = data["isCompleted"]?.toString()?.toBoolean() ?: existingProject.isCompleted
        )
        
        projects[id] = updatedProject
        return updatedProject
    }
    
    override fun deleteProject(id: Int): Boolean {
        return projects.remove(id) != null
    }
    
    override fun getRequests(): List<Request> {
        return requests.values.toList()
    }
    
    override fun getRequest(id: Int): Request? {
        return requests[id]
    }
    
    override fun createRequest(request: RequestDTO): Request {
        val id = requestIdGenerator.incrementAndGet()
        val newRequest = Request(
            id = id,
            userType = request.userType,
            topic = request.topic,
            createdAt = LocalDateTime.now(),
            status = request.status,
            fullName = request.fullName,
            organizationName = request.organizationName,
            cnum = request.cnum,
            login = request.login,
            phone = request.phone,
            comments = request.comments
        )
        requests[id] = newRequest
        return newRequest
    }
    
    override fun updateRequest(id: Int, data: Map<String, Any>): Request? {
        val existingRequest = requests[id] ?: return null
        
        val updatedRequest = existingRequest.copy(
            status = data["status"]?.let { RequestStatus.valueOf(it.toString()) } ?: existingRequest.status,
            fullName = data["fullName"]?.toString() ?: existingRequest.fullName,
            organizationName = data["organizationName"]?.toString() ?: existingRequest.organizationName,
            cnum = data["cnum"]?.toString() ?: existingRequest.cnum,
            login = data["login"]?.toString() ?: existingRequest.login,
            phone = data["phone"]?.toString() ?: existingRequest.phone,
            comments = data["comments"]?.toString() ?: existingRequest.comments
        )
        
        requests[id] = updatedRequest
        return updatedRequest
    }
}
