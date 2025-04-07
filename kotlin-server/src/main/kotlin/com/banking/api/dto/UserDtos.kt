package com.banking.api.dto

import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO для создания нового пользователя
 */
data class CreateUserDto(
    @field:NotNull(message = "User type is required")
    val userType: UserType,
    
    @field:NotBlank(message = "Username is required")
    val username: String,
    
    @field:NotBlank(message = "Organization name is required")
    val organizationName: String,
    
    @field:NotBlank(message = "Full name is required")
    val fullName: String,
    
    val phone: String? = null,
    
    val comments: String? = null
)

/**
 * DTO для ответа с информацией о пользователе
 */
data class UserResponseDto(
    val id: Long,
    val userType: UserType,
    val username: String,
    val organizationName: String,
    val fullName: String,
    val phone: String?,
    val lastAccess: LocalDateTime?,
    val comments: String?
)
