# Arquitetura do Sistema

## Angular + NestJS + Supabase

Documentação técnica da arquitetura recomendada para um sistema de
**gestão de serviços de ar‑condicionado** utilizando:

- **Frontend:** Angular 20 (Standalone)
- **Backend:** NestJS (Node.js + TypeScript)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth (JWT)

---

# Visão Geral da Arquitetura

    Angular (Frontend)
            ↓
    NestJS API (Backend)
            ↓
    Supabase
       ├── Postgres
       ├── Auth
       └── Storage

Fluxo de autenticação:

    Angular
       ↓
    POST /auth/login
       ↓
    NestJS API
       ↓
    Supabase Auth
       ↓
    JWT Token
       ↓
    Angular salva token

---

# Estrutura do Projeto

    project-root
    │
    ├── backend
    │   └── nest-api
    │
    └── frontend
        └── angular-app

---

# Estrutura do Backend (NestJS)

Framework: **NestJS**

Estrutura recomendada:

    backend/nest-api
    │
    ├── src
    │   ├── modules
    │   │    ├── auth
    │   │    ├── users
    │   │    ├── service-orders
    │   │    ├── equipments
    │   │    └── clients
    │   │
    │   ├── common
    │   │    ├── guards
    │   │    ├── interceptors
    │   │    ├── filters
    │   │    └── decorators
    │   │
    │   ├── config
    │   │    └── supabase.config.ts
    │   │
    │   ├── database
    │   │    └── supabase.service.ts
    │   │
    │   ├── app.module.ts
    │   └── main.ts
    │
    └── package.json

---

# Módulos do Backend

## Auth Module

Responsável por:

- Login
- Validação de JWT
- Integração com Supabase Auth

```{=html}
<!-- -->
```

    auth
     ├── auth.controller.ts
     ├── auth.service.ts
     ├── auth.module.ts
     └── dto
          └── login.dto.ts

---

## Users Module

Gerenciamento de usuários.

    users
     ├── users.controller.ts
     ├── users.service.ts
     ├── users.module.ts
     └── entities
          └── user.entity.ts

---

## Service Orders Module

Gerenciamento das ordens de serviço.

    service-orders
     ├── service-orders.controller.ts
     ├── service-orders.service.ts
     ├── service-orders.module.ts
     └── dto
          ├── create-service-order.dto.ts
          └── update-service-order.dto.ts

---

## Equipments Module

Gerenciamento de equipamentos.

    equipments
     ├── equipments.controller.ts
     ├── equipments.service.ts
     ├── equipments.module.ts
     └── dto

---

# Integração com Supabase

Configuração:

    src/config/supabase.config.ts

Exemplo:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);
```

Variáveis de ambiente:

    SUPABASE_URL=https://xxxx.supabase.co
    SUPABASE_ANON_KEY=xxxxx
    SUPABASE_SERVICE_ROLE=xxxxx

---

# Autenticação

Login:

    POST /auth/login

Body:

```json
{
  "email": "user@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "token": "jwt",
  "refreshToken": "token",
  "expiresIn": 3600
}
```

---

# Estrutura do Frontend (Angular)

Angular 20 usando **Standalone Components**.

Estrutura recomendada:

    frontend/angular-app
    │
    ├── src/app
    │
    ├── core
    │   ├── services
    │   ├── interceptors
    │   └── guards
    │
    ├── shared
    │   ├── components
    │   ├── pipes
    │   └── utils
    │
    ├── features
    │   ├── auth
    │   ├── dashboard
    │   ├── service-orders
    │   ├── equipments
    │   └── clients
    │
    └── app.routes.ts

---

# Padrões de Desenvolvimento (Frontend)

## Estrutura de Componentes
Todos os componentes devem seguir o padrão de separação de arquivos para manter a organização e escalabilidade:

1.  **Criação**: Sempre separar HTML, SCSS e TypeScript.
2.  **Arquivos**:
    -   `nome.component.ts`: Lógica e metadados.
    -   `nome.component.html`: Estrutura do template.
    -   `nome.component.scss`: Estilos específicos do componente.
3.  **Configuração**: Usar `templateUrl` e `styleUrl` no decorator `@Component`.

---

# Core Layer

Responsável por:

- comunicação com API
- autenticação
- interceptores HTTP

```{=html}
<!-- -->
```

    core
     ├── api.service.ts
     ├── auth.service.ts
     ├── auth.interceptor.ts
     └── auth.guard.ts

---

# Shared Layer

Componentes reutilizáveis.

    shared
     ├── components
     │   ├── table
     │   ├── card
     │   └── modal
     └── models

---

# Features Layer

Cada funcionalidade vira um módulo.

    features
     ├── dashboard
     ├── service-orders
     ├── equipments
     ├── clients
     └── profile

---

# Fluxo de Login no Frontend

    Angular Login Page
            ↓
    POST /auth/login
            ↓
    NestJS API
            ↓
    Supabase Auth
            ↓
    JWT Token
            ↓
    Angular salva token

Token salvo em:

    localStorage

---

# Interceptor de Token

Todos requests enviam:

    Authorization: Bearer <token>

Exemplo:

```ts
req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

# Rotas do Sistema

Frontend:

    /login
    /dashboard
    /service-orders
    /equipments
    /clients
    /profile

Backend:

    POST   /auth/login
    GET    /users
    POST   /service-orders
    GET    /service-orders
    PUT    /service-orders/:id
    DELETE /service-orders/:id

---

# Deploy Recomendado

Backend:

- Docker
- EasyPanel
- Railway
- Fly.io

Frontend:

- Vercel
- Netlify
- Cloudflare Pages

Banco:

- Supabase

---

# Estrutura Final do Projeto

    project-root
    │
    ├── backend
    │   └── nest-api
    │
    ├── frontend
    │   └── angular-app
    │
    └── docs
        └── arquitetura.md

---

# Próximos Passos

Backend:

- implementar CRUD de ServiceOrders
- integração completa com Supabase
- validação JWT

Frontend:

- tela de login
- tela simples de home
