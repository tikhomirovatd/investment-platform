package com.banking.api.repository

import com.banking.api.model.User
import com.banking.api.model.UserType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): Optional<User>
    fun findByUserType(userType: UserType): List<User>
    fun findByOrganizationNameContainingIgnoreCase(organizationName: String): List<User>
    fun findByFullNameContainingIgnoreCase(fullName: String): List<User>
}
