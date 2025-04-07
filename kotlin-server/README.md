# Kotlin-сервер для инвестиционной платформы

## Установка и запуск

1. Убедитесь, что установлены JDK 11+ и Gradle
2. Запустите сервер:

```bash
./gradlew run
```

## Основные компоненты

- **Application.kt** - точка входа в приложение, настройка Ktor
- **models/Models.kt** - модели данных для пользователей, проектов и запросов
- **database/DatabaseFactory.kt** - настройка базы данных и определение таблиц
- **routes/Routes.kt** - маршруты и обработчики HTTP-запросов

## API

### Пользователи
- `GET /api/users` - получить всех пользователей
- `GET /api/users/{id}` - получить пользователя по ID
- `POST /api/users` - создать нового пользователя

### Проекты
- `GET /api/projects` - получить все проекты (с фильтрацией по isCompleted)
- `GET /api/projects/{id}` - получить проект по ID
- `POST /api/projects` - создать новый проект
- `PATCH /api/projects/{id}` - обновить проект
- `DELETE /api/projects/{id}` - удалить проект

### Запросы
- `GET /api/requests` - получить все запросы
- `GET /api/requests/{id}` - получить запрос по ID
- `POST /api/requests` - создать новый запрос
- `PATCH /api/requests/{id}` - обновить запрос
