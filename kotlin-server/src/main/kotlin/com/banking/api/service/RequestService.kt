package com.banking.api.service

import com.banking.api.dto.CreateRequestRequest
import com.banking.api.dto.RequestResponse
import com.banking.api.dto.UpdateRequestRequest
import com.banking.api.exception.ResourceNotFoundException
import com.banking.api.model.Request
import com.banking.api.model.RequestStatus
import com.banking.api.model.UserType
import com.banking.api.repository.RequestRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Сервис для работы с заявками
 */
@Service
class RequestService(private val requestRepository: RequestRepository) {

    /**
     * Получить все заявки
     */
    fun getAllRequests(): List<RequestResponse> {
        return requestRepository.findAll().map { RequestResponse.fromEntity(it) }
    }

    /**
     * Получить заявку по ID
     */
    fun getRequestById(id: Long): RequestResponse {
        val request = requestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Заявка с ID $id не найдена") }
        return RequestResponse.fromEntity(request)
    }

    /**
     * Фильтрация заявок
     */
    fun filterRequests(search: String?, userType: UserType?, status: RequestStatus?): List<RequestResponse> {
        val requests = when {
            !search.isNullOrBlank() && userType != null && status != null -> {
                requestRepository.findAll().filter {
                    it.userType == userType && 
                    it.status == status &&
                    (it.fullName.contains(search, ignoreCase = true) ||
                    it.organizationName?.contains(search, ignoreCase = true) == true ||
                    it.topic.contains(search, ignoreCase = true) ||
                    it.comments?.contains(search, ignoreCase = true) == true)
                }
            }
            !search.isNullOrBlank() && userType != null -> {
                requestRepository.findAll().filter {
                    it.userType == userType &&
                    (it.fullName.contains(search, ignoreCase = true) ||
                    it.organizationName?.contains(search, ignoreCase = true) == true ||
                    it.topic.contains(search, ignoreCase = true) ||
                    it.comments?.contains(search, ignoreCase = true) == true)
                }
            }
            !search.isNullOrBlank() && status != null -> {
                requestRepository.findAll().filter {
                    it.status == status &&
                    (it.fullName.contains(search, ignoreCase = true) ||
                    it.organizationName?.contains(search, ignoreCase = true) == true ||
                    it.topic.contains(search, ignoreCase = true) ||
                    it.comments?.contains(search, ignoreCase = true) == true)
                }
            }
            userType != null && status != null -> {
                requestRepository.findAll().filter {
                    it.userType == userType && it.status == status
                }
            }
            !search.isNullOrBlank() -> {
                requestRepository.findAll().filter {
                    it.fullName.contains(search, ignoreCase = true) ||
                    it.organizationName?.contains(search, ignoreCase = true) == true ||
                    it.topic.contains(search, ignoreCase = true) ||
                    it.comments?.contains(search, ignoreCase = true) == true
                }
            }
            userType != null -> {
                requestRepository.findByUserType(userType)
            }
            status != null -> {
                requestRepository.findByStatus(status)
            }
            else -> {
                requestRepository.findAll()
            }
        }
        
        return requests.map { RequestResponse.fromEntity(it) }
    }

    /**
     * Создать новую заявку
     */
    @Transactional
    fun createRequest(requestRequest: CreateRequestRequest): RequestResponse {
        val request = Request(
            userType = requestRequest.userType,
            topic = requestRequest.topic,
            fullName = requestRequest.fullName,
            organizationName = requestRequest.organizationName,
            cnum = requestRequest.cnum,
            login = requestRequest.login,
            phone = requestRequest.phone,
            comments = requestRequest.comments
        )
        
        val savedRequest = requestRepository.save(request)
        return RequestResponse.fromEntity(savedRequest)
    }

    /**
     * Обновить заявку
     */
    @Transactional
    fun updateRequest(id: Long, updateRequest: UpdateRequestRequest): RequestResponse {
        val existingRequest = requestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Заявка с ID $id не найдена") }
        
        // Создаем копию объекта с обновленными полями
        val updatedRequest = existingRequest.copy(
            status = updateRequest.status ?: existingRequest.status,
            fullName = updateRequest.fullName ?: existingRequest.fullName,
            organizationName = updateRequest.organizationName ?: existingRequest.organizationName,
            cnum = updateRequest.cnum ?: existingRequest.cnum,
            login = updateRequest.login ?: existingRequest.login,
            phone = updateRequest.phone ?: existingRequest.phone,
            comments = updateRequest.comments ?: existingRequest.comments
        )
        
        val savedRequest = requestRepository.save(updatedRequest)
        return RequestResponse.fromEntity(savedRequest)
    }
}
