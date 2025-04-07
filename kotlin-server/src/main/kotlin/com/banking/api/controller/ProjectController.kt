package com.banking.api.controller

import com.banking.api.dto.CreateProjectDTO
import com.banking.api.dto.ProjectDTO
import com.banking.api.dto.UpdateProjectDTO
import com.banking.api.service.ProjectService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for Project operations
 */
@RestController
@RequestMapping("/api/projects")
class ProjectController(private val projectService: ProjectService) {

    /**
     * Get all projects, optionally filtered by completion status
     */
    @GetMapping
    fun getAllProjects(@RequestParam isCompleted: Boolean? = null): ResponseEntity<List<ProjectDTO>> {
        return ResponseEntity.ok(projectService.getAllProjects(isCompleted))
    }

    /**
     * Get project by ID
     */
    @GetMapping("/{id}")
    fun getProjectById(@PathVariable id: Long): ResponseEntity<ProjectDTO> {
        val project = projectService.getProjectById(id)
        return if (project != null) {
            ResponseEntity.ok(project)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    /**
     * Create a new project
     */
    @PostMapping
    fun createProject(@Valid @RequestBody createProjectDTO: CreateProjectDTO): ResponseEntity<ProjectDTO> {
        val newProject = projectService.createProject(createProjectDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(newProject)
    }

    /**
     * Update an existing project
     */
    @PutMapping("/{id}")
    fun updateProject(
        @PathVariable id: Long,
        @Valid @RequestBody updateProjectDTO: UpdateProjectDTO
    ): ResponseEntity<ProjectDTO> {
        val updatedProject = projectService.updateProject(id, updateProjectDTO)
        return if (updatedProject != null) {
            ResponseEntity.ok(updatedProject)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    /**
     * Delete a project
     */
    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable id: Long): ResponseEntity<Void> {
        val deleted = projectService.deleteProject(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
