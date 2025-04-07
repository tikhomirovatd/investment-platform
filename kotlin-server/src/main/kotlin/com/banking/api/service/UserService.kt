package com.banking.api.service

import com.banking.api.dto.CreateUserRequest
import com.banking.api.dto.UserResponse
import com.banking.api.exception.ResourceNotFoundException
import com.banking.api.model.User
import com.banking.api.model.UserType
import com.banking.api.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

/**
 * Сервис для работы с пользователями
 */
@Service
class UserService(private val userRepository: UserRepository) {

    /**
     * Получить всех пользователей
     */
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll().map { UserResponse.fromEntity(it) }
    }

    /**
     * Получить пользователя по ID
     */
    fun getUserById(id: Long): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Пользователь с ID $id не найден") }
        return UserResponse.fromEntity(user)
    }

    /**
     * Получить пользователя по имени пользователя
     */
    fun getUserByUsername(username: String): UserResponse {
        val user = userRepository.findByUsername(username)
            .orElseThrow { ResourceNotFoundException("Пользователь с именем $username не найден") }
        return UserResponse.fromEntity(user)
    }

    /**
     * Фильтрация пользователей
     */
    fun filterUsers(search: String?, userType: UserType?): List<UserResponse> {
        val users = when {
            !search.isNullOrBlank() && userType != null -> {
                userRepository.findAll().filter {
                    it.userType == userType &&
                    (it.fullName.contains(search, ignoreCase = true) ||
                    it.organizationName.contains(search, ignoreCase = true) ||
                    it.username.contains(search, ignoreCase = true))
                }
            }
            !search.isNullOrBlank() -> {
                userRepository.findAll().filter {
                    it.fullName.contains(search, ignoreCase = true) ||
                    it.organizationName.contains(search, ignoreCase = true) ||
                    it.username.contains(search, ignoreCase = true)
                }
            }
            userType != null -> {
                userRepository.findByUserType(userType)
            }
            else -> {
                userRepository.findAll()
            }
        }
        
        return users.map { UserResponse.fromEntity(it) }
    }

    /**
     * Создать нового пользователя
     */
    @Transactional
    fun createUser(userRequest: CreateUserRequest): UserResponse {
        if (userRepository.existsByUsername(userRequest.username)) {
            throw IllegalArgumentException("Пользователь с именем ${userRequest.username} уже существует")
        }
        
        val user = User(
            userType = userRequest.userType,
            username = userRequest.username,
            password = userRequest.password, // В реальном приложении пароль должен быть зашифрован
            organizationName = userRequest.organizationName,
            fullName = userRequest.fullName,
            phone = userRequest.phone,
            lastAccess = LocalDateTime.now(),
            comments = userRequest.comments
        )
        
        val savedUser = userRepository.save(user)
        return UserResponse.fromEntity(savedUser)
    }

    /**
     * Обновить доступ пользователя
     */
    @Transactional
    fun updateUserAccess(id: Long): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Пользователь с ID $id не найден") }
        
        // Создаем копию объекта с обновленным временем доступа
        val updatedUser = user.copy(lastAccess = LocalDateTime.now())
        
        val savedUser = userRepository.save(updatedUser)
        return UserResponse.fromEntity(savedUser)
    }
}
