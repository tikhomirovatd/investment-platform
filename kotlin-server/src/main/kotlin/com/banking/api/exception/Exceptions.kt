package com.banking.api.exception

/**
 * Исключение, выбрасываемое при попытке доступа к несуществующему ресурсу
 */
class ResourceNotFoundException(message: String) : RuntimeException(message)

/**
 * Исключение, выбрасываемое при попытке создать ресурс, который уже существует
 */
class ResourceAlreadyExistsException(message: String) : RuntimeException(message)

/**
 * Исключение, выбрасываемое при неверном запросе (некорректные параметры и т.д.)
 */
class InvalidRequestException(message: String) : RuntimeException(message)
