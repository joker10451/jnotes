# JNotes API Documentation

## Обзор

JNotes API построен на NestJS с использованием Prisma ORM и PostgreSQL. API предоставляет RESTful интерфейс для управления блокнотами, страницами, рукописным вводом и AI функциями.

## Базовый URL

```
http://localhost:3001/api
```

## Аутентификация

API использует JWT токены для аутентификации. Включите токен в заголовок Authorization:

```
Authorization: Bearer <your-jwt-token>
```

## Эндпоинты

### Аутентификация

#### POST /auth/register
Регистрация нового пользователя.

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword"
}
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null
  }
}
```

#### POST /auth/login
Вход в систему.

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null
  }
}
```

#### POST /auth/profile
Получение профиля пользователя (требует аутентификации).

**Ответ:**
```json
{
  "userId": "cuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Блокноты

#### GET /notebooks
Получение списка блокнотов пользователя.

**Ответ:**
```json
[
  {
    "id": "cuid",
    "title": "Мой блокнот",
    "description": "Описание блокнота",
    "color": "#6366f1",
    "icon": "📝",
    "isPublic": false,
    "createdAt": "2025-01-16T10:00:00.000Z",
    "updatedAt": "2025-01-16T10:00:00.000Z",
    "tags": [
      {
        "tag": {
          "id": "cuid",
          "name": "Работа",
          "color": "#6366f1"
        }
      }
    ],
    "_count": {
      "pages": 5
    }
  }
]
```

#### POST /notebooks
Создание нового блокнота.

**Тело запроса:**
```json
{
  "title": "Новый блокнот",
  "description": "Описание блокнота",
  "color": "#6366f1",
  "icon": "📝",
  "isPublic": false,
  "tagIds": ["tag-id-1", "tag-id-2"]
}
```

#### GET /notebooks/:id
Получение конкретного блокнота.

#### PATCH /notebooks/:id
Обновление блокнота.

#### DELETE /notebooks/:id
Удаление блокнота.

#### GET /notebooks/:id/pages
Получение страниц блокнота.

### Страницы

#### POST /pages
Создание новой страницы.

**Тело запроса:**
```json
{
  "title": "Новая страница",
  "content": {
    "background": "white",
    "template": "blank"
  },
  "pageNumber": 1,
  "notebookId": "notebook-id"
}
```

#### GET /pages/:id
Получение страницы с содержимым.

**Ответ:**
```json
{
  "id": "cuid",
  "title": "Страница 1",
  "content": {
    "background": "white",
    "template": "blank"
  },
  "pageNumber": 1,
  "createdAt": "2025-01-16T10:00:00.000Z",
  "updatedAt": "2025-01-16T10:00:00.000Z",
  "strokes": [
    {
      "id": "cuid",
      "points": [
        {"x": 100, "y": 100, "pressure": 0.5, "tilt": 0},
        {"x": 200, "y": 150, "pressure": 0.7, "tilt": 15}
      ],
      "color": "#000000",
      "width": 2.0,
      "opacity": 1.0,
      "tool": "pen",
      "layer": 0
    }
  ],
  "textBlocks": [],
  "images": [],
  "audioSpans": [],
  "pdfAttachments": [],
  "annotations": []
}
```

#### PATCH /pages/:id
Обновление страницы.

#### DELETE /pages/:id
Удаление страницы.

#### POST /pages/:id/strokes
Добавление штриха на страницу.

**Тело запроса:**
```json
{
  "points": [
    {"x": 100, "y": 100, "pressure": 0.5, "tilt": 0},
    {"x": 200, "y": 150, "pressure": 0.7, "tilt": 15}
  ],
  "color": "#000000",
  "width": 2.0,
  "opacity": 1.0,
  "tool": "pen",
  "layer": 0
}
```

#### POST /pages/:id/text-blocks
Добавление текстового блока.

**Тело запроса:**
```json
{
  "content": "Текст заметки",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 50,
  "fontSize": 16,
  "fontFamily": "Arial",
  "color": "#000000",
  "isOcr": false
}
```

#### POST /pages/:id/annotations
Добавление аннотации PDF.

**Тело запроса:**
```json
{
  "type": "highlight",
  "content": "Важная информация",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 20,
  "color": "#ffff00",
  "opacity": 0.5,
  "pageNumber": 1
}
```

## Модели данных

### User
```typescript
{
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Notebook
```typescript
{
  id: string;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

### Page
```typescript
{
  id: string;
  title: string;
  content?: any; // JSON
  pageNumber: number;
  createdAt: Date;
  updatedAt: Date;
  notebookId: string;
}
```

### Stroke
```typescript
{
  id: string;
  points: Array<{
    x: number;
    y: number;
    pressure: number;
    tilt: number;
    timestamp: number;
  }>;
  color: string;
  width: number;
  opacity: number;
  tool: 'pen' | 'highlighter' | 'eraser';
  layer: number;
  createdAt: Date;
  pageId: string;
}
```

### TextBlock
```typescript
{
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isOcr: boolean;
  createdAt: Date;
  pageId: string;
}
```

### Annotation
```typescript
{
  id: string;
  type: 'highlight' | 'underline' | 'note' | 'arrow' | 'rectangle' | 'circle';
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  pageNumber: number;
  createdAt: Date;
  pageId: string;
}
```

## Коды ошибок

- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Не найдено
- `500` - Внутренняя ошибка сервера

## Примеры использования

### Создание блокнота с первой страницей

```javascript
// 1. Создание блокнота
const notebook = await fetch('/api/notebooks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Мой первый блокнот',
    description: 'Блокнот для заметок',
    color: '#6366f1'
  })
});

// 2. Создание первой страницы
const page = await fetch('/api/pages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Страница 1',
    pageNumber: 1,
    notebookId: notebook.id
  })
});

// 3. Добавление штриха
const stroke = await fetch(`/api/pages/${page.id}/strokes`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    points: [
      { x: 100, y: 100, pressure: 0.5, tilt: 0 },
      { x: 200, y: 150, pressure: 0.7, tilt: 15 }
    ],
    color: '#000000',
    width: 2.0,
    tool: 'pen'
  })
});
```

## WebSocket события

API также поддерживает WebSocket соединения для real-time синхронизации:

- `stroke:created` - Новый штрих добавлен
- `stroke:updated` - Штрих обновлен
- `stroke:deleted` - Штрих удален
- `page:updated` - Страница обновлена
- `collaboration:user:joined` - Пользователь присоединился к сессии
- `collaboration:user:left` - Пользователь покинул сессию

---

*Последнее обновление: 16.09.2025*
