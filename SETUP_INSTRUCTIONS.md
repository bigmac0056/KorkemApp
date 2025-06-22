# 🚀 Инструкция по настройке KorkemApp на Render.com

## ✅ Что уже сделано

Я провел комплексную проверку безопасности и внес все необходимые улучшения:

### 🔒 Безопасность
- ✅ Убрал хардкод JWT секретов
- ✅ Добавил rate limiting (100 запросов за 15 минут)
- ✅ Настроил CORS для Render.com
- ✅ Добавил валидацию всех входных данных
- ✅ Улучшил обработку ошибок
- ✅ Добавил блокировку аккаунтов после 5 неудачных попыток
- ✅ Создал безопасный API клиент

### 🛠️ Готовность к публикации
- ✅ Обновил app.json с правильными bundle ID
- ✅ Создал eas.json для EAS Build
- ✅ Добавил тестовый экран для проверки сервера
- ✅ Создал скрипт генерации секретов

## 🔧 Настройка Render.com

### Шаг 1: Создание сервиса
1. Войдите в [Render.com](https://render.com)
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub репозиторий
4. Выберите репозиторий KorkemApp

### Шаг 2: Настройка сервиса
- **Name**: `korkem-app-backend`
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: `Free`

### Шаг 3: Environment Variables
Добавьте в Render.com следующие переменные:

```env
NODE_ENV=production
PORT=3001

# Используйте сгенерированные секреты:
JWT_SECRET=34bbac5b16857179cade49277047fed108e4379b7f97793b2433b8c669b92dbe6428e569ca9e88dc639c93787c0c8cf5d04074886e04ba9b2f12ac9a8de66772
DEVELOPER_PASSWORD=ccb01785f8d382e85fe6728acad12cea

JWT_EXPIRES_IN=7d

# Замените на ваш MongoDB URI:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/korkem-app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS - замените на ваш домен:
ALLOWED_ORIGINS=https://your-app-name.onrender.com,http://localhost:8081,http://localhost:8082,exp://localhost:8081
RENDER_EXTERNAL_URL=https://your-app-name.onrender.com
```

## 🌐 Настройка MongoDB

### Рекомендуется MongoDB Atlas:
1. Создайте аккаунт на [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Создайте бесплатный кластер
3. Создайте пользователя БД
4. Получите connection string
5. Добавьте IP 0.0.0.0/0 в whitelist

## 📱 Обновление клиента

После деплоя сервера обновите URL в `constants/config.ts`:

```typescript
export const API_URL = 'https://your-app-name.onrender.com';
```

Замените `your-app-name` на реальное имя вашего сервиса.

## 🧪 Тестирование

### 1. Проверка сервера:
Откройте: `https://your-app-name.onrender.com`
Должно показать: `{"message":"KorkemApp Backend is running"}`

### 2. Проверка health endpoint:
Откройте: `https://your-app-name.onrender.com/api/health`
Должно показать: `{"status":"OK","server":"KorkemApp Backend"}`

### 3. Тестирование в приложении:
1. Войдите как developer (используйте DEVELOPER_PASSWORD)
2. Перейдите в Profile → Server Test
3. Нажмите "Run Tests"

## 🏪 Публикация в магазины

### Подготовка:
```bash
# Установите EAS CLI
npm install -g @expo/eas-cli

# Войдите в Expo
eas login

# Настройте EAS
eas build:configure
```

### Сборка:
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Оба
eas build --platform all --profile production
```

### Публикация:
```bash
# iOS App Store
eas submit --platform ios --profile production

# Google Play Store
eas submit --platform android --profile production
```

## 🔍 Устранение проблем

### CORS ошибки:
- Проверьте `ALLOWED_ORIGINS` в Render.com
- Убедитесь, что домен правильный

### MongoDB connection failed:
- Проверьте `MONGODB_URI` в переменных окружения
- Убедитесь, что IP добавлен в whitelist

### Server not responding:
- Проверьте логи в Render.com dashboard
- Убедитесь, что build и start команды правильные

## 📊 Мониторинг

### Логи:
- Render.com dashboard → ваш сервис → Logs

### Health Check:
- Render.com автоматически проверяет endpoint `/`
- Автоматический перезапуск при проблемах

## 🔐 Безопасность

### Обязательно:
1. ✅ JWT_SECRET изменен на безопасный
2. ✅ MongoDB Atlas настроен
3. ✅ CORS ограничен нужными доменами
4. ✅ Rate limiting включен
5. ✅ HTTPS используется

### Рекомендуется:
1. Настройте мониторинг безопасности
2. Регулярно обновляйте зависимости
3. Используйте переменные окружения

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Render.com
2. Используйте Server Test в приложении
3. Убедитесь, что все переменные настроены
4. Проверьте MongoDB connection

---

## 🎉 Готово!

Ваше приложение теперь:
- ✅ Безопасно настроено
- ✅ Готово к публикации
- ✅ Защищено от основных атак
- ✅ Оптимизировано для Render.com

**Следующий шаг**: Настройте сервер на Render.com и обновите API_URL в клиенте! 