package com.banking.api.dto

import com.banking.api.model.User
import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO для создания пользователя
 */
data class CreateUserRequest(
    @field:NotNull(message = "Тип пользователя обязателен")
    val userType: UserType,
    
    @field:NotBlank(message = "Логин обязателен")
    val username: String,
    
    @field:NotBlank(message = "Пароль обязателен")
    val password: String,
    
    @field:NotBlank(message = "Название организации обязательно")
    val organizationName: String,
    
    @field:NotBlank(message = "ФИО обязательно")
    val fullName: String,
    
    val phone: String? = null,
    val comments: String? = null
)

/**
 * DTO для ответа с данными пользователя
 */
data class UserResponse(
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
        fun fromEntity(user: User): UserResponse {
            return UserResponse(
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
