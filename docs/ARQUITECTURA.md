# Arquitectura del Sistema: EduCart (Desafío Final)

Este documento detalla la arquitectura técnica y el flujo de diseño del proyecto **EduCart**, generado y validado con **Archify**.

---

## 1. Diagramas Interactivos de Arquitectura y Exposición

Los diagramas interactivos HTML autocontenidos están disponibles en:
- 🌐 **Arquitectura Global**: **[educart-architecture.html](file:///home/favo/Documentos/final/docs/educart-architecture.html)** | [`educart-architecture.json`](file:///home/favo/Documentos/final/docs/educart-architecture.json)
- 🖥️ **Deep-Dive Frontend (Flujo & Archivos)**: **[frontend-flow.html](file:///home/favo/Documentos/final/docs/frontend-flow.html)** | [`frontend-flow.json`](file:///home/favo/Documentos/final/docs/frontend-flow.json)
- ⚙️ **Deep-Dive Backend (Ciclo de Vida & Capas)**: **[backend-flow.html](file:///home/favo/Documentos/final/docs/backend-flow.html)** | [`backend-flow.json`](file:///home/favo/Documentos/final/docs/backend-flow.json)


---

## 2. Mapa Estructural del Proyecto

```text
final/
├── backend/                  # Layered Architecture (FastAPI + SQLModel)
│   ├── app/
│   │   ├── core/             # Configuración, DB SessionDep, Security (JWT/Bcrypt), Seeds
│   │   ├── models/           # Esquemas SQLModel (User, Product, Order, OrderItem)
│   │   ├── repositories/     # Capa de Acceso a Datos (Consultas SQLModel / ORM)
│   │   ├── services/         # Capa de Negocio (Validación de stock, transacciones)
│   │   └── routers/          # Capa HTTP REST (Auth, Orders, Products, Dashboard)
│   ├── docker-compose.yml    # PostgreSQL 15 + Backend FastAPI
│   └── requirements.txt
│
└── frontend/                 # Screaming / Feature-Based Architecture (React 19 + Vite)
    └── src/
        ├── components/ui/    # Componentes agnósticos (Button, Input, Card, Badge)
        ├── features/         # Módulos por dominio
        │   ├── auth/         # Login, Registro, AuthSlice, Guards
        │   ├── products/     # Catálogo, ProductCard, Filtros, Paginación
        │   ├── cart/         # Carrito de compras, CartSlice, Widget
        │   ├── checkout/     # Formulario de compra (TanStack Form + Zod)
        │   └── dashboard/    # Panel Admin, Inventario (TanStack Table)
        └── store/            # Redux Store global
```

---

## 3. Aclaración de Base de Datos: PostgreSQL vs MariaDB

En el proyecto **EduCart**:
- **Motor Utilizado**: **PostgreSQL 15** (imagen oficial `postgres:15-alpine` en el puerto `5432` vía Docker Compose).
- **Relación con MariaDB**: **No son lo mismo ni PostgreSQL usa MariaDB**. Son dos motores de base de datos relacionales independientes. El documento de consigna teórica mencionaba la posibilidad de usar MariaDB o MySQL, pero la implementación real del código utiliza PostgreSQL con el driver `psycopg2`/`asyncpg` y el ORM `SQLModel`.
