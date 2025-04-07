package com.banking.api.service

import com.banking.api.dto.CreateProjectRequest
import com.banking.api.dto.ProjectResponse
import com.banking.api.dto.UpdateProjectRequest
import com.banking.api.exception.ResourceNotFoundException
import com.banking.api.model.DealType
import com.banking.api.model.Project
import com.banking.api.repository.ProjectRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Сервис для работы с проектами
 */
@Service
class ProjectService(private val projectRepository: ProjectRepository) {

    /**
     * Получить все проекты
     */
    fun getAllProjects(): List<ProjectResponse> {
        return projectRepository.findAll().map { ProjectResponse.fromEntity(it) }
    }

    /**
     * Получить проекты по статусу завершения
     */
    fun getProjectsByCompletionStatus(isCompleted: Boolean): List<ProjectResponse> {
        return projectRepository.findByIsCompleted(isCompleted).map { ProjectResponse.fromEntity(it) }
    }

    /**
     * Получить проект по ID
     */
    fun getProjectById(id: Long): ProjectResponse {
        val project = projectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Проект с ID $id не найден") }
        return ProjectResponse.fromEntity(project)
    }

    /**
     * Фильтрация проектов
     */
    fun filterProjects(search: String?, industry: String?, dealType: DealType?, isCompleted: Boolean?): List<ProjectResponse> {
        val initialProjects = isCompleted?.let { 
            projectRepository.findByIsCompleted(it)
        } ?: projectRepository.findAll()
        
        val projects = initialProjects.filter { project ->
            val matchesSearch = search.isNullOrBlank() || 
                project.name.contains(search, ignoreCase = true) ||
                project.industry.contains(search, ignoreCase = true)
            
            val matchesIndustry = industry.isNullOrBlank() ||
                project.industry.contains(industry, ignoreCase = true)
            
            val matchesDealType = dealType == null || project.dealType == dealType
            
            matchesSearch && matchesIndustry && matchesDealType
        }
        
        return projects.map { ProjectResponse.fromEntity(it) }
    }

    /**
     * Создать новый проект
     */
    @Transactional
    fun createProject(projectRequest: CreateProjectRequest): ProjectResponse {
        val project = Project(
            name = projectRequest.name,
            dealType = projectRequest.dealType,
            industry = projectRequest.industry,
            isVisible = projectRequest.isVisible,
            isCompleted = projectRequest.isCompleted,
            contactName1 = projectRequest.contactName1,
            contactPhone1 = projectRequest.contactPhone1,
            contactPosition1 = projectRequest.contactPosition1,
            contactPhone2 = projectRequest.contactPhone2,
            inn = projectRequest.inn,
            location = projectRequest.location,
            revenue = projectRequest.revenue,
            ebitda = projectRequest.ebitda,
            price = projectRequest.price,
            salePercent = projectRequest.salePercent,
            website = projectRequest.website,
            hideUntilNda = projectRequest.hideUntilNda,
            comments = projectRequest.comments
        )
        
        val savedProject = projectRepository.save(project)
        return ProjectResponse.fromEntity(savedProject)
    }

    /**
     * Обновить проект
     */
    @Transactional
    fun updateProject(id: Long, updateRequest: UpdateProjectRequest): ProjectResponse {
        val existingProject = projectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Проект с ID $id не найден") }
        
        // Создаем копию объекта с обновленными полями
        val updatedProject = existingProject.copy(
            name = updateRequest.name ?: existingProject.name,
            dealType = updateRequest.dealType ?: existingProject.dealType,
            industry = updateRequest.industry ?: existingProject.industry,
            isVisible = updateRequest.isVisible ?: existingProject.isVisible,
            isCompleted = updateRequest.isCompleted ?: existingProject.isCompleted,
            contactName1 = updateRequest.contactName1 ?: existingProject.contactName1,
            contactPhone1 = updateRequest.contactPhone1 ?: existingProject.contactPhone1,
            contactPosition1 = updateRequest.contactPosition1 ?: existingProject.contactPosition1,
            contactPhone2 = updateRequest.contactPhone2 ?: existingProject.contactPhone2,
            inn = updateRequest.inn ?: existingProject.inn,
            location = updateRequest.location ?: existingProject.location,
            revenue = updateRequest.revenue ?: existingProject.revenue,
            ebitda = updateRequest.ebitda ?: existingProject.ebitda,
            price = updateRequest.price ?: existingProject.price,
            salePercent = updateRequest.salePercent ?: existingProject.salePercent,
            website = updateRequest.website ?: existingProject.website,
            hideUntilNda = updateRequest.hideUntilNda ?: existingProject.hideUntilNda,
            comments = updateRequest.comments ?: existingProject.comments
        )
        
        val savedProject = projectRepository.save(updatedProject)
        return ProjectResponse.fromEntity(savedProject)
    }

    /**
     * Удалить проект
     */
    @Transactional
    fun deleteProject(id: Long): Boolean {
        if (!projectRepository.existsById(id)) {
            throw ResourceNotFoundException("Проект с ID $id не найден")
        }
        
        projectRepository.deleteById(id)
        return true
    }
}
