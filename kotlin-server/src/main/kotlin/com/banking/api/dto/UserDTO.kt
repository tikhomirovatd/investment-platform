package com.banking.api.dto

import com.banking.api.model.User
import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO for User entities
 */
data class UserDTO(
    val id: Long = 0,
    
    @field:NotNull(message = "User type is required")
    val userType: UserType,
    
    @field:NotBlank(message = "Username is required")
    val username: String,
    
    @field:NotBlank(message = "Organization name is required")
    val organizationName: String,
    
    @field:NotBlank(message = "Full name is required")
    val fullName: String,
    
    val phone: String? = null,
    val lastAccess: LocalDateTime? = null,
    val comments: String? = null
) {
    companion object {
        fun fromEntity(user: User): UserDTO {
            return UserDTO(
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
    
    fun toEntity(): User {
        return User(
            id = id,
            userType = userType,
            username = username,
            organizationName = organizationName,
            fullName = fullName,
            phone = phone,
            lastAccess = lastAccess,
            comments = comments
        )
    }
}

/**
 * DTO for creating a new User
 */
data class CreateUserDTO(
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
) {
    fun toEntity(): User {
        return User(
            userType = userType,
            username = username,
            organizationName = organizationName,
            fullName = fullName,
            phone = phone,
            comments = comments
        )
    }
}
