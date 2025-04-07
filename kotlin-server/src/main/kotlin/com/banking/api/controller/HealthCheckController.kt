package com.banking.api.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "API health check endpoint")
class HealthCheckController {

    data class HealthStatus(
        val status: String = "UP",
        val timestamp: LocalDateTime = LocalDateTime.now(),
        val version: String = "1.0.0"
    )

    @GetMapping
    @Operation(summary = "Check health status", description = "Verify if the API is operational")
    fun checkHealth(): ResponseEntity<HealthStatus> {
        return ResponseEntity.ok(HealthStatus())
    }
}
