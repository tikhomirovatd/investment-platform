package com.banking.api.controller

import com.banking.api.dto.CreateUserDto
import com.banking.api.dto.UserResponseDto
import com.banking.api.model.UserType
import com.banking.api.service.UserService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "API for user management")
class UserController(private val userService: UserService) {

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve a list of all users with optional filters")
    fun getAllUsers(
        @RequestParam search: String?,
        @RequestParam userType: UserType?,
        @RequestParam organization: String?
    ): ResponseEntity<List<UserResponseDto>> {
        val users = userService.searchUsers(search, userType, organization)
        return ResponseEntity.ok(users)
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve a specific user by their ID")
    fun getUserById(@PathVariable id: Long): ResponseEntity<UserResponseDto> {
        val user = userService.getUserById(id)
        return ResponseEntity.ok(user)
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "Get user by username", description = "Retrieve a specific user by their username")
    fun getUserByUsername(@PathVariable username: String): ResponseEntity<UserResponseDto> {
        val user = userService.getUserByUsername(username)
        return ResponseEntity.ok(user)
    }

    @GetMapping("/type/{userType}")
    @Operation(summary = "Get users by type", description = "Retrieve all users of a specific type")
    fun getUsersByType(@PathVariable userType: UserType): ResponseEntity<List<UserResponseDto>> {
        val users = userService.getUsersByType(userType)
        return ResponseEntity.ok(users)
    }

    @PostMapping
    @Operation(summary = "Create a new user", description = "Create a new user with the provided information")
    fun createUser(@Valid @RequestBody createUserDto: CreateUserDto): ResponseEntity<UserResponseDto> {
        val createdUser = userService.createUser(createUserDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser)
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update an existing user's information")
    fun updateUser(
        @PathVariable id: Long,
        @Valid @RequestBody updateUserDto: CreateUserDto
    ): ResponseEntity<UserResponseDto> {
        val updatedUser = userService.updateUser(id, updateUserDto)
        return ResponseEntity.ok(updatedUser)
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Delete a user by their ID")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<Void> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }
}
