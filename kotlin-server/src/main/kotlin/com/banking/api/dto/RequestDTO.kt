package com.banking.api.dto

import com.banking.api.model.Request
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO for Request entities
 */
data class RequestDTO(
    val id: Long = 0,
    
    @field:NotNull(message = "User type is required")
    val userType: UserType,
    
    @field:NotBlank(message = "Topic is required")
    val topic: String,
    
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val status: RequestStatus = RequestStatus.NEW,
    
    @field:NotBlank(message = "Full name is required")
    val fullName: String,
    
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null
) {
    companion object {
        fun fromEntity(request: Request): RequestDTO {
            return RequestDTO(
                id = request.id,
                userType = request.userType,
                topic = request.topic,
                createdAt = request.createdAt,
                status = request.status,
                fullName = request.fullName,
                organizationName = request.organizationName,
                cnum = request.cnum,
                login = request.login,
                phone = request.phone,
                comments = request.comments
            )
        }
    }
    
    fun toEntity(): Request {
        return Request(
            id = id,
            userType = userType,
            topic = topic,
            createdAt = createdAt,
            status = status,
            fullName = fullName,
            organizationName = organizationName,
            cnum = cnum,
            login = login,
            phone = phone,
            comments = comments
        )
    }
}

/**
 * DTO for creating a new Request
 */
data class CreateRequestDTO(
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
    val comments: String? = null
) {
    fun toEntity(): Request {
        return Request(
            userType = userType,
            topic = topic,
            fullName = fullName,
            organizationName = organizationName,
            cnum = cnum,
            login = login,
            phone = phone,
            comments = comments
        )
    }
}

/**
 * DTO for updating Request properties
 */
data class UpdateRequestDTO(
    val status: RequestStatus? = null,
    val comments: String? = null
)
