# API Testing Guide

## Предварительные требования

1. Убедитесь, что PostgreSQL установлен и запущен
2. Создайте базу данных:
```sql
CREATE DATABASE events_db;
```

3. Настройте файл `.env` с правильными параметрами подключения

## Запуск сервера

```bash
cd backend
npm run dev
```

Сервер запустится на `http://localhost:5000`

## Тестирование API

### 1. Проверка работы сервера

```bash
curl http://localhost:5000
```

Ожидаемый ответ:
```json
{
  "message": "Events Management API",
  "documentation": "http://localhost:5000/api-docs"
}
```

### 2. Swagger документация

Откройте в браузере: `http://localhost:5000/api-docs`

### 3. Тестирование Users API

#### Создание пользователя

```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Владислав Чебан\", \"email\": \"cheban@example.com\"}"
```

#### Получение списка пользователей

```bash
curl http://localhost:5000/users
```

#### Soft delete пользователя

```bash
curl -X DELETE http://localhost:5000/users/1
```

После удаления пользователь не будет отображаться в списке, но останется в БД с заполненным полем `deletedAt`.

### 4. Тестирование Events API

#### Создание мероприятия

```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Концерт\", \"description\": \"Рок-концерт\", \"date\": \"2026-03-15T19:00:00Z\", \"createdBy\": 1}"
```

#### Получение всех мероприятий

```bash
curl http://localhost:5000/events
```

#### Получение мероприятия по ID

```bash
curl http://localhost:5000/events/1
```

#### Обновление мероприятия

```bash
curl -X PUT http://localhost:5000/events/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Джаз-концерт\", \"description\": \"Вечер джазовой музыки\"}"
```

#### Soft delete мероприятия

```bash
curl -X DELETE http://localhost:5000/events/1
```

### 5. Тестирование CORS (вариант 20)

Попробуйте отправить запрос с недоверенного домена:

```bash
curl -X GET http://localhost:5000/events \
  -H "Origin: http://untrusted-domain.com"
```

Должна вернуться ошибка CORS.

Запрос с доверенного домена (настроенного в .env):

```bash
curl -X GET http://localhost:5000/events \
  -H "Origin: http://localhost:3000"
```

Должен выполниться успешно.

### 6. Проверка логирования

При каждом запросе в консоли сервера должны отображаться логи в формате:
```
GET /events 200 1234 - 45.678 ms
POST /users 201 567 - 23.456 ms
```

### 7. Проверка Soft Delete

Выполните SQL запрос к базе данных:

```sql
SELECT * FROM "Users" WHERE "deletedAt" IS NOT NULL;
SELECT * FROM "Events" WHERE "deletedAt" IS NOT NULL;
```

Удаленные записи должны присутствовать с заполненным полем `deletedAt`.

## Тестирование через Postman

1. Импортируйте коллекцию из Swagger: `http://localhost:5000/api-docs`
2. Создайте environment с переменной `baseUrl = http://localhost:5000`
3. Выполните все запросы из коллекции

## Проверка выполнения требований варианта 20

### ✅ Функциональное задание #6: Soft delete
- Поле `deletedAt` добавлено в модели User и Event
- При DELETE запросе устанавливается `deletedAt = NOW()`
- GET запросы фильтруют записи с `deletedAt IS NULL`

### ✅ Улучшение #5: CORS-ограничения
- Настроены доверенные домены через `.env` (ALLOWED_ORIGINS)
- Настроены разрешенные методы через `.env` (ALLOWED_METHODS)
- Запросы с недоверенных доменов отклоняются

### ✅ Документация: Swagger
- Swagger UI доступен по адресу `/api-docs`
- Все endpoints документированы

### ✅ Логирование: Morgan
- Все запросы логируются в консоль
- Формат: метод, путь, статус, размер, время
