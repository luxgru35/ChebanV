# Merge Request: Lab 2 - JWT Authentication & Authorization

## Описание

Реализована система аутентификации и авторизации на основе JWT токенов с выполнением варианта 20.

## Выполненные задания

### Основная часть
✅ Установлены зависимости (`bcryptjs`, `jsonwebtoken`, `passport`, `passport-jwt`).
✅ Добавлено поле `password` с хешированием в модель `User`.
✅ Настроена стратегия `passport-jwt` для валидации токенов.
✅ Реализован API регистрации (`POST /auth/register`) и входа (`POST /auth/login`).
✅ Защищены маршруты `/users` и `/events` (требуют Bearer Token).
✅ Выделены публичные маршруты `/public/events`.

### Вариант 20 - Дополнительное задание
✅ **Задание #5: Email-уведомления при входе с нового устройства/IP.**
- Создана модель `LoginHistory` для хранения истории входов (IP, User-Agent).
- При каждом входе проверяется, использовал ли пользователь это устройство ранее.
- Если обнаружено новое устройство, отправляется email-уведомление через `Nodemailer`.
- Конфигурация SMTP вынесена в `.env`.

## Тестирование
- Руководство по тестированию: `backend/TESTING_LAB2.md`.
- Swagger документация обновлена с поддержкой Bearer Auth.

## Коммиты
1. `feat: LAB2 Implement basic JWT authentication and authorization setup`
2. `feat: LAB2 Variant 20 - Documentation and final checks`

---
**Студент:** Чебан Владислав
**Вариант:** 20
