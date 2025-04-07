package com.banking.api.repository

import com.banking.api.model.User
import com.banking.api.model.UserType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

/**
 * Репозиторий для работы с пользователями
 */
@Repository
interface UserRepository : JpaRepository<User, Long> {
    /**
     * Найти пользователя по имени пользователя
     */
    fun findByUsername(username: String): Optional<User>
    
    /**
     * Найти пользователей по типу пользователя
     */
    fun findByUserType(userType: UserType): List<User>
    
    /**
     * Найти пользователей по названию организации (частичное совпадение, без учета регистра)
     */
    fun findByOrganizationNameContainingIgnoreCase(organizationName: String): List<User>
    
    /**
     * Проверить существование пользователя по имени пользователя
     */
    fun existsByUsername(username: String): Boolean
}
