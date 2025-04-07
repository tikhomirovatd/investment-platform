package com.banking.api.routes

import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.request.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.banking.api.database.*
import com.banking.api.models.*
import java.time.LocalDateTime

fun Application.registerRoutes() {
    routing {
        // Корневой путь для API
        route("/api") {
            // Маршруты для пользователей
            userRoutes()
            
            // Маршруты для проектов
            projectRoutes()
            
            // Маршруты для запросов
            requestRoutes()
        }
    }
}

private fun Route.userRoutes() {
    route("/users") {
        // Получение всех пользователей
        get {
            val users = transaction {
                Users.selectAll().map { row ->
                    User(
                        id = row[Users.id],
                        userType = row[Users.userType],
                        username = row[Users.username],
                        organizationName = row[Users.organizationName],
                        fullName = row[Users.fullName],
                        phone = row[Users.phone],
                        lastAccess = row[Users.lastAccess]?.toISOString(),
                        comments = row[Users.comments]
                    )
                }
            }
            call.respond(users)
        }
        
        // Получение пользователя по ID
        get("{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Invalid user ID"))
                return@get
            }
            
            val user = transaction {
                Users.select { Users.id eq id }.map { row ->
                    User(
                        id = row[Users.id],
                        userType = row[Users.userType],
                        username = row[Users.username],
                        organizationName = row[Users.organizationName],
                        fullName = row[Users.fullName],
                        phone = row[Users.phone],
                        lastAccess = row[Users.lastAccess]?.toISOString(),
                        comments = row[Users.comments]
                    )
                }.singleOrNull()
            }
            
            if (user != null) {
                call.respond(user)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "User not found"))
            }
        }
        
        // Создание нового пользователя
        post {
            val insertUser = call.receive<InsertUser>()
            
            val newUser = transaction {
                val id = Users.insert {
                    it[userType] = insertUser.userType
                    it[username] = insertUser.username
                    it[organizationName] = insertUser.organizationName
                    it[fullName] = insertUser.fullName
                    it[phone] = insertUser.phone
                    it[lastAccess] = LocalDateTime.now()
                    it[comments] = insertUser.comments
                } get Users.id
                
                User(
                    id = id,
                    userType = insertUser.userType,
                    username = insertUser.username,
                    organizationName = insertUser.organizationName,
                    fullName = insertUser.fullName,
                    phone = insertUser.phone,
                    lastAccess = LocalDateTime.now().toISOString(),
                    comments = insertUser.comments
                )
            }
            
            call.respond(HttpStatusCode.Created, newUser)
        }
    }
}

private fun Route.projectRoutes() {
    route("/projects") {
        // Получение всех проектов
        get {
            val isCompletedParam = call.request.queryParameters["isCompleted"]
            val isCompleted = when (isCompletedParam) {
                "true" -> true
                "false" -> false
                else -> null
            }
            
            val projects = transaction {
                val query = if (isCompleted != null) {
                    Projects.select { Projects.isCompleted eq isCompleted }
                } else {
                    Projects.selectAll()
                }
                
                query.map { row ->
                    Project(
                        id = row[Projects.id],
                        name = row[Projects.name],
                        dealType = row[Projects.dealType],
                        industry = row[Projects.industry],
                        createdAt = row[Projects.createdAt].toISOString(),
                        isVisible = row[Projects.isVisible],
                        isCompleted = row[Projects.isCompleted]
                    )
                }
            }
            
            call.respond(projects)
        }
        
        // Получение проекта по ID
        get("{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Invalid project ID"))
                return@get
            }
            
            val project = transaction {
                Projects.select { Projects.id eq id }.map { row ->
                    Project(
                        id = row[Projects.id],
                        name = row[Projects.name],
                        dealType = row[Projects.dealType],
                        industry = row[Projects.industry],
                        createdAt = row[Projects.createdAt].toISOString(),
                        isVisible = row[Projects.isVisible],
                        isCompleted = row[Projects.isCompleted]
                    )
                }.singleOrNull()
            }
            
            if (project != null) {
                call.respond(project)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Project not found"))
            }
        }
        
        // Создание нового проекта
        post {
            val insertProject = call.receive<InsertProject>()
            
            val newProject = transaction {
                val id = Projects.insert {
                    it[name] = insertProject.name
                    it[dealType] = insertProject.dealType
                    it[industry] = insertProject.industry
                    it[createdAt] = LocalDateTime.now()
                    it[isVisible] = insertProject.isVisible
                    it[isCompleted] = insertProject.isCompleted
                } get Projects.id
                
                Project(
                    id = id,
                    name = insertProject.name,
                    dealType = insertProject.dealType,
                    industry = insertProject.industry,
                    createdAt = LocalDateTime.now().toISOString(),
                    isVisible = insertProject.isVisible,
                    isCompleted = insertProject.isCompleted
                )
            }
            
            call.respond(HttpStatusCode.Created, newProject)
        }
        
        // Обновление проекта
        patch("{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Invalid project ID"))
                return@patch
            }
            
            val updateData = call.receive<Map<String, Any>>()
            
            var updatedProject: Project? = null
            
            transaction {
                val exists = Projects.select { Projects.id eq id }.count() > 0
                if (!exists) {
                    return@transaction
                }
                
                val update = Projects.update({ Projects.id eq id }) { statement ->
                    updateData["name"]?.let { statement[name] = it.toString() }
                    updateData["industry"]?.let { statement[industry] = it.toString() }
                    updateData["dealType"]?.let { 
                        val dealTypeStr = it.toString()
                        try {
                            statement[dealType] = DealType.valueOf(dealTypeStr)
                        } catch (e: IllegalArgumentException) {
                            // Игнорируем неверные значения
                        }
                    }
                    updateData["isVisible"]?.let { statement[isVisible] = it.toString().toBoolean() }
                    updateData["isCompleted"]?.let { statement[isCompleted] = it.toString().toBoolean() }
                }
                
                if (update > 0) {
                    updatedProject = Projects.select { Projects.id eq id }.map { row ->
                        Project(
                            id = row[Projects.id],
                            name = row[Projects.name],
                            dealType = row[Projects.dealType],
                            industry = row[Projects.industry],
                            createdAt = row[Projects.createdAt].toISOString(),
                            isVisible = row[Projects.isVisible],
                            isCompleted = row[Projects.isCompleted]
                        )
                    }.single()
                }
            }
            
            if (updatedProject != null) {
                call.respond(updatedProject)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Project not found"))
            }
        }
        
        // Удаление проекта
        delete("{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Invalid project ID"))
                return@delete
            }
            
            val deleted = transaction {
                val exists = Projects.select { Projects.id eq id }.count() > 0
                if (!exists) {
                    return@transaction false
                }
                
                Projects.deleteWhere { Projects.id eq id } > 0
            }
            
            if (deleted) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Project not found"))
            }
        }
    }
}

private fun Route.requestRoutes() {
    route("/requests") {
        // Получение всех запросов
        get {
            val requests = transaction {
                Requests.selectAll().map { row ->
                    Request(
                        id = row[Requests.id],
                        userType = row[Requests.userType],
                        topic = row[Requests.topic],
                        createdAt = row[Requests.createdAt].toISOString(),
                        status = row[Requests.status],
                        fullName = row[Requests.fullName],
                        organizationName = row[Requests.organizationName],
                        cnum = row[Requests.cnum],
                        login = row[Requests.login],
                        phone = row[Requests.phone],
                        comments = row[Requests.comments]
                    )
                }
            }
            call.respond(requests)
        }
        
        // Получение запроса по ID
        get("{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Invalid request ID"))
                return@get
            }
            
            val request = transaction {
                Requests.select { Requests.id eq id }.map { row ->
                    Request(
                        id = row[Requests.id],
                        userType = row[Requests.userType],
                        topic = row[Requests.topic],
                        createdAt = row[Requests.createdAt].toISOString(),
                        status = row[Requests.status],
                        fullName = row[Requests.fullName],
                        organizationName = row[Requests.organizationName],
                        cnum = row[Requests.cnum],
                        login = row[Requests.login],
                        phone = row[Requests.phone],
                        comments = row[Requests.comments]
                    )
                }.singleOrNull()
            }
            
            if (request != null) {
                call.respond(request)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Request not found"))
            }
        }
        
        // Создание нового запроса
        post {
            val insertRequest = call.receive<InsertRequest>()
            
            val newRequest = transaction {
                val id = Requests.insert {
                    it[userType] = insertRequest.userType
                    it[topic] = insertRequest.topic
                    it[createdAt] = LocalDateTime.now()
                    it[status] = insertRequest.status
                    it[fullName] = insertRequest.fullName
                    it[organizationName] = insertRequest.organizationName
                    it[cnum] = insertRequest.cnum
                    it[login] = insertRequest.login
                    it[phone] = insertRequest.phone
                    it[comments] = insertRequest.comments
                } get Requests.id
                
                Request(
                    id = id,
                    userType = insertRequest.userType,
                    topic = insertRequest.topic,
                    createdAt = LocalDateTime.now().toISOString(),
                    status = insertRequest.status,
                    fullName = insertRequest.fullName,
                    organizationName = insertRequest.organizationName,
                    cnum = insertRequest.cnum,
                    login = insertRequest.login,
                    phone = insertRequest.phone,
                    comments = insertRequest.comments
                )
            }
            
            call.respond(HttpStatusCode.Created, newRequest)
        }
        
        // Обновление запроса
        patch("{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Invalid request ID"))
                return@patch
            }
            
            val updateData = call.receive<Map<String, Any>>()
            
            var updatedRequest: Request? = null
            
            transaction {
                val exists = Requests.select { Requests.id eq id }.count() > 0
                if (!exists) {
                    return@transaction
                }
                
                val update = Requests.update({ Requests.id eq id }) { statement ->
                    updateData["topic"]?.let { statement[topic] = it.toString() }
                    updateData["userType"]?.let { 
                        val userTypeStr = it.toString()
                        try {
                            statement[userType] = UserType.valueOf(userTypeStr)
                        } catch (e: IllegalArgumentException) {
                            // Игнорируем неверные значения
                        }
                    }
                    updateData["status"]?.let { 
                        val statusStr = it.toString()
                        try {
                            statement[status] = RequestStatus.valueOf(statusStr)
                        } catch (e: IllegalArgumentException) {
                            // Игнорируем неверные значения
                        }
                    }
                    updateData["fullName"]?.let { statement[fullName] = it.toString() }
                    updateData["organizationName"]?.let { statement[organizationName] = it.toString() }
                    updateData["cnum"]?.let { statement[cnum] = it.toString() }
                    updateData["login"]?.let { statement[login] = it.toString() }
                    updateData["phone"]?.let { statement[phone] = it.toString() }
                    updateData["comments"]?.let { statement[comments] = it.toString() }
                }
                
                if (update > 0) {
                    updatedRequest = Requests.select { Requests.id eq id }.map { row ->
                        Request(
                            id = row[Requests.id],
                            userType = row[Requests.userType],
                            topic = row[Requests.topic],
                            createdAt = row[Requests.createdAt].toISOString(),
                            status = row[Requests.status],
                            fullName = row[Requests.fullName],
                            organizationName = row[Requests.organizationName],
                            cnum = row[Requests.cnum],
                            login = row[Requests.login],
                            phone = row[Requests.phone],
                            comments = row[Requests.comments]
                        )
                    }.single()
                }
            }
            
            if (updatedRequest != null) {
                call.respond(updatedRequest)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("message" to "Request not found"))
            }
        }
    }
}
