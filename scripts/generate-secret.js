#!/usr/bin/env node

const crypto = require('crypto');

// Генерируем безопасный JWT секрет
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Генерируем безопасный пароль
const generatePassword = () => {
  return crypto.randomBytes(16).toString('hex');
};

console.log('🔐 Генерация безопасных секретов для KorkemApp\n');

const jwtSecret = generateJWTSecret();
const password = generatePassword();

console.log('📋 Скопируйте эти значения в переменные окружения Render.com:\n');

console.log('JWT_SECRET=' + jwtSecret);
console.log('DEVELOPER_PASSWORD=' + password);

console.log('\n⚠️  ВАЖНО:');
console.log('1. Сохраните эти значения в безопасном месте');
console.log('2. НЕ коммитьте их в Git репозиторий');
console.log('3. Добавьте их в Environment Variables в Render.com');
console.log('4. JWT_SECRET должен быть минимум 32 символа (у вас: ' + jwtSecret.length + ' символов)');

console.log('\n🔧 Следующие шаги:');
console.log('1. Перейдите в ваш сервис на Render.com');
console.log('2. Откройте Environment Variables');
console.log('3. Добавьте JWT_SECRET и DEVELOPER_PASSWORD');
console.log('4. Перезапустите сервис');

console.log('\n✅ Готово! Ваши секреты сгенерированы безопасно.'); 