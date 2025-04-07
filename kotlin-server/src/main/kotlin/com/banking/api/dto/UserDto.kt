package com.banking.api.dto

import com.banking.api.model.User
import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

// DTO для создания пользователя
data class CreateUserDto(
    @field:NotNull(message = "User type is required")
    val userType: UserType,
    
    @field:NotBlank(message = "Username is required")
    @field:Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    val username: String,
    
    @field:NotBlank(message = "Organization name is required")
    @field:Size(max = 200, message = "Organization name must not exceed 200 characters")
    val organizationName: String,
    
    @field:NotBlank(message = "Full name is required")
    @field:Size(max = 200, message = "Full name must not exceed 200 characters")
    val fullName: String,
    
    @field:Size(max = 20, message = "Phone number must not exceed 20 characters")
    val phone: String? = null,
    
    val comments: String? = null
)

// DTO для обновления пользователя
data class UpdateUserDto(
    val userType: UserType? = null,
    
    @field:Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    val username: String? = null,
    
    @field:Size(max = 200, message = "Organization name must not exceed 200 characters")
    val organizationName: String? = null,
    
    @field:Size(max = 200, message = "Full name must not exceed 200 characters")
    val fullName: String? = null,
    
    @field:Size(max = 20, message = "Phone number must not exceed 20 characters")
    val phone: String? = null,
    
    val comments: String? = null
)

// DTO для отображения информации о пользователе
data class UserResponseDto(
    val id: Long,
    val userType: UserType,
    val username: String,
    val organizationName: String,
    val fullName: String,
    val phone: String?,
    val lastAccess: LocalDateTime?,
    val comments: String?
) {
    companion object {
        fun fromEntity(user: User): UserResponseDto {
            return UserResponseDto(
                id = user.id,
                userType = user.userType,
                username = user.username,
                organizationName = user.organizationName,
                fullName = user.fullName,
                phone = user.phone,
                lastAccess = user.lastAccess,
                comments = user.comments
            )
        }
    }
}
