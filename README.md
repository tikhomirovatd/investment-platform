# Инвестиционная платформа для банковских сотрудников

[![GitHub репозиторий](https://img.shields.io/badge/GitHub-Репозиторий-blue?logo=github)](https://github.com/tikhomirovatd/investment-platform)

Комплексная платформа для управления инвестиционными проектами, обработки запросов и работы с пользователями. Система разработана для эффективного управления и отслеживания инвестиционных возможностей.

## Ключевые функции

- Управление проектами: создание, редактирование и отслеживание инвестиционных проектов
- Обработка запросов: двухэтапный процесс создания запросов с динамическими формами
- Управление пользователями: просмотр и добавление пользователей с различными ролями
- Фильтрация и сортировка: интерактивные таблицы данных с расширенными возможностями фильтрации
- Адаптивный дизайн: оптимизация для различных устройств

## Технический стек

### Фронтенд:
- React TypeScript
- Tanstack Query для управления данными
- Tailwind CSS для стилизации
- Тематическое оформление с использованием shadcn/ui
- Реактивные компоненты с улучшенным пользовательским интерфейсом

### Бэкенд:
- Express.js сервер (с подготовленной интеграцией для перехода на Kotlin)
- Хранение данных в памяти с использованием Map
- API для управления проектами, пользователями и запросами

## Архитектура

Приложение построено по принципу "single-page application" (SPA) с чистым, профессиональным интерфейсом, вдохновленным корпоративными банковскими платформами. Интерфейс имеет три основные вкладки (Запросы, Пользователи, Проекты) с фильтруемыми и сортируемыми таблицами данных.

### Особенности бэкенда:
- API на JavaScript с подготовленным переходом на Kotlin
- Слой абстракции хранилища для упрощения миграции между реализациями
- Валидация запросов с использованием схем Zod

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск приложения в режиме разработки
npm run dev
```

Приложение будет доступно по адресу http://localhost:5000.

## Структура проекта

- `server/` - бэкенд на Express.js
  - `kotlin-integration.ts` - слой интеграции для перехода на Kotlin
  - `routes.ts` - API маршруты
  - `storage.ts` - хранилище данных
- `client/src/` - фронтенд на React
  - `components/` - компоненты пользовательского интерфейса
  - `pages/` - страницы приложения
  - `lib/` - утилиты и типы
- `shared/` - общие модули
  - `schema.ts` - схемы данных
- `kotlin-server/` - заготовка для Kotlin-бэкенда

## Подготовка к переходу на Kotlin

Для обеспечения плавного перехода с JavaScript на Kotlin реализован следующий подход:
- Промежуточный слой интеграции (kotlin-integration.ts)
- Прокси-объект StorageProxy для маршрутизации запросов
- Готовая структура Kotlin-проекта с API-маршрутами
- Единый интерфейс для работы с бэкендами на обоих языках