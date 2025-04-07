package com.banking.api.model

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Сущность проекта
 */
@Entity
@Table(name = "projects")
data class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    val name: String,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "deal_type", nullable = false)
    val dealType: DealType,
    
    @Column(nullable = false)
    val industry: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "is_visible", nullable = false)
    val isVisible: Boolean = true,
    
    @Column(name = "is_completed", nullable = false)
    val isCompleted: Boolean = false,
    
    // Контактные данные
    @Column(name = "contact_name1")
    val contactName1: String? = null,
    
    @Column(name = "contact_phone1")
    val contactPhone1: String? = null,
    
    @Column(name = "contact_position1")
    val contactPosition1: String? = null,
    
    @Column(name = "contact_phone2")
    val contactPhone2: String? = null,
    
    // Параметры бизнеса
    @Column
    val inn: String? = null,
    
    @Column
    val location: String? = null,
    
    @Column
    val revenue: String? = null,
    
    @Column
    val ebitda: String? = null,
    
    @Column
    val price: String? = null,
    
    @Column(name = "sale_percent")
    val salePercent: String? = null,
    
    @Column
    val website: String? = null,
    
    @Column(name = "hide_until_nda")
    val hideUntilNda: Boolean = false,
    
    @Column
    val comments: String? = null
)
