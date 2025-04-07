package com.banking.api.dto

import com.banking.api.model.DealType
import com.banking.api.model.Project
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO for Project entities
 */
data class ProjectDTO(
    val id: Long = 0,
    
    @field:NotBlank(message = "Project name is required")
    val name: String,
    
    @field:NotNull(message = "Deal type is required")
    val dealType: DealType,
    
    @field:NotBlank(message = "Industry is required")
    val industry: String,
    
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val isVisible: Boolean = true,
    val isCompleted: Boolean = false
) {
    companion object {
        fun fromEntity(project: Project): ProjectDTO {
            return ProjectDTO(
                id = project.id,
                name = project.name,
                dealType = project.dealType,
                industry = project.industry,
                createdAt = project.createdAt,
                isVisible = project.isVisible,
                isCompleted = project.isCompleted
            )
        }
    }
    
    fun toEntity(): Project {
        return Project(
            id = id,
            name = name,
            dealType = dealType,
            industry = industry,
            createdAt = createdAt,
            isVisible = isVisible,
            isCompleted = isCompleted
        )
    }
}

/**
 * DTO for creating a new Project
 */
data class CreateProjectDTO(
    @field:NotBlank(message = "Project name is required")
    val name: String,
    
    @field:NotNull(message = "Deal type is required")
    val dealType: DealType,
    
    @field:NotBlank(message = "Industry is required")
    val industry: String,
    
    val isVisible: Boolean = true
) {
    fun toEntity(): Project {
        return Project(
            name = name,
            dealType = dealType,
            industry = industry,
            isVisible = isVisible
        )
    }
}

/**
 * DTO for updating Project properties
 */
data class UpdateProjectDTO(
    val name: String? = null,
    val dealType: DealType? = null,
    val industry: String? = null,
    val isVisible: Boolean? = null,
    val isCompleted: Boolean? = null
)
