package com.banking.api.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "requests")
data class Request(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    val userType: UserType,
    
    @Column(nullable = false, length = 100)
    val topic: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: RequestStatus = RequestStatus.NEW,
    
    @Column(name = "full_name", nullable = false, length = 200)
    val fullName: String,
    
    @Column(name = "organization_name", length = 200)
    val organizationName: String? = null,
    
    @Column(length = 50)
    val cnum: String? = null,
    
    @Column(length = 50)
    val login: String? = null,
    
    @Column(length = 20)
    val phone: String? = null,
    
    @Column(columnDefinition = "TEXT")
    val comments: String? = null
)
