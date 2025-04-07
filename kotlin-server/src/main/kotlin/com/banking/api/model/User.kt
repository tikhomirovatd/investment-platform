package com.banking.api.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    val userType: UserType,
    
    @Column(nullable = false, unique = true, length = 100)
    val username: String,
    
    @Column(name = "organization_name", nullable = false, length = 200)
    val organizationName: String,
    
    @Column(name = "full_name", nullable = false, length = 200)
    val fullName: String,
    
    @Column(length = 20)
    val phone: String? = null,
    
    @Column(name = "last_access")
    val lastAccess: LocalDateTime? = null,
    
    @Column(columnDefinition = "TEXT")
    val comments: String? = null
)
