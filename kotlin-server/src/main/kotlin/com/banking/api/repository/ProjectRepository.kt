package com.banking.api.repository

import com.banking.api.model.DealType
import com.banking.api.model.Project
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectRepository : JpaRepository<Project, Long> {
    fun findByIsCompleted(isCompleted: Boolean): List<Project>
    fun findByDealType(dealType: DealType): List<Project>
    fun findByIndustryContainingIgnoreCase(industry: String): List<Project>
    fun findByNameContainingIgnoreCase(name: String): List<Project>
    fun findByIsCompletedAndIsVisible(isCompleted: Boolean, isVisible: Boolean): List<Project>
}
