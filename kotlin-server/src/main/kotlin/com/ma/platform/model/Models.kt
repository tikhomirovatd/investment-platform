package com.ma.platform.model

import java.time.LocalDateTime

enum class UserType {
    SELLER, BUYER
}

enum class DealType {
    SALE, INVESTMENT
}

enum class RequestStatus {
    NEW, IN_PROGRESS, COMPLETED, REJECTED
}

data class User(
    val id: Int,
    val userType: UserType,
    val username: String,
    val organizationName: String,
    val fullName: String,
    val phone: String? = null,
    val lastAccess: LocalDateTime? = null,
    val comments: String? = null
)

data class Project(
    val id: Int,
    val name: String,
    val dealType: DealType,
    val industry: String,
    val createdAt: LocalDateTime,
    val isVisible: Boolean,
    val isCompleted: Boolean
)

data class Request(
    val id: Int,
    val userType: UserType,
    val topic: String,
    val createdAt: LocalDateTime,
    val status: RequestStatus,
    val fullName: String,
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null
)

// DTO для создания новых сущностей
data class UserDTO(
    val userType: UserType,
    val username: String,
    val organizationName: String,
    val fullName: String,
    val phone: String? = null,
    val comments: String? = null
)

data class ProjectDTO(
    val name: String,
    val dealType: DealType,
    val industry: String,
    val isVisible: Boolean = true,
    val isCompleted: Boolean = false
)

data class RequestDTO(
    val userType: UserType,
    val topic: String,
    val status: RequestStatus = RequestStatus.NEW,
    val fullName: String,
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null
)
