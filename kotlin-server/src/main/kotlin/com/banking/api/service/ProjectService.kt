package com.banking.api.service

import com.banking.api.dto.CreateProjectDto
import com.banking.api.dto.ProjectResponseDto
import com.banking.api.dto.UpdateProjectDto
import com.banking.api.exception.ResourceNotFoundException
import com.banking.api.model.DealType
import com.banking.api.model.Project
import com.banking.api.repository.ProjectRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ProjectService(private val projectRepository: ProjectRepository) {

    fun getAllProjects(): List<ProjectResponseDto> {
        return projectRepository.findAll().map { ProjectResponseDto.fromEntity(it) }
    }

    fun getProjectById(id: Long): ProjectResponseDto {
        val project = projectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Project not found with id: $id") }
        return ProjectResponseDto.fromEntity(project)
    }

    fun getProjectsByCompletionStatus(isCompleted: Boolean): List<ProjectResponseDto> {
        return projectRepository.findByIsCompleted(isCompleted)
            .map { ProjectResponseDto.fromEntity(it) }
    }

    fun getVisibleProjects(isCompleted: Boolean): List<ProjectResponseDto> {
        return projectRepository.findByIsCompletedAndIsVisible(isCompleted, true)
            .map { ProjectResponseDto.fromEntity(it) }
    }

    @Transactional
    fun createProject(createProjectDto: CreateProjectDto): ProjectResponseDto {
        val project = Project(
            name = createProjectDto.name,
            dealType = createProjectDto.dealType,
            industry = createProjectDto.industry,
            createdAt = LocalDateTime.now(),
            isVisible = createProjectDto.isVisible,
            isCompleted = createProjectDto.isCompleted
        )

        val savedProject = projectRepository.save(project)
        return ProjectResponseDto.fromEntity(savedProject)
    }

    @Transactional
    fun updateProject(id: Long, updateProjectDto: UpdateProjectDto): ProjectResponseDto {
        val existingProject = projectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Project not found with id: $id") }

        val updatedProject = existingProject.copy(
            name = updateProjectDto.name ?: existingProject.name,
            dealType = updateProjectDto.dealType ?: existingProject.dealType,
            industry = updateProjectDto.industry ?: existingProject.industry,
            isVisible = updateProjectDto.isVisible ?: existingProject.isVisible,
            isCompleted = updateProjectDto.isCompleted ?: existingProject.isCompleted
        )

        val savedProject = projectRepository.save(updatedProject)
        return ProjectResponseDto.fromEntity(savedProject)
    }

    @Transactional
    fun deleteProject(id: Long) {
        if (!projectRepository.existsById(id)) {
            throw ResourceNotFoundException("Project not found with id: $id")
        }
        projectRepository.deleteById(id)
    }

    fun searchProjects(search: String?, dealType: DealType?, industry: String?, isCompleted: Boolean?): List<ProjectResponseDto> {
        // Если параметры поиска не указаны, возвращаем все проекты
        if (search.isNullOrBlank() && dealType == null && industry.isNullOrBlank() && isCompleted == null) {
            return getAllProjects()
        }

        var results = listOf<Project>()

        // Поиск по названию, если указано
        if (!search.isNullOrBlank()) {
            results = projectRepository.findByNameContainingIgnoreCase(search)
        } else {
            results = projectRepository.findAll()
        }

        // Фильтрация по типу сделки, если указан
        if (dealType != null) {
            results = results.filter { it.dealType == dealType }
        }

        // Фильтрация по отрасли, если указана
        if (!industry.isNullOrBlank()) {
            val industryProjects = projectRepository.findByIndustryContainingIgnoreCase(industry)
            results = results.filter { project -> industryProjects.any { it.id == project.id } }
        }

        // Фильтрация по статусу завершения, если указан
        if (isCompleted != null) {
            results = results.filter { it.isCompleted == isCompleted }
        }

        return results.map { ProjectResponseDto.fromEntity(it) }
    }

    @Transactional
    fun toggleProjectVisibility(id: Long): ProjectResponseDto {
        val project = projectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Project not found with id: $id") }

        val updatedProject = project.copy(isVisible = !project.isVisible)
        val savedProject = projectRepository.save(updatedProject)
        return ProjectResponseDto.fromEntity(savedProject)
    }

    @Transactional
    fun toggleProjectCompletion(id: Long): ProjectResponseDto {
        val project = projectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Project not found with id: $id") }

        val updatedProject = project.copy(isCompleted = !project.isCompleted)
        val savedProject = projectRepository.save(updatedProject)
        return ProjectResponseDto.fromEntity(savedProject)
    }
}
