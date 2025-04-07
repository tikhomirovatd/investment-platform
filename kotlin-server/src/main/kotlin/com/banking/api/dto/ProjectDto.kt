package com.banking.api.dto

import com.banking.api.model.DealType
import com.banking.api.model.Project
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO для создания проекта
 */
data class CreateProjectRequest(
    @field:NotBlank(message = "Название проекта обязательно")
    val name: String,
    
    @field:NotNull(message = "Тип сделки обязателен")
    val dealType: DealType,
    
    @field:NotBlank(message = "Отрасль обязательна")
    val industry: String,
    
    val isVisible: Boolean = true,
    val isCompleted: Boolean = false,
    
    // Контактные данные
    val contactName1: String? = null,
    val contactPhone1: String? = null,
    val contactPosition1: String? = null,
    val contactPhone2: String? = null,
    
    // Параметры бизнеса
    val inn: String? = null,
    val location: String? = null,
    val revenue: String? = null,
    val ebitda: String? = null,
    val price: String? = null,
    val salePercent: String? = null,
    val website: String? = null,
    val hideUntilNda: Boolean = false,
    val comments: String? = null
)

/**
 * DTO для обновления проекта
 */
data class UpdateProjectRequest(
    val name: String? = null,
    val dealType: DealType? = null,
    val industry: String? = null,
    val isVisible: Boolean? = null,
    val isCompleted: Boolean? = null,
    
    // Контактные данные
    val contactName1: String? = null,
    val contactPhone1: String? = null,
    val contactPosition1: String? = null,
    val contactPhone2: String? = null,
    
    // Параметры бизнеса
    val inn: String? = null,
    val location: String? = null,
    val revenue: String? = null,
    val ebitda: String? = null,
    val price: String? = null,
    val salePercent: String? = null,
    val website: String? = null,
    val hideUntilNda: Boolean? = null,
    val comments: String? = null
)

/**
 * DTO для ответа с данными проекта
 */
data class ProjectResponse(
    val id: Long,
    val name: String,
    val dealType: DealType,
    val industry: String,
    val createdAt: LocalDateTime,
    val isVisible: Boolean,
    val isCompleted: Boolean,
    
    // Контактные данные
    val contactName1: String?,
    val contactPhone1: String?,
    val contactPosition1: String?,
    val contactPhone2: String?,
    
    // Параметры бизнеса
    val inn: String?,
    val location: String?,
    val revenue: String?,
    val ebitda: String?,
    val price: String?,
    val salePercent: String?,
    val website: String?,
    val hideUntilNda: Boolean,
    val comments: String?
) {
    companion object {
        fun fromEntity(project: Project): ProjectResponse {
            return ProjectResponse(
                id = project.id,
                name = project.name,
                dealType = project.dealType,
                industry = project.industry,
                createdAt = project.createdAt,
                isVisible = project.isVisible,
                isCompleted = project.isCompleted,
                contactName1 = project.contactName1,
                contactPhone1 = project.contactPhone1,
                contactPosition1 = project.contactPosition1,
                contactPhone2 = project.contactPhone2,
                inn = project.inn,
                location = project.location,
                revenue = project.revenue,
                ebitda = project.ebitda,
                price = project.price,
                salePercent = project.salePercent,
                website = project.website,
                hideUntilNda = project.hideUntilNda,
                comments = project.comments
            )
        }
    }
}
