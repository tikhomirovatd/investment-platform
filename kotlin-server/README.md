# Investment Platform Backend (Kotlin)

This is the Kotlin version of the backend for the Investment Platform application, built with Spring Boot and PostgreSQL.

## Technologies Used

- Kotlin 1.9.24
- Spring Boot 3.2.2
- Spring Data JPA
- PostgreSQL
- Flyway for database migrations
- Gradle for build automation

## Project Structure

- `com.banking.api.model` - Entity classes mapped to database tables
- `com.banking.api.repository` - Spring Data JPA repositories
- `com.banking.api.service` - Business logic services
- `com.banking.api.controller` - REST API endpoints
- `com.banking.api.dto` - Data Transfer Objects for API
- `com.banking.api.config` - Application configuration
- `com.banking.api.exception` - Global exception handling

## Database

The application uses PostgreSQL for data storage and Flyway for schema migrations.

### Entity Relationship:

- Users (bank employees with different roles)
- Projects (investment opportunities with various details)
- Requests (customer requests for services)

## API Endpoints

### Users API

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username
- `POST /api/users` - Create a new user

### Projects API

- `GET /api/projects` - Get all projects (with optional filters)
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create a new project
- `PUT /api/projects/{id}` - Update an existing project
- `DELETE /api/projects/{id}` - Delete a project

### Requests API

- `GET /api/requests` - Get all requests
- `GET /api/requests/{id}` - Get request by ID
- `POST /api/requests` - Create a new request
- `PUT /api/requests/{id}` - Update an existing request

## Development

### Prerequisites

- JDK 17 or higher
- PostgreSQL database
- Gradle

### Configuration

Configure the database connection in `application.properties` file:

```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
```

### Running the Application

```bash
./gradlew bootRun
```

### Building the Application

```bash
./gradlew bootJar
```

### Running with Docker

```bash
docker build -t investment-platform-kotlin .
docker run -p 5000:5000 -e DATABASE_URL=<your-db-url> investment-platform-kotlin
```
