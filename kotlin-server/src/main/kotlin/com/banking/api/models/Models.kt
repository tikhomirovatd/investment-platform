package com.banking.api.models

import kotlinx.serialization.Serializable
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

@Serializable
data class User(
    val id: Int,
    val userType: UserType,
    val username: String,
    val organizationName: String,
    val fullName: String,
    val phone: String? = null,
    val lastAccess: String? = null,
    val comments: String? = null
)

@Serializable
data class InsertUser(
    val userType: UserType,
    val username: String,
    val organizationName: String,
    val fullName: String,
    val phone: String? = null,
    val comments: String? = null
)

@Serializable
data class Project(
    val id: Int,
    val name: String,
    val dealType: DealType,
    val industry: String,
    val createdAt: String,
    val isVisible: Boolean,
    val isCompleted: Boolean
)

@Serializable
data class InsertProject(
    val name: String,
    val dealType: DealType,
    val industry: String,
    val isVisible: Boolean,
    val isCompleted: Boolean
)

@Serializable
data class Request(
    val id: Int,
    val userType: UserType,
    val topic: String,
    val createdAt: String,
    val status: RequestStatus,
    val fullName: String,
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null
)

@Serializable
data class InsertRequest(
    val userType: UserType,
    val topic: String,
    val status: RequestStatus,
    val fullName: String,
    val organizationName: String? = null,
    val cnum: String? = null,
    val login: String? = null,
    val phone: String? = null,
    val comments: String? = null
)
