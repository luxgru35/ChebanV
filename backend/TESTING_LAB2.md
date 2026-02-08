# Lab 2 Testing Guide (Auth & JWT)

## Предварительные требования
Убедитесь, что сервер запущен:
```bash
cd backend
npm run dev
```

## 1. Регистрация и Аутентификация

### Регистрация
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Ivan Testov\", \"email\": \"ivan@test.com\", \"password\": \"secret123\"}"
```
Ожидаем: `201 Created` с токеном.

### Вход (Login)
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"ivan@test.com\", \"password\": \"secret123\"}"
```
Ожидаем: `200 OK` с токеном. Сохраните токен!

## 2. Проверка защиты маршрутов

### Попытка доступа без токена
```bash
curl -X GET http://localhost:5000/users
```
Ожидаем: `401 Unauthorized`.

### Доступ с токеном
```bash
# Замените YOUR_TOKEN на токен, полученный при входе
curl -X GET http://localhost:5000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Ожидаем: `200 OK` и список пользователей.

## 3. Публичные маршруты

```bash
curl -X GET http://localhost:5000/public/events
```
Ожидаем: `200 OK` (доступен без токена).

## 4. Тестирование Варианта 20 (Email Notifications)

### Сценарий: Новый вход
1. Выполните вход (Login) первый раз.
   - В консоли сервера: сообщение о сохранении истории входа.
   - New device detected: `false` (так как это первый вход, или можно считать true, но история пуста).
   
2. Имитируйте смену устройства (измените User-Agent через curl или Postman).
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (New Device)" \
  -d "{\"email\": \"ivan@test.com\", \"password\": \"secret123\"}"
```
Ожидаем:
- В ответе JSON поле `newDeviceDetected: true`.
- В консоли сервера лог: `✅ Email sent to ivan@test.com about new device login` (если SMTP настроен верно).
- Если SMTP не настроен, будет ошибка отправки в консоли, но вход выполнится успешно.

## 5. SQL Проверка (Login History)
```sql
SELECT * FROM "LoginHistories";
```
Должны появиться записи с разным IP/User-Agent.
