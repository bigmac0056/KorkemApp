# Настройка сервера KorkemApp на Render.com

## 🚀 Шаг 1: Создание нового сервиса на Render.com

1. Войдите в [Render.com](https://render.com)
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub репозиторий
4. Выберите репозиторий KorkemApp

## ⚙️ Шаг 2: Настройка сервиса

### Основные настройки:
- **Name**: `korkem-app-backend` (или любое другое имя)
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: `Free` (для начала)

### Environment Variables:
Добавьте следующие переменные окружения в настройках сервиса:

```env
NODE_ENV=production
PORT=3001

# Security - ОБЯЗАТЕЛЬНО измените на свой секретный ключ!
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters-long-and-random
JWT_EXPIRES_IN=7d

# Database - замените на вашу MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/korkem-app

# Developer Account (только для разработки)
DEVELOPER_EMAIL=your-email@example.com
DEVELOPER_PASSWORD=your-secure-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS - замените на ваш домен Render.com
ALLOWED_ORIGINS=https://your-app-name.onrender.com,http://localhost:8081,http://localhost:8082,exp://localhost:8081
RENDER_EXTERNAL_URL=https://your-app-name.onrender.com
```

## 🔧 Шаг 3: Настройка MongoDB

### Вариант A: MongoDB Atlas (рекомендуется)
1. Создайте аккаунт на [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Создайте новый кластер (бесплатный tier)
3. Создайте пользователя базы данных
4. Получите connection string
5. Добавьте ваш IP в whitelist (или 0.0.0.0/0 для всех)

### Вариант B: Локальная MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/korkem-app
```

## 🌐 Шаг 4: Обновление клиентского кода

После деплоя сервера на Render.com, обновите URL в клиенте:

```typescript
// constants/config.ts
export const API_URL = 'https://your-app-name.onrender.com';
```

Замените `your-app-name` на реальное имя вашего сервиса на Render.com.

## 🔍 Шаг 5: Тестирование

### Проверка сервера:
1. Откройте URL вашего сервиса: `https://your-app-name.onrender.com`
2. Должно появиться: `{"message":"KorkemApp Backend is running",...}`

### Проверка health endpoint:
1. Откройте: `https://your-app-name.onrender.com/api/health`
2. Должно появиться: `{"status":"OK","server":"KorkemApp Backend",...}`

### Тестирование в приложении:
1. Войдите как developer
2. Перейдите в Profile → Server Test
3. Нажмите "Run Tests"

## 🛠️ Шаг 6: Устранение проблем

### Проблема: CORS ошибки
**Решение**: Проверьте переменную `ALLOWED_ORIGINS` в Render.com

### Проблема: MongoDB connection failed
**Решение**: 
1. Проверьте `MONGODB_URI` в переменных окружения
2. Убедитесь, что IP адрес добавлен в whitelist MongoDB Atlas

### Проблема: JWT_SECRET error
**Решение**: Убедитесь, что JWT_SECRET содержит минимум 32 символа

### Проблема: Server not responding
**Решение**:
1. Проверьте логи в Render.com dashboard
2. Убедитесь, что build и start команды правильные
3. Проверьте, что все зависимости установлены

## 📊 Шаг 7: Мониторинг

### Логи в Render.com:
- Перейдите в ваш сервис на Render.com
- Вкладка "Logs" покажет все логи сервера

### Health Check:
- Render.com автоматически проверяет endpoint `/`
- Если сервер не отвечает, он будет перезапущен

## 🔒 Шаг 8: Безопасность

### Обязательные меры:
1. **Измените JWT_SECRET** на уникальный секретный ключ
2. **Используйте MongoDB Atlas** вместо локальной БД
3. **Настройте CORS** только для нужных доменов
4. **Включите rate limiting** (уже настроено)
5. **Используйте HTTPS** (автоматически на Render.com)

### Дополнительные меры:
1. Настройте мониторинг безопасности
2. Регулярно обновляйте зависимости
3. Используйте переменные окружения для всех секретов

## 🚀 Шаг 9: Масштабирование

### Обновление до платного плана:
1. Перейдите в настройки сервиса
2. Выберите "Upgrade Plan"
3. Выберите подходящий план

### Автоскейлинг:
- Render.com автоматически масштабирует сервисы
- Настройте auto-scaling в зависимости от нагрузки

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Render.com dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте MongoDB connection
4. Используйте Server Test в приложении для диагностики

**Важно**: Никогда не коммитьте секретные ключи в Git репозиторий! 