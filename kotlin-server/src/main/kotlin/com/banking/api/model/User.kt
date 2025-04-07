package com.banking.api.model

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Сущность пользователя
 */
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    val userType: UserType,
    
    @Column(nullable = false, unique = true)
    val username: String,
    
    @Column(nullable = false)
    val password: String,
    
    @Column(name = "organization_name", nullable = false)
    val organizationName: String,
    
    @Column(name = "full_name", nullable = false)
    val fullName: String,
    
    @Column
    val phone: String? = null,
    
    @Column(name = "last_access")
    val lastAccess: LocalDateTime? = null,
    
    @Column
    val comments: String? = null
)
