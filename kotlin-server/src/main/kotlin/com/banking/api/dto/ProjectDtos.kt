package com.banking.api.dto

import com.banking.api.model.DealType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO для создания нового проекта
 */
data class CreateProjectDto(
    @field:NotBlank(message = "Project name is required")
    val name: String,
    
    @field:NotNull(message = "Deal type is required")
    val dealType: DealType,
    
    @field:NotBlank(message = "Industry is required")
    val industry: String,
    
    val isVisible: Boolean = true,
    
    val isCompleted: Boolean = false
)

/**
 * DTO для обновления проекта
 */
data class UpdateProjectDto(
    val name: String? = null,
    val dealType: DealType? = null,
    val industry: String? = null,
    val isVisible: Boolean? = null,
    val isCompleted: Boolean? = null
)

/**
 * DTO для ответа с информацией о проекте
 */
data class ProjectResponseDto(
    val id: Long,
    val name: String,
    val dealType: DealType,
    val industry: String,
    val createdAt: LocalDateTime,
    val isVisible: Boolean,
    val isCompleted: Boolean
)
