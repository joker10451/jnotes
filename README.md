# JNotes Clone

> Бесплатный аналог Jnotes с полным паритетом функций, построенный на принципах офлайн-first, приватности и локального шифрования.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white)](https://developer.android.com/)

## 🚀 Особенности

### ✍️ Рукописный ввод
- **Цифровые чернила** с поддержкой давления, наклона и сглаживания
- **Вариативная ширина кисти** для естественного письма
- **Слои** для организации контента
- **Ластик** штриховой и пиксельный
- **Авто-формы** и распознавание геометрии

### 📄 PDF аннотации
- **Импорт больших PDF** с оптимизированным рендером
- **Инструменты аннотации**: маркер, линии, стикеры, ссылки
- **Экспорт XFDF** с вжигаемыми слоями
- **Частичный ререндер** для производительности

### 🎵 Мультимедиа
- **Комбинированные страницы**: рукопись + текст + изображения
- **Аудиозапись** с временными маркерами
- **Синхронизация** аудио и штрихов на временной шкале

### 🤖 AI функции
- **AI Summary**: автоматическое создание конспектов
- **AI Flashcards**: генерация карточек для изучения
- **Генерация тестов**: MCQ, True-False, Short Answer
- **Локальный режим**: работа без интернета

### 🔒 Приватность
- **Офлайн-first**: работа без интернета
- **Локальное шифрование**: ваши данные под вашим контролем
- **E2EE синхронизация**: сквозное шифрование
- **Отключаемая телеметрия**: полная приватность

## 🏗️ Архитектура

### Монорепо структура
```
jnotes-clone/
├── apps/
│   ├── web/                 # Next.js 14 веб-приложение
│   └── mobile/              # Android Jetpack Compose
├── services/
│   ├── api/                 # NestJS API сервис
│   ├── worker/              # BullMQ воркеры (OCR, AI)
│   └── vector/              # Qdrant векторная БД
├── packages/
│   ├── ink-engine/          # WASM ядро для штрихов
│   ├── pdf/                 # PDF.js рендер + аннотации
│   ├── ocr/                 # Tesseract + MLKit обертки
│   ├── search/              # Hybrid BM25 + vector поиск
│   ├── sync/                # CRDT Yjs + P2P WebRTC
│   └── ai/                  # OpenAI/Claude/Local LLM
└── infra/                   # Docker Compose, Traefik
```

### Технологический стек

**Frontend (Web):**
- Next.js 14 с App Router
- React 18 + TypeScript
- Canvas/WebGL для рендера штрихов
- Material 3 дизайн-система
- PWA для офлайн работы

**Frontend (Mobile):**
- Android Jetpack Compose
- Kotlin + Material 3
- Stylus Input API
- MLKit OCR
- Room для локального хранения

**Backend:**
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- BullMQ для фоновых задач
- Qdrant для векторного поиска
- Redis для кэширования

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- pnpm 8+
- Docker и Docker Compose
- Android Studio (для мобильной разработки)

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/joker10451/jnotes.git
cd jnotes
```

2. **Установка зависимостей**
```bash
pnpm install
```

3. **Запуск инфраструктуры**
```bash
pnpm docker:up
```

4. **Настройка переменных окружения**
```bash
cp .env.example .env.local
# Отредактируйте .env.local с вашими настройками
```

5. **Инициализация базы данных**
```bash
pnpm db:push
pnpm db:generate
```

6. **Запуск в режиме разработки**
```bash
pnpm dev
```

### Доступные команды

```bash
# Разработка
pnpm dev              # Запуск всех сервисов в dev режиме
pnpm build            # Сборка всех пакетов
pnpm test             # Запуск тестов
pnpm lint             # Линтинг кода

# База данных
pnpm db:generate      # Генерация Prisma клиента
pnpm db:push          # Применение схемы к БД
pnpm db:migrate       # Запуск миграций

# Docker
pnpm docker:up        # Запуск инфраструктуры
pnpm docker:down      # Остановка инфраструктуры
pnpm docker:logs      # Просмотр логов
```

## 📱 Платформы

### Веб-приложение
- **URL**: http://localhost:3000
- **Особенности**: Canvas рендер, PWA, офлайн работа
- **Браузеры**: Chrome, Firefox, Safari, Edge

### Android приложение
- **Минимальная версия**: Android 8.0 (API 26)
- **Рекомендуемая**: Android 14+
- **Особенности**: Stylus Input API, MLKit OCR

## 🎨 Дизайн-система

Проект использует Material 3 дизайн-систему с:
- **Типографическая шкала** Material 3
- **8dp система отступов**
- **Три акцентных цвета** + нейтральная палитра
- **Темы**: светлая "ivory", тёмная "graphite", eye-care
- **Поверхности** с мягкими тенями

## 🔧 Разработка

### Структура проекта
- **apps/**: Приложения (web, mobile)
- **services/**: Микросервисы (api, worker, vector)
- **packages/**: Общие пакеты
- **infra/**: Инфраструктура (Docker, конфиги)

### Стандарты кода
- **TypeScript** для типизации
- **ESLint** для линтинга
- **Prettier** для форматирования
- **Husky** для pre-commit hooks

### Тестирование
- **Unit тесты**: Jest
- **E2E тесты**: Playwright
- **Интеграционные**: Supertest

## 📄 Лицензия

Этот проект лицензирован под Apache License 2.0 - см. файл [LICENSE](LICENSE) для деталей.

## 🤝 Контрибьюторы

Мы приветствуем контрибьюторов! Пожалуйста, прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) для деталей о процессе контрибуции.

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/joker10451/jnotes/issues)
- **Discussions**: [GitHub Discussions](https://github.com/joker10451/jnotes/discussions)
- **Документация**: [docs/](docs/)

## 🗺️ Roadmap

- [x] Базовая структура монорепо
- [ ] Ink-engine с WASM
- [ ] PDF аннотации
- [ ] AI функции (локальные)
- [ ] Синхронизация CRDT
- [ ] Android приложение
- [ ] Облачная синхронизация
- [ ] Плагинная система

---

**Сделано с ❤️ для сообщества**
