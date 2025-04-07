package com.banking.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Main application class for Investment Platform
 */
@SpringBootApplication
class InvestmentPlatformApplication

/**
 * Main function to start the application
 */
fun main(args: Array<String>) {
    runApplication<InvestmentPlatformApplication>(*args)
}
