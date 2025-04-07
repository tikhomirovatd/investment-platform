package com.banking.api.database

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.banking.api.models.*
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val logger = LoggerFactory.getLogger("com.banking.api.database.DatabaseFactory")

object DatabaseFactory {
    fun init() {
        val driverClassName = "org.h2.Driver"
        val jdbcURL = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1"
        val database = Database.connect(jdbcURL, driverClassName)
        
        transaction {
            SchemaUtils.create(Users, Projects, Requests)
            
            // Добавляем тестовые данные
            initializeDemoData()
        }
        
        logger.info("Initialized database")
    }
    
    private fun initializeDemoData() {
        // Тестовые пользователи
        val userId1 = Users.insert {
            it[userType] = UserType.SELLER
            it[username] = "seller1"
            it[organizationName] = "Продавец ООО"
            it[fullName] = "Иванов Иван Иванович"
            it[phone] = "+7 (999) 123-45-67"
            it[lastAccess] = LocalDateTime.now()
            it[comments] = "Активный продавец"
        } get Users.id
        
        val userId2 = Users.insert {
            it[userType] = UserType.BUYER
            it[username] = "buyer1"
            it[organizationName] = "Покупатель АО"
            it[fullName] = "Петров Петр Петрович"
            it[phone] = "+7 (888) 765-43-21"
            it[lastAccess] = LocalDateTime.now()
            it[comments] = null
        } get Users.id
        
        // Тестовые проекты
        Projects.insert {
            it[name] = "Завод по производству пластика"
            it[dealType] = DealType.SALE
            it[industry] = "Производство"
            it[createdAt] = LocalDateTime.now()
            it[isVisible] = true
            it[isCompleted] = false
        }
        
        Projects.insert {
            it[name] = "Сеть кофеен"
            it[dealType] = DealType.INVESTMENT
            it[industry] = "Общественное питание"
            it[createdAt] = LocalDateTime.now()
            it[isVisible] = true
            it[isCompleted] = false
        }
        
        // Тестовые запросы
        Requests.insert {
            it[userType] = UserType.BUYER
            it[topic] = "Поиск объекта"
            it[createdAt] = LocalDateTime.now()
            it[status] = RequestStatus.NEW
            it[fullName] = "Сидоров Сидор Сидорович"
            it[organizationName] = "Инвестор и Ко"
            it[cnum] = "123456"
            it[login] = "investor1"
            it[phone] = "+7 (777) 111-22-33"
            it[comments] = "Ищет объект для инвестиций"
        }
        
        Requests.insert {
            it[userType] = UserType.SELLER
            it[topic] = "Продажа бизнеса"
            it[createdAt] = LocalDateTime.now()
            it[status] = RequestStatus.IN_PROGRESS
            it[fullName] = "Кузнецова Мария Ивановна"
            it[organizationName] = "Бизнес ООО"
            it[cnum] = null
            it[login] = "seller2"
            it[phone] = "+7 (555) 333-22-11"
            it[comments] = "Хочет продать бизнес"
        }
    }
}

// Таблицы БД
object Users : Table() {
    val id = integer("id").autoIncrement()
    val userType = enumeration<UserType>("user_type")
    val username = varchar("username", 50)
    val organizationName = varchar("organization_name", 100)
    val fullName = varchar("full_name", 100)
    val phone = varchar("phone", 50).nullable()
    val lastAccess = datetime("last_access").nullable()
    val comments = text("comments").nullable()
    
    override val primaryKey = PrimaryKey(id)
}

object Projects : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 100)
    val dealType = enumeration<DealType>("deal_type")
    val industry = varchar("industry", 50)
    val createdAt = datetime("created_at")
    val isVisible = bool("is_visible")
    val isCompleted = bool("is_completed")
    
    override val primaryKey = PrimaryKey(id)
}

object Requests : Table() {
    val id = integer("id").autoIncrement()
    val userType = enumeration<UserType>("user_type")
    val topic = varchar("topic", 100)
    val createdAt = datetime("created_at")
    val status = enumeration<RequestStatus>("status")
    val fullName = varchar("full_name", 100)
    val organizationName = varchar("organization_name", 100).nullable()
    val cnum = varchar("cnum", 50).nullable()
    val login = varchar("login", 50).nullable()
    val phone = varchar("phone", 50).nullable()
    val comments = text("comments").nullable()
    
    override val primaryKey = PrimaryKey(id)
}

// Расширения для облегчения маппинга
fun <T> Query.toList(transform: (Row) -> T): List<T> {
    return this.map { transform(it) }
}

// Функции для форматирования дат при сериализации
fun LocalDateTime.toISOString(): String {
    return this.format(DateTimeFormatter.ISO_DATE_TIME)
}
