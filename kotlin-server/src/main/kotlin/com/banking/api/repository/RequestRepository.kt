package com.banking.api.repository

import com.banking.api.model.Request
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RequestRepository : JpaRepository<Request, Long> {
    fun findByStatus(status: RequestStatus): List<Request>
    fun findByUserType(userType: UserType): List<Request>
    fun findByTopic(topic: String): List<Request>
    fun findByFullNameContainingIgnoreCase(fullName: String): List<Request>
    fun findByOrganizationNameContainingIgnoreCase(organizationName: String): List<Request>
}
