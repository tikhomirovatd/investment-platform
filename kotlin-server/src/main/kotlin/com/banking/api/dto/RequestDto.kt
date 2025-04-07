package com.banking.api.dto

import com.banking.api.model.Request
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

// DTO для создания запроса
data class CreateRequestDto(
    @field:NotNull(message = "User type is required")
    val userType: UserType,
    
    @field:NotBlank(message = "Topic is required")
    @field:Size(max = 100, message = "Topic must not exceed 100 characters")
    val topic: String,
    
    @field:NotBlank(message = "Full name is required")
    @field:Size(max = 200, message = "Full name must not exceed 200 characters")
    val fullName: String,
    
    @field:Size(max = 200, message = "Organization name must not exceed 200 characters")
    val organizationName: String? = null,
    
    @field:Size(max = 50, message = "CNUM must not exceed 50 characters")
    val cnum: String? = null,
    
    @field:Size(max = 50, message = "Login must not exceed 50 characters")
    val login: String? = null,
    
    @field:Size(max = 20, message = "Phone number must not exceed 20 characters")
    val phone: String? = null,
    
    val comments: String? = null
)

// DTO для обновления запроса
data class UpdateRequestDto(
    val status: RequestStatus? = null,
    
    @field:Size(max = 200, message = "Full name must not exceed 200 characters")
    val fullName: String? = null,
    
    @field:Size(max = 200, message = "Organization name must not exceed 200 characters")
    val organizationName: String? = null,
    
    @field:Size(max = 50, message = "CNUM must not exceed 50 characters")
    val cnum: String? = null,
    
    @field:Size(max = 50, message = "Login must not exceed 50 characters")
    val login: String? = null,
    
    @field:Size(max = 20, message = "Phone number must not exceed 20 characters")
    val phone: String? = null,
    
    val comments: String? = null
)

// DTO для отображения информации о запросе
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
) {
    companion object {
        fun fromEntity(request: Request): RequestResponseDto {
            return RequestResponseDto(
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
}
