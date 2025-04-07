package com.banking.api.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "projects")
data class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, length = 200)
    val name: String,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "deal_type", nullable = false)
    val dealType: DealType,
    
    @Column(nullable = false, length = 100)
    val industry: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "is_visible", nullable = false)
    val isVisible: Boolean = true,
    
    @Column(name = "is_completed", nullable = false)
    val isCompleted: Boolean = false
)
