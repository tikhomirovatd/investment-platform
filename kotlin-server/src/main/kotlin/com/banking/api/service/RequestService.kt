package com.banking.api.service

import com.banking.api.dto.CreateRequestDto
import com.banking.api.dto.RequestResponseDto
import com.banking.api.dto.UpdateRequestDto
import com.banking.api.exception.ResourceNotFoundException
import com.banking.api.model.Request
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import com.banking.api.repository.RequestRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class RequestService(private val requestRepository: RequestRepository) {

    fun getAllRequests(): List<RequestResponseDto> {
        return requestRepository.findAll().map { RequestResponseDto.fromEntity(it) }
    }

    fun getRequestById(id: Long): RequestResponseDto {
        val request = requestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Request not found with id: $id") }
        return RequestResponseDto.fromEntity(request)
    }

    fun getRequestsByStatus(status: RequestStatus): List<RequestResponseDto> {
        return requestRepository.findByStatus(status)
            .map { RequestResponseDto.fromEntity(it) }
    }

    fun getRequestsByUserType(userType: UserType): List<RequestResponseDto> {
        return requestRepository.findByUserType(userType)
            .map { RequestResponseDto.fromEntity(it) }
    }

    fun getRequestsByTopic(topic: String): List<RequestResponseDto> {
        return requestRepository.findByTopic(topic)
            .map { RequestResponseDto.fromEntity(it) }
    }

    @Transactional
    fun createRequest(createRequestDto: CreateRequestDto): RequestResponseDto {
        val request = Request(
            userType = createRequestDto.userType,
            topic = createRequestDto.topic,
            createdAt = LocalDateTime.now(),
            status = RequestStatus.NEW,
            fullName = createRequestDto.fullName,
            organizationName = createRequestDto.organizationName,
            cnum = createRequestDto.cnum,
            login = createRequestDto.login,
            phone = createRequestDto.phone,
            comments = createRequestDto.comments
        )

        val savedRequest = requestRepository.save(request)
        return RequestResponseDto.fromEntity(savedRequest)
    }

    @Transactional
    fun updateRequest(id: Long, updateRequestDto: UpdateRequestDto): RequestResponseDto {
        val existingRequest = requestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Request not found with id: $id") }

        val updatedRequest = existingRequest.copy(
            status = updateRequestDto.status ?: existingRequest.status,
            fullName = updateRequestDto.fullName ?: existingRequest.fullName,
            organizationName = updateRequestDto.organizationName ?: existingRequest.organizationName,
            cnum = updateRequestDto.cnum ?: existingRequest.cnum,
            login = updateRequestDto.login ?: existingRequest.login,
            phone = updateRequestDto.phone ?: existingRequest.phone,
            comments = updateRequestDto.comments ?: existingRequest.comments
        )

        val savedRequest = requestRepository.save(updatedRequest)
        return RequestResponseDto.fromEntity(savedRequest)
    }

    @Transactional
    fun deleteRequest(id: Long) {
        if (!requestRepository.existsById(id)) {
            throw ResourceNotFoundException("Request not found with id: $id")
        }
        requestRepository.deleteById(id)
    }

    fun searchRequests(search: String?, userType: UserType?, status: RequestStatus?): List<RequestResponseDto> {
        // Если параметры поиска не указаны, возвращаем все запросы
        if (search.isNullOrBlank() && userType == null && status == null) {
            return getAllRequests()
        }

        var results = listOf<Request>()

        // Поиск по указанным параметрам
        if (!search.isNullOrBlank()) {
            val byFullName = requestRepository.findByFullNameContainingIgnoreCase(search)
            val byOrganization = requestRepository.findByOrganizationNameContainingIgnoreCase(search)
            
            // Объединяем результаты поиска
            results = (byFullName + byOrganization).distinctBy { it.id }
        } else {
            results = requestRepository.findAll()
        }

        // Фильтруем по типу пользователя, если указан
        if (userType != null) {
            results = results.filter { it.userType == userType }
        }

        // Фильтруем по статусу, если указан
        if (status != null) {
            results = results.filter { it.status == status }
        }

        return results.map { RequestResponseDto.fromEntity(it) }
    }

    @Transactional
    fun updateRequestStatus(id: Long, status: RequestStatus): RequestResponseDto {
        val request = requestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Request not found with id: $id") }

        val updatedRequest = request.copy(status = status)
        val savedRequest = requestRepository.save(updatedRequest)
        return RequestResponseDto.fromEntity(savedRequest)
    }
}
