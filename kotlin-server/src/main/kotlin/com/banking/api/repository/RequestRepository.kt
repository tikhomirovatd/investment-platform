package com.banking.api.repository

import com.banking.api.model.Request
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Репозиторий для работы с заявками
 */
@Repository
interface RequestRepository : JpaRepository<Request, Long> {
    /**
     * Найти заявки по типу пользователя
     */
    fun findByUserType(userType: UserType): List<Request>
    
    /**
     * Найти заявки по статусу
     */
    fun findByStatus(status: RequestStatus): List<Request>
    
    /**
     * Найти заявки по теме (частичное совпадение, без учета регистра)
     */
    fun findByTopicContainingIgnoreCase(topic: String): List<Request>
    
    /**
     * Найти заявки по ФИО (частичное совпадение, без учета регистра)
     */
    fun findByFullNameContainingIgnoreCase(fullName: String): List<Request>
    
    /**
     * Найти заявки по названию организации (частичное совпадение, без учета регистра)
     */
    fun findByOrganizationNameContainingIgnoreCase(organizationName: String): List<Request>
}
