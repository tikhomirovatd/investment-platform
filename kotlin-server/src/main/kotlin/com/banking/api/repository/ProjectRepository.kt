package com.banking.api.repository

import com.banking.api.model.DealType
import com.banking.api.model.Project
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Репозиторий для работы с проектами
 */
@Repository
interface ProjectRepository : JpaRepository<Project, Long> {
    /**
     * Найти проекты по типу сделки
     */
    fun findByDealType(dealType: DealType): List<Project>
    
    /**
     * Найти проекты по отрасли (частичное совпадение, без учета регистра)
     */
    fun findByIndustryContainingIgnoreCase(industry: String): List<Project>
    
    /**
     * Найти проекты по статусу завершения
     */
    fun findByIsCompleted(isCompleted: Boolean): List<Project>
    
    /**
     * Найти проекты по видимости
     */
    fun findByIsVisible(isVisible: Boolean): List<Project>
    
    /**
     * Найти проекты по названию (частичное совпадение, без учета регистра)
     */
    fun findByNameContainingIgnoreCase(name: String): List<Project>
}
