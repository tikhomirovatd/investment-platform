package com.banking.api.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {
    
    @Bean
    fun openApi(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("Investment Platform API")
                    .description("API documentation for Investment Platform")
                    .version("1.0.0")
                    .contact(
                        Contact()
                            .name("Banking Team")
                            .email("support@banking.com")
                    )
            )
    }
}
