# KitchenStore

Современный интернет-магазин посуды

---

## 🚀 Технологии

**Frontend:**
- React.js (SPA)
- Redux
- SCSS
- Jest
- Webpack (CRA)
- JWT

**Backend:**
- Node.js + Express
- MongoDB
- Docker
- Swagger
- Jest
- Prometheus-метрики
- Winston/morgan логирование
- migrate-mongo (миграции)

---

## 🎨 Дизайн и цветовая схема
- Основные цвета: #FFFFFF, #0000FF, #00FFFF
- Шрифты: Roboto (основной), Montserrat (заголовки)

---

## 📦 Структура
- Каталог товаров (карточки)
- Корзина (счетчик, миниатюры, итог)
- Заказы (статусы, детали, отмена)
- Личный кабинет (смена имени, пароля)
- Адаптивный дизайн
- Footer: политика, контакты, копирайт, логотип

---

## 🛠️ Запуск проекта

### 1. Клонируйте репозиторий
```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Запуск через Docker
```bash
docker-compose up --build
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Swagger: http://localhost:5000/api-docs
- Prometheus-метрики: http://localhost:5000/metrics

### 3. Миграции MongoDB
```bash
cd backend
npx migrate-mongo up
```

### 4. Локальный запуск (без Docker)
- Backend:
  ```bash
  cd backend
  npm install
  npm run dev
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  npm start
  ```

---

## 🧪 Тестирование
- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

---

## 📖 Документация
- API: `/api-docs` (Swagger)
- Миграции: `migrate-mongo`
- Мониторинг: `/metrics` (Prometheus)

---

## 👤 Руководство пользователя
- Зарегистрируйтесь или войдите
- Добавляйте товары в корзину
- Оформляйте заказы
- Следите за статусом заказов
- Меняйте имя (до 2 раз в день) и пароль в профиле

---

## 🛡️ Безопасность
- JWT, хеширование паролей, XSS, CSRF, rate limiting, helmet

---

## 📦 CI/CD
- GitHub Actions: `.github/workflows/ci.yml`

---

## 📞 Контакты
- Email: info@kitchenstore.com
- Телефон: +7 (999) 123-45-67 