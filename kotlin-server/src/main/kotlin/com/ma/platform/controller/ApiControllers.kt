package com.ma.platform.controller

import com.ma.platform.model.*
import com.ma.platform.service.StorageService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class ApiController(private val storageService: StorageService) {
    
    // Обработка пользователей
    @GetMapping("/users")
    fun getUsers(): ResponseEntity<List<User>> {
        return ResponseEntity.ok(storageService.getUsers())
    }
    
    @GetMapping("/users/{id}")
    fun getUser(@PathVariable id: Int): ResponseEntity<User> {
        val user = storageService.getUser(id) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(user)
    }
    
    @PostMapping("/users")
    fun createUser(@RequestBody userDTO: UserDTO): ResponseEntity<User> {
        val newUser = storageService.createUser(userDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser)
    }
    
    // Обработка проектов
    @GetMapping("/projects")
    fun getProjects(
        @RequestParam(required = false) isCompleted: Boolean?
    ): ResponseEntity<List<Project>> {
        return ResponseEntity.ok(storageService.getProjects(isCompleted))
    }
    
    @GetMapping("/projects/{id}")
    fun getProject(@PathVariable id: Int): ResponseEntity<Project> {
        val project = storageService.getProject(id) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(project)
    }
    
    @PostMapping("/projects")
    fun createProject(@RequestBody projectDTO: ProjectDTO): ResponseEntity<Project> {
        val newProject = storageService.createProject(projectDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(newProject)
    }
    
    @PatchMapping("/projects/{id}")
    fun updateProject(
        @PathVariable id: Int, 
        @RequestBody data: Map<String, Any>
    ): ResponseEntity<Project> {
        val updatedProject = storageService.updateProject(id, data) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(updatedProject)
    }
    
    @DeleteMapping("/projects/{id}")
    fun deleteProject(@PathVariable id: Int): ResponseEntity<Void> {
        val success = storageService.deleteProject(id)
        return if (success) ResponseEntity.noContent().build() else ResponseEntity.notFound().build()
    }
    
    // Обработка заявок
    @GetMapping("/requests")
    fun getRequests(): ResponseEntity<List<Request>> {
        return ResponseEntity.ok(storageService.getRequests())
    }
    
    @GetMapping("/requests/{id}")
    fun getRequest(@PathVariable id: Int): ResponseEntity<Request> {
        val request = storageService.getRequest(id) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(request)
    }
    
    @PostMapping("/requests")
    fun createRequest(@RequestBody requestDTO: RequestDTO): ResponseEntity<Request> {
        val newRequest = storageService.createRequest(requestDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(newRequest)
    }
    
    @PatchMapping("/requests/{id}")
    fun updateRequest(
        @PathVariable id: Int, 
        @RequestBody data: Map<String, Any>
    ): ResponseEntity<Request> {
        val updatedRequest = storageService.updateRequest(id, data) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(updatedRequest)
    }
}
