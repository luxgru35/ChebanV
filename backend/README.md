# Events Management API

**Студент:** Чебан Владислав  
**Группа:** [Укажите номер группы]

## Описание проекта

REST API для управления мероприятиями с поддержкой:
- CRUD операций для мероприятий и пользователей
- Soft delete (мягкое удаление)
- CORS-ограничений с настройкой доверенных доменов
- Swagger документации
- Логирования запросов
- **[New]** Аутентификации и авторизации (JWT)
- **[New]** Email-уведомлений о входе с новых устройств

## Технологии

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Passport.js (JWT Strategy)
- Nodemailer
- Swagger (документация API)
- Morgan (логирование)

## Установка и запуск

1. Установите зависимости:
```bash
cd backend
npm install
```

2. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE events_db;
```

3. Настройте файл `.env`.

4. Запустите сервер:
```bash
npm run dev
```

## API Документация

После запуска сервера документация доступна по адресу:
http://localhost:5000/api-docs

## Endpoints

### Auth (New)
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему (возвращает JWT)

### Public
- `GET /public/events` - Публичный список мероприятий

### Users (Protected)
- `GET /users` - Получить список пользователей
- `DELETE /users/:id` - Удалить пользователя

### Events (Protected)
- `POST /events` - Создать мероприятие
- `PUT /events/:id` - Обновить мероприятие
- `DELETE /events/:id` - Удалить мероприятие

## Вариант 20

### Лабораторная работу №1
- Функциональное задание #6: Soft delete
- Улучшение #5: CORS-ограничения

### Лабораторная работу №2 (New)
- **Задание #5:** Email-уведомления при входе с нового устройства или IP-адреса.
  - Реализовано отслеживание IP и User-Agent.
  - История входов сохраняется в таблице `LoginHistories`.
  - Отправка email через Nodemailer.
