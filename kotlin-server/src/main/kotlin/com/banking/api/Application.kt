package com.banking.api

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import com.banking.api.routes.registerRoutes
import com.banking.api.database.DatabaseFactory
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("com.banking.api.Application")

fun main() {
    embeddedServer(Netty, port = 5000, host = "0.0.0.0") {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
            })
        }
        
        DatabaseFactory.init()
        
        registerRoutes()
        
        logger.info("Kotlin server started on port 5000")
    }.start(wait = true)
}
