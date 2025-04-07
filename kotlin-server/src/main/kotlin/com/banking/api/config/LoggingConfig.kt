package com.banking.api.config

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.web.filter.CommonsRequestLoggingFilter
import org.springframework.context.annotation.Bean

@Configuration
class LoggingConfig {

    private val log = LoggerFactory.getLogger(LoggingConfig::class.java)

    @Bean
    fun requestLoggingFilter(): CommonsRequestLoggingFilter {
        log.info("Configuring request logging filter")
        val filter = CommonsRequestLoggingFilter()
        filter.setIncludeQueryString(true)
        filter.setIncludePayload(true)
        filter.setMaxPayloadLength(10000)
        filter.setIncludeHeaders(false)
        return filter
    }
}
