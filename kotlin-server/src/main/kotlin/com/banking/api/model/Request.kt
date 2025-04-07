package com.banking.api.model

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Сущность заявки
 */
@Entity
@Table(name = "requests")
data class Request(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    val userType: UserType,
    
    @Column(nullable = false)
    val topic: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: RequestStatus = RequestStatus.NEW,
    
    @Column(name = "full_name", nullable = false)
    val fullName: String,
    
    @Column(name = "organization_name")
    val organizationName: String? = null,
    
    @Column
    val cnum: String? = null,
    
    @Column
    val login: String? = null,
    
    @Column
    val phone: String? = null,
    
    @Column
    val comments: String? = null
)
