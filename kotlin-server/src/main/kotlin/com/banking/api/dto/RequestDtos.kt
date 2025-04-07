package com.banking.api.dto

import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO для создания нового запроса
 */
data class CreateRequestDto(
    @field:NotNull(message = "User type is required")
    val userType: UserType,
    
    @field:NotBlank(message = "Topic is required")
    val topic: String,
    
    @field:NotBlank(message = "Full name is required")
    val fullName: String,
    
    val organizationName: String? = null,
    
    val cnum: String? = null,
    
    val login: String? = null,
    
    val phone: String? = null,
    
    val comments: String? = null,
    
    val status: RequestStatus = RequestStatus.NEW
)

/**
 * DTO для обновления запроса
 */
data class UpdateRequestDto(
    val userType: UserType? = null,
    val topic: String? = null,
    val fullName: String? = null,
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null,
    val status: RequestStatus? = null
)

/**
 * DTO для ответа с информацией о запросе
 */
data class RequestResponseDto(
    val id: Long,
    val userType: UserType,
    val topic: String,
    val createdAt: LocalDateTime,
    val status: RequestStatus,
    val fullName: String,
    val organizationName: String?,
    val cnum: String?,
    val login: String?,
    val phone: String?,
    val comments: String?
)
