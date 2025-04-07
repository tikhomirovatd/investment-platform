package com.banking.api.dto

import com.banking.api.model.Request
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * DTO для создания заявки
 */
data class CreateRequestRequest(
    @field:NotNull(message = "Тип пользователя обязателен")
    val userType: UserType,
    
    @field:NotBlank(message = "Тема заявки обязательна")
    val topic: String,
    
    @field:NotBlank(message = "ФИО обязательно")
    val fullName: String,
    
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null
)

/**
 * DTO для обновления заявки
 */
data class UpdateRequestRequest(
    val status: RequestStatus? = null,
    val fullName: String? = null,
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null
)

/**
 * DTO для ответа с данными заявки
 */
data class RequestResponse(
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
        fun fromEntity(request: Request): RequestResponse {
            return RequestResponse(
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
