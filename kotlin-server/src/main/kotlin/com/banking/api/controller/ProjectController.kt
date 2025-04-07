package com.banking.api.controller

import com.banking.api.dto.CreateProjectDto
import com.banking.api.dto.ProjectResponseDto
import com.banking.api.dto.UpdateProjectDto
import com.banking.api.model.DealType
import com.banking.api.service.ProjectService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "API for project management")
class ProjectController(private val projectService: ProjectService) {

    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieve a list of all projects with optional filters")
    fun getAllProjects(
        @RequestParam search: String?,
        @RequestParam dealType: DealType?,
        @RequestParam industry: String?,
        @RequestParam isCompleted: Boolean?
    ): ResponseEntity<List<ProjectResponseDto>> {
        val projects = projectService.searchProjects(search, dealType, industry, isCompleted)
        return ResponseEntity.ok(projects)
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieve a specific project by its ID")
    fun getProjectById(@PathVariable id: Long): ResponseEntity<ProjectResponseDto> {
        val project = projectService.getProjectById(id)
        return ResponseEntity.ok(project)
    }

    @GetMapping("/completed")
    @Operation(summary = "Get completed projects", description = "Retrieve all completed projects")
    fun getCompletedProjects(): ResponseEntity<List<ProjectResponseDto>> {
        val projects = projectService.getProjectsByCompletionStatus(true)
        return ResponseEntity.ok(projects)
    }

    @GetMapping("/active")
    @Operation(summary = "Get active projects", description = "Retrieve all active (not completed) projects")
    fun getActiveProjects(): ResponseEntity<List<ProjectResponseDto>> {
        val projects = projectService.getProjectsByCompletionStatus(false)
        return ResponseEntity.ok(projects)
    }

    @GetMapping("/visible")
    @Operation(summary = "Get visible projects", description = "Retrieve all visible projects with completion status")
    fun getVisibleProjects(@RequestParam isCompleted: Boolean): ResponseEntity<List<ProjectResponseDto>> {
        val projects = projectService.getVisibleProjects(isCompleted)
        return ResponseEntity.ok(projects)
    }

    @PostMapping
    @Operation(summary = "Create a new project", description = "Create a new project with the provided information")
    fun createProject(@Valid @RequestBody createProjectDto: CreateProjectDto): ResponseEntity<ProjectResponseDto> {
        val createdProject = projectService.createProject(createProjectDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject)
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project", description = "Update an existing project's information")
    fun updateProject(
        @PathVariable id: Long,
        @Valid @RequestBody updateProjectDto: UpdateProjectDto
    ): ResponseEntity<ProjectResponseDto> {
        val updatedProject = projectService.updateProject(id, updateProjectDto)
        return ResponseEntity.ok(updatedProject)
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project", description = "Delete a project by its ID")
    fun deleteProject(@PathVariable id: Long): ResponseEntity<Void> {
        projectService.deleteProject(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}/toggle-visibility")
    @Operation(summary = "Toggle project visibility", description = "Toggle the visibility of a project")
    fun toggleProjectVisibility(@PathVariable id: Long): ResponseEntity<ProjectResponseDto> {
        val updatedProject = projectService.toggleProjectVisibility(id)
        return ResponseEntity.ok(updatedProject)
    }

    @PutMapping("/{id}/toggle-completion")
    @Operation(summary = "Toggle project completion", description = "Toggle the completion status of a project")
    fun toggleProjectCompletion(@PathVariable id: Long): ResponseEntity<ProjectResponseDto> {
        val updatedProject = projectService.toggleProjectCompletion(id)
        return ResponseEntity.ok(updatedProject)
    }
}
