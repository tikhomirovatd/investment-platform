package com.banking.api.controller

import com.banking.api.dto.CreateRequestDTO
import com.banking.api.dto.RequestDTO
import com.banking.api.dto.UpdateRequestDTO
import com.banking.api.service.RequestService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for Request operations
 */
@RestController
@RequestMapping("/api/requests")
class RequestController(private val requestService: RequestService) {

    /**
     * Get all requests
     */
    @GetMapping
    fun getAllRequests(): ResponseEntity<List<RequestDTO>> {
        return ResponseEntity.ok(requestService.getAllRequests())
    }

    /**
     * Get request by ID
     */
    @GetMapping("/{id}")
    fun getRequestById(@PathVariable id: Long): ResponseEntity<RequestDTO> {
        val request = requestService.getRequestById(id)
        return if (request != null) {
            ResponseEntity.ok(request)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    /**
     * Create a new request
     */
    @PostMapping
    fun createRequest(@Valid @RequestBody createRequestDTO: CreateRequestDTO): ResponseEntity<RequestDTO> {
        val newRequest = requestService.createRequest(createRequestDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(newRequest)
    }

    /**
     * Update an existing request
     */
    @PutMapping("/{id}")
    fun updateRequest(
        @PathVariable id: Long,
        @Valid @RequestBody updateRequestDTO: UpdateRequestDTO
    ): ResponseEntity<RequestDTO> {
        val updatedRequest = requestService.updateRequest(id, updateRequestDTO)
        return if (updatedRequest != null) {
            ResponseEntity.ok(updatedRequest)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
