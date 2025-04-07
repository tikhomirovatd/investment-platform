package com.banking.api.controller

import com.banking.api.dto.CreateRequestDto
import com.banking.api.dto.RequestResponseDto
import com.banking.api.dto.UpdateRequestDto
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import com.banking.api.service.RequestService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/requests")
@Tag(name = "Requests", description = "API for request management")
class RequestController(private val requestService: RequestService) {

    @GetMapping
    @Operation(summary = "Get all requests", description = "Retrieve a list of all requests with optional filters")
    fun getAllRequests(
        @RequestParam search: String?,
        @RequestParam userType: UserType?,
        @RequestParam status: RequestStatus?
    ): ResponseEntity<List<RequestResponseDto>> {
        val requests = requestService.searchRequests(search, userType, status)
        return ResponseEntity.ok(requests)
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request by ID", description = "Retrieve a specific request by its ID")
    fun getRequestById(@PathVariable id: Long): ResponseEntity<RequestResponseDto> {
        val request = requestService.getRequestById(id)
        return ResponseEntity.ok(request)
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get requests by status", description = "Retrieve all requests with a specific status")
    fun getRequestsByStatus(@PathVariable status: RequestStatus): ResponseEntity<List<RequestResponseDto>> {
        val requests = requestService.getRequestsByStatus(status)
        return ResponseEntity.ok(requests)
    }

    @GetMapping("/user-type/{userType}")
    @Operation(summary = "Get requests by user type", description = "Retrieve all requests for a specific user type")
    fun getRequestsByUserType(@PathVariable userType: UserType): ResponseEntity<List<RequestResponseDto>> {
        val requests = requestService.getRequestsByUserType(userType)
        return ResponseEntity.ok(requests)
    }

    @GetMapping("/topic/{topic}")
    @Operation(summary = "Get requests by topic", description = "Retrieve all requests with a specific topic")
    fun getRequestsByTopic(@PathVariable topic: String): ResponseEntity<List<RequestResponseDto>> {
        val requests = requestService.getRequestsByTopic(topic)
        return ResponseEntity.ok(requests)
    }

    @PostMapping
    @Operation(summary = "Create a new request", description = "Create a new request with the provided information")
    fun createRequest(@Valid @RequestBody createRequestDto: CreateRequestDto): ResponseEntity<RequestResponseDto> {
        val createdRequest = requestService.createRequest(createRequestDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest)
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update request", description = "Update an existing request's information")
    fun updateRequest(
        @PathVariable id: Long,
        @Valid @RequestBody updateRequestDto: UpdateRequestDto
    ): ResponseEntity<RequestResponseDto> {
        val updatedRequest = requestService.updateRequest(id, updateRequestDto)
        return ResponseEntity.ok(updatedRequest)
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete request", description = "Delete a request by its ID")
    fun deleteRequest(@PathVariable id: Long): ResponseEntity<Void> {
        requestService.deleteRequest(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}/status/{status}")
    @Operation(summary = "Update request status", description = "Update the status of a request")
    fun updateRequestStatus(
        @PathVariable id: Long,
        @PathVariable status: RequestStatus
    ): ResponseEntity<RequestResponseDto> {
        val updatedRequest = requestService.updateRequestStatus(id, status)
        return ResponseEntity.ok(updatedRequest)
    }
}
