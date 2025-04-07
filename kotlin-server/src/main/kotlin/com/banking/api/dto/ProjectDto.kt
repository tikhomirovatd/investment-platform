package com.banking.api.dto

import com.banking.api.model.DealType
import com.banking.api.model.Project
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

// DTO для создания проекта
data class CreateProjectDto(
    @field:NotBlank(message = "Name is required")
    @field:Size(max = 200, message = "Name must not exceed 200 characters")
    val name: String,
    
    @field:NotNull(message = "Deal type is required")
    val dealType: DealType,
    
    @field:NotBlank(message = "Industry is required")
    @field:Size(max = 100, message = "Industry must not exceed 100 characters")
    val industry: String,
    
    val isVisible: Boolean = true,
    val isCompleted: Boolean = false
)

// DTO для обновления проекта
data class UpdateProjectDto(
    @field:Size(max = 200, message = "Name must not exceed 200 characters")
    val name: String? = null,
    
    val dealType: DealType? = null,
    
    @field:Size(max = 100, message = "Industry must not exceed 100 characters")
    val industry: String? = null,
    
    val isVisible: Boolean? = null,
    val isCompleted: Boolean? = null
)

// DTO для отображения информации о проекте
data class ProjectResponseDto(
    val id: Long,
    val name: String,
    val dealType: DealType,
    val industry: String,
    val createdAt: LocalDateTime,
    val isVisible: Boolean,
    val isCompleted: Boolean
) {
    companion object {
        fun fromEntity(project: Project): ProjectResponseDto {
            return ProjectResponseDto(
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
}
