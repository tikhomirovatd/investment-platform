package com.banking.api.service

import com.banking.api.dto.CreateUserDto
import com.banking.api.dto.UpdateUserDto
import com.banking.api.dto.UserResponseDto
import com.banking.api.exception.ResourceAlreadyExistsException
import com.banking.api.exception.ResourceNotFoundException
import com.banking.api.model.User
import com.banking.api.model.UserType
import com.banking.api.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class UserService(private val userRepository: UserRepository) {

    fun getAllUsers(): List<UserResponseDto> {
        return userRepository.findAll().map { UserResponseDto.fromEntity(it) }
    }

    fun getUserById(id: Long): UserResponseDto {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found with id: $id") }
        return UserResponseDto.fromEntity(user)
    }

    fun getUserByUsername(username: String): UserResponseDto {
        val user = userRepository.findByUsername(username)
            .orElseThrow { ResourceNotFoundException("User not found with username: $username") }
        return UserResponseDto.fromEntity(user)
    }

    @Transactional
    fun createUser(createUserDto: CreateUserDto): UserResponseDto {
        // Проверяем, что пользователь с таким username еще не существует
        if (userRepository.findByUsername(createUserDto.username).isPresent) {
            throw ResourceAlreadyExistsException("User with username ${createUserDto.username} already exists")
        }

        val user = User(
            userType = createUserDto.userType,
            username = createUserDto.username,
            organizationName = createUserDto.organizationName,
            fullName = createUserDto.fullName,
            phone = createUserDto.phone,
            comments = createUserDto.comments,
            lastAccess = LocalDateTime.now()
        )

        val savedUser = userRepository.save(user)
        return UserResponseDto.fromEntity(savedUser)
    }

    @Transactional
    fun updateUser(id: Long, updateUserDto: UpdateUserDto): UserResponseDto {
        val existingUser = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found with id: $id") }

        // Проверяем, что если меняется username, то новый username уникален
        if (updateUserDto.username != null && 
            updateUserDto.username != existingUser.username && 
            userRepository.findByUsername(updateUserDto.username).isPresent) {
            throw ResourceAlreadyExistsException("User with username ${updateUserDto.username} already exists")
        }

        val updatedUser = User(
            id = existingUser.id,
            userType = updateUserDto.userType ?: existingUser.userType,
            username = updateUserDto.username ?: existingUser.username,
            organizationName = updateUserDto.organizationName ?: existingUser.organizationName,
            fullName = updateUserDto.fullName ?: existingUser.fullName,
            phone = updateUserDto.phone ?: existingUser.phone,
            comments = updateUserDto.comments ?: existingUser.comments,
            lastAccess = existingUser.lastAccess
        )

        val savedUser = userRepository.save(updatedUser)
        return UserResponseDto.fromEntity(savedUser)
    }

    @Transactional
    fun deleteUser(id: Long) {
        if (!userRepository.existsById(id)) {
            throw ResourceNotFoundException("User not found with id: $id")
        }
        userRepository.deleteById(id)
    }

    fun searchUsers(search: String?, userType: UserType?, organization: String? = null): List<UserResponseDto> {
        // Если параметры поиска не указаны, возвращаем всех пользователей
        if (search.isNullOrBlank() && userType == null && organization.isNullOrBlank()) {
            return getAllUsers()
        }

        var results = listOf<User>()

        // Поиск по указанным параметрам
        if (!search.isNullOrBlank()) {
            val byName = userRepository.findByFullNameContainingIgnoreCase(search)
            val byOrg = userRepository.findByOrganizationNameContainingIgnoreCase(search)
            
            // Объединяем результаты поиска по имени и организации
            results = (byName + byOrg).distinctBy { it.id }
        } else {
            results = userRepository.findAll()
        }

        // Фильтруем по типу пользователя, если указан
        if (userType != null) {
            results = results.filter { it.userType == userType }
        }
        
        // Фильтруем по организации, если указана
        if (!organization.isNullOrBlank()) {
            results = results.filter { it.organizationName.contains(organization, ignoreCase = true) }
        }

        return results.map { UserResponseDto.fromEntity(it) }
    }

    @Transactional
    fun updateLastAccess(id: Long): UserResponseDto {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found with id: $id") }

        val updatedUser = user.copy(lastAccess = LocalDateTime.now())
        val savedUser = userRepository.save(updatedUser)
        return UserResponseDto.fromEntity(savedUser)
    }
    
    /**
     * Получает список пользователей определенного типа
     * @param userType Тип пользователя для фильтрации
     * @return Список пользователей указанного типа в формате DTO
     */
    fun getUsersByType(userType: UserType): List<UserResponseDto> {
        val users = userRepository.findByUserType(userType)
        return users.map { UserResponseDto.fromEntity(it) }
    }
}
