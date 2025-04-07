package com.banking.api.model

/**
 * Тип пользователя: Продавец или Покупатель
 */
enum class UserType {
    SELLER, BUYER
}

/**
 * Тип сделки: Продажа или Инвестиция
 */
enum class DealType {
    SALE, INVESTMENT
}

/**
 * Статус заявки: Новая, В работе, Завершена, Отклонена
 */
enum class RequestStatus {
    NEW, IN_PROGRESS, COMPLETED, REJECTED
}
