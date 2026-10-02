# Guía Completa de Exposición y Estudio: Proyecto EduCart
**Materia / Defensa Final de Carrera — Arquitectura Full-Stack**

> Este documento fue redactado como una **guía pedagógica y técnica exhaustiva**. Contiene el desglose conceptual, las funciones básicas de cada tecnología, el circuito exacto de cómo se conectan los datos entre librerías, el ciclo de vida del backend y las respuestas a las preguntas típicas de mesa de examen.

---

## Índice de Contenidos
1. [Resumen Ejecutivo y Pitch de Presentación](#1-resumen-ejecutivo-y-pitch-de-presentación)
2. [El Circuito de los Datos: ¿Cómo se conectan Redux y TanStack Query?](#2-el-circuito-de-los-datos-cómo-se-conectan-redux-y-tanstack-query)
3. [Frontend: Tecnologías, Piezas Clave y Funciones Básicas](#3-frontend-tecnologías-piezas-clave-y-funciones-básicas)
   - React 19 y TypeScript
   - Vite
   - React Router DOM v6 y ProtectedRoute
   - Redux Toolkit y Redux Persist
   - TanStack Query v5 (React Query)
   - Axios y los Interceptores
   - TanStack Form y Zod
4. [Backend: Tecnologías, Piezas Clave y Funciones Básicas](#4-backend-tecnologías-piezas-clave-y-funciones-básicas)
   - FastAPI y el ciclo de vida Lifespan
   - Inyección de Dependencias (`Depends`)
   - SQLModel y SQLAlchemy
   - Pydantic (Esquemas DTO)
   - Seguridad: Bcrypt y JWT (OAuth2)
   - PostgreSQL 15 en Docker
5. [El Ciclo de Vida de una Petición: Arquitectura en Capas](#5-el-ciclo-de-vida-de-una-petición-arquitectura-en-capas)
   - Caso Práctico de Examen: La Transacción Atómica de una Orden
6. [Preguntas Típicas de Profesores y Evaluadores (con Respuesta Óptima)](#6-preguntas-típicas-de-profesores-y-evaluadores)
7. [Cómo apoyar la Exposición con los Diagramas de Archify](#7-cómo-apoyar-la-exposición-con-los-diagramas-de-archify)

---

## 1. Resumen Ejecutivo y Pitch de Presentación

### ¿Cómo abrir la exposición? (Discurso de 1 minuto)
> *"Buenos días / tardes profesores. Hoy voy a presentar el proyecto **EduCart**, una plataforma de comercio electrónico full-stack desarrollada bajo estándares profesionales de la industria.*
> 
> *El proyecto está fundamentado sobre dos pilares arquitectónicos esenciales:*
> 1. *En el **Frontend**, implementamos una **Screaming Architecture** (arquitectura orientada a dominio) construida sobre React 19, TypeScript y Vite, aplicando una **estrategia de estado dual**: separamos estrictamente el estado del cliente y de la interfaz mediante **Redux Toolkit** del estado asíncrono y remoto del servidor mediante **TanStack Query**.*
> 2. *En el **Backend**, diseñamos una **Clean Layered Architecture** (arquitectura en capas estricta) utilizando **FastAPI**, **SQLModel** y **PostgreSQL 15**, donde la capa de transporte HTTP nunca accede directamente a la base de datos, sino que delega en una capa de Servicios transaccionales y en un patrón de Repositorios desacoplados.*
> 
> *A continuación, voy a explicar cómo fluyen los datos y cómo interactúa cada tecnología en el sistema."*

---

## 2. El Circuito de los Datos: ¿Cómo se conectan Redux y TanStack Query?

Esta es una de las preguntas técnicas más importantes que un evaluador puede hacer:
**"Si TanStack Query es quien hace las peticiones al backend para traer los productos, ¿cómo se entera Redux de esos datos para guardarlos en el carrito?"**

### La Distinción Teórica Fundamental
- **Server State (Estado del Servidor - TanStack Query):**
  - Son datos que **no le pertenecen al frontend**; residen en la base de datos PostgreSQL.
  - El frontend sólo tiene una **instantánea temporal (caché)** de esos datos.
  - Puede cambiar en cualquier momento sin que el cliente lo sepa (ej: otro usuario compra stock).
  - Requiere: fetching asíncrono, estados de carga (`isLoading`), control de errores, deduplicación y refetching.
- **Client State (Estado del Cliente / UI - Redux Toolkit):**
  - Son datos que **sólo existen en la sesión del usuario actual**.
  - No están en la base de datos hasta que el usuario decida consolidar una acción.
  - Ejemplos: qué items metió al carrito de compras, si el menú lateral está abierto, o si está logueado localmente.

### El Circuito Paso a Paso en el Código Real

```text
[ PostgreSQL DB ]
       ▲
       │  (1) GET /api/v1/products (HTTP JSON)
       ▼
[ axiosInstance ]
       ▲
       │  (2) Promise resolve
       ▼
[ TanStack Query (useProducts) ] ──── Guarda en Query Cache en memoria
       │
       │  (3) Provee datos reactivos: { data: { items: [Product, ...] } }
       ▼
[ ProductsPage / ProductCard ]
       │
       │  (4) El usuario hace click en "Agregar al Carrito"
       │      dispatch(addToCart({ product, cantidad: 1 }))  <── ¡AQUÍ SE CONECTAN!
       ▼
[ Redux Toolkit (cartSlice) ] ──────── Recibe el objeto 'product' como payload
       │                               Modifica state.items y recalcula totales
       ▼
[ Redux Persist ] ─────────────────── Serializa y guarda en localStorage
       │
       │  (5) Usuario va a /checkout
       ▼
[ CheckoutPage ] ──────────────────── useAppSelector(state => state.cart.items)
       │
       │  (6) Envía POST /api/v1/orders con los IDs y cantidades
       ▼
[ axiosInstance (Bearer JWT) ] ────── Pasa por interceptor y viaja a FastAPI
       │
       ▼
[ Backend OrderService ] ──────────── Transacción atómica: valida y descuenta stock
       │
       │  (7) Respuesta 201 Created
       ▼
[ Frontend Callbacks ] ────────────── dispatch(clearCart())  [Limpia Redux]
                                      queryClient.invalidateQueries() [Refresca TanStack]
```

### Explicación en el Código
1. **TanStack Query obtiene los productos:**
   En [`frontend/src/features/products/hooks/useProducts.ts`](file:///home/favo/Documentos/final/frontend/src/features/products/hooks/useProducts.ts), la función `useProducts()` ejecuta `fetchProducts(filters)` usando `axiosInstance.get('/products')`. TanStack Query guarda la lista de productos en su propia caché indexada por la clave `['products', filters]`.
2. **El Componente React recibe los datos:**
   [`ProductsPage.tsx`](file:///home/favo/Documentos/final/frontend/src/features/products/pages/ProductsPage/ProductsPage.tsx) desestructura `{ data, isLoading } = useProducts(filters)`. Itera los productos y renderiza `<ProductCard key={product.id} product={product} />`.
3. **El Puente hacia Redux (El Evento de Usuario):**
   En [`frontend/src/features/products/components/ProductCard/ProductCard.tsx`](file:///home/favo/Documentos/final/frontend/src/features/products/components/ProductCard/ProductCard.tsx), cuando el usuario hace clic en el botón, se dispara:
   ```typescript
   const dispatch = useAppDispatch();
   const handleAddToCart = (e: React.MouseEvent) => {
     e.preventDefault();
     // Aquí los datos que vinieron por TanStack pasan como Payload a una acción de Redux:
     dispatch(addToCart({ product, cantidad: 1 }));
   };
   ```
4. **Redux procesa y persiste:**
   En [`frontend/src/features/cart/slice/cartSlice.ts`](file:///home/favo/Documentos/final/frontend/src/features/cart/slice/cartSlice.ts), el reducer `addToCart` recibe ese `product`, revisa si ya existía en el carrito (para incrementar la cantidad sin duplicar fila), recalcula `totalAmount` y `totalQuantity`. Gracias a `redux-persist`, este estado se copia automáticamente a `localStorage`.
5. **Cierre del ciclo en Checkout:**
   [`CheckoutPage.tsx`](file:///home/favo/Documentos/final/frontend/src/features/cart/pages/CheckoutPage/CheckoutPage.tsx) lee el carrito con `useAppSelector((state) => state.cart)`. Al pulsar "Finalizar Compra", toma esos items de Redux y hace una mutación HTTP (`axiosInstance.post('/orders', ...)`). Cuando el backend responde exitoso, el frontend ejecuta `dispatch(clearCart())` para vaciar Redux y `queryClient.invalidateQueries({ queryKey: ['inventory'] })` para que TanStack Query refresque el stock actualizado del backend.

---

## 3. Frontend: Tecnologías, Piezas Clave y Funciones Básicas

### A. React 19 y TypeScript
- **¿Qué es?** React es la biblioteca declarativa basada en componentes para construir interfaces de usuario basada en un Virtual DOM. TypeScript añade tipado estático en tiempo de compilación.
- **Partes y Funciones Básicas:**
  - **Componentes Funcionales:** Funciones de JavaScript que reciben `props` y retornan elementos JSX (`<Card>`, `<ProductCard>`).
  - **Hooks Básicos:** 
    - `useState`: Manejo de estado local efímero dentro del componente (ej: si un modal está abierto o cerrado).
    - `useEffect`: Ejecución de efectos secundarios en el ciclo de vida del componente.
    - **Custom Hooks** (`useProducts`, `useInventory`): Encapsulan lógica de negocio y consumo de datos para que los componentes queden limpios y sólo se encarguen de renderizar UI.
  - **Tipos e Interfaces ([`frontend/src/types/index.ts`](file:///home/favo/Documentos/final/frontend/src/types/index.ts)):**
    - `interface Product`: Contrato estricto (`id`, `nombre`, `precio`, `stock_actual`, `categoria`, etc.). Si el backend cambia un campo o el frontend intenta acceder a una propiedad inexistente, TypeScript lanza error antes de compilar.

### B. Vite
- **¿Qué es?** Herramienta de compilación (*bundler*) y servidor de desarrollo moderno.
- **Por qué se eligió sobre Create-React-App:**
  - En desarrollo, no compila todo el proyecto en un único bundle pesado: sirve el código utilizando módulos nativos del navegador (**ES Modules**), logrando arranque instantáneo y Hot Module Replacement (HMR) en milisegundos.
  - En producción, optimiza y empaqueta el código usando **Rollup** con minificación y tree-shaking (eliminación de código muerto).

### C. React Router DOM v6 y ProtectedRoute
- **¿Qué es?** Enrutador declarativo para aplicaciones de una sola página (SPA - *Single Page Application*). Permite cambiar de pantalla sin recargar la página en el navegador.
- **Partes Básicas ([`frontend/src/routes/AppRouter.tsx`](file:///home/favo/Documentos/final/frontend/src/routes/AppRouter.tsx)):**
  - `<BrowserRouter>`: Envuelve la aplicación y sincroniza la UI con la barra de direcciones del navegador mediante la History API de HTML5.
  - `<Routes>` y `<Route path="..." element={<... />} />`: Declaran qué componente se muestra según la URL actual.
  - `useNavigate()`: Hook para navegación programática (ej: tras hacer login exitoso, redirigir al catálogo).
  - `useLocation()`: Permite conocer la ruta actual y leer estados de navegación.
- **El Guard de Seguridad ([`frontend/src/routes/ProtectedRoute.tsx`](file:///home/favo/Documentos/final/frontend/src/routes/ProtectedRoute.tsx)):**
  - Es un componente envoltorio (*Higher-Order Component pattern*):
    ```typescript
    export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
      const { isAuthenticated, user } = useAppSelector((state) => state.auth);
      const location = useLocation();

      if (!isAuthenticated) {
        // Redirige al login guardando la URL intentada para volver luego
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      if (requiredRole && user?.role !== requiredRole) {
        // Si no tiene el rol requerido (ej: ADMIN para el dashboard), lo expulsa
        return <Navigate to="/products" replace />;
      }
      return <>{children}</>;
    };
    ```

### D. Redux Toolkit y Redux Persist
- **¿Qué es?** Redux Toolkit (RTK) es la implementación estándar y moderna de Redux para la gestión del estado global predecible del cliente. Redux Persist sincroniza automáticamente ese estado con el almacenamiento local (`localStorage`).
- **Partes Básicas ([`frontend/src/store/store.ts`](file:///home/favo/Documentos/final/frontend/src/store/store.ts)):**
  - **`configureStore`:** Configura el almacén central (*Store*), combinando los reducers e incorporando middlewares con chequeo de inmutabilidad.
  - **`createSlice`:** Define en un único archivo las acciones y los reducers de un dominio (ej: `authSlice`, `cartSlice`).
  - **`reducers`:** Funciones puras que describen cómo cambia el estado en respuesta a una acción. Gracias a que RTK integra *Immer*, podemos escribir código con sintaxis mutable (`state.totalAmount += precio`) que por debajo produce copias inmutables seguras.
  - **`useAppDispatch` y `useAppSelector`:** Versiones tipadas de los hooks de react-redux para disparar acciones y seleccionar fragmentos del estado global con autocompletado y validación de tipos.
  - **`PersistGate` ([`frontend/src/main.tsx`](file:///home/favo/Documentos/final/frontend/src/main.tsx)):** Detiene el renderizado de la UI una fracción de segundo hasta que el estado guardado en `localStorage` ha sido leído y rehidratado en la memoria de Redux.

### E. TanStack Query v5 (React Query)
- **¿Qué es?** Biblioteca de gestión de estado asíncrono para el manejo de datos del servidor. Elimina la necesidad de escribir manualmente `try/catch`, flags de `isLoading`, `isError` y llamadas repetidas en `useEffect`.
- **Cómo trabaja en conjunto con Axios:**
  - TanStack Query **no realiza peticiones HTTP por sí mismo**. No sabe qué es REST ni qué es HTTP.
  - Lo que hace TanStack Query es coordinar la **gestión de la promesa**. Delega la ejecución de la petición HTTP a **Axios** mediante una función llamada `queryFn` o `mutationFn`.
- **Partes y Funciones Fundamentales:**
  - **`queryKey`:** Arreglo que identifica unívocamente a la consulta (ej: `['products', filters]`). Si los filtros cambian (ej: categoría pasa de "teclados" a "monitores"), la clave cambia y TanStack Query sabe que debe buscar nuevos datos o servirlos de la caché si ya los tenía.
  - **`useQuery` (Lectura / GET):**
    ```typescript
    export const useProducts = (filters: UseProductsFilters = {}) => {
      return useQuery({
        queryKey: ['products', filters],
        queryFn: () => fetchProducts(filters), // Llama a Axios
        staleTime: 1000 * 30, // Los datos se consideran frescos por 30s
      });
    };
    ```
    - Retorna variables de control: `data`, `isLoading` (cargando por primera vez), `isFetching` (actualizando en segundo plano), `isError`, `error`, `refetch`.
  - **`useMutation` (Escritura / POST / PUT / PATCH / DELETE):**
    - Se utiliza para modificar datos en el servidor (ej: en [`features/inventory/hooks/useInventory.ts`](file:///home/favo/Documentos/final/frontend/src/features/inventory/hooks/useInventory.ts) al editar el stock de un producto):
    ```typescript
    const updateMutation = useMutation({
      mutationFn: patchProduct, // Función que hace axiosInstance.patch(...)
      onSuccess: (updatedProduct) => {
        // Invalidación de caché: le dice a TanStack que la lista ya no es válida
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
    });
    ```
  - **`queryClient.invalidateQueries`:**
    - Es la función maestra de sincronización: marca las consultas coincidentes como "obsoletas" (*stale*) y, si hay componentes mostrándolas en pantalla, vuelve a consultar al servidor automáticamente para traer la información más reciente.

### F. Axios y los Interceptores
- **¿Qué es?** Cliente HTTP basado en promesas para el navegador y Node.js.
- **Por qué no usar `fetch` nativo:**
  - Axios parsea automáticamente las respuestas JSON (no requiere hacer `.json()`).
  - Lanza excepciones automáticas en códigos de estado de error HTTP (4xx y 5xx), a diferencia de `fetch` que requiere verificar `response.ok`.
  - Soporta cancelación de peticiones, tiempos de espera (*timeout*) e interceptores centralizados.
- **Los Interceptores ([`frontend/src/lib/axiosInstance.ts`](file:///home/favo/Documentos/final/frontend/src/lib/axiosInstance.ts)):**
  - **Request Interceptor (Inyección de Seguridad):** Se ejecuta **antes** de que la petición salga del navegador. Lee el token JWT guardado en `localStorage` o en el estado persistido de Redux y lo adjunta en los encabezados HTTP:
    ```typescript
    axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    ```
  - **Response Interceptor (Gestión Centralizada de Errores):** Se ejecuta cuando la respuesta llega del backend. Si detecta un error `401 Unauthorized` (token expirado o inválido), puede disparar la limpieza de la sesión o advertir al sistema de forma unificada.

### G. TanStack Form y Zod
- **¿Qué son?** TanStack Form maneja el estado reactivo de los formularios (valores, si fueron tocados, si están sucios, validaciones en tiempo real). **Zod** es una biblioteca de declaración de esquemas y validación de tipos en tiempo de ejecución.
- **Uso en el Checkout ([`frontend/src/features/cart/pages/CheckoutPage/CheckoutPage.tsx`](file:///home/favo/Documentos/final/frontend/src/features/cart/pages/CheckoutPage/CheckoutPage.tsx)):**
  - Se define un esquema Zod que garantiza que los campos obligatorios cumplan con expresiones regulares (ej: formato de email, teléfono de 7 a 15 dígitos) y valida reglas cruzadas como `refine((data) => data.email === data.confirmarEmail)`.
  - Evita enviar al backend peticiones con datos incompletos o malformados, reduciendo tráfico innecesario.

---

## 4. Backend: Tecnologías, Piezas Clave y Funciones Básicas

### A. FastAPI y el Ciclo de Vida Lifespan
- **¿Qué es?** FastAPI es un framework web en Python moderno y de alto rendimiento para construir APIs REST, basado en estándares abiertos: **OpenAPI** (para la especificación interactiva en `/docs`) y **JSON Schema**.
- **Partes Básicas ([`backend/app/main.py`](file:///home/favo/Documentos/final/backend/app/main.py)):**
  - **Instancia de Aplicación:** `app = FastAPI(title="EduCart API", ...)`
  - **Ciclo de Vida `lifespan`:**
    ```python
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        # Startup: Se ejecuta al encender el servidor
        init_db()  # Crea tablas en PostgreSQL y carga semillas de productos/usuarios
        yield
        # Shutdown: Se ejecuta al apagar el servidor (cierre de pools, etc.)
    ```
  - **`CORSMiddleware`:** Configura el mecanismo de *Cross-Origin Resource Sharing*, permitiendo que la aplicación frontend (ej: corriendo en `http://localhost:5173`) pueda consumir los endpoints de la API (en `http://localhost:8000`) sin ser bloqueada por la política de mismo origen del navegador.
  - **`APIRouter` e `include_router`:** Permite dividir los endpoints en controladores modulares por dominio (`auth_router`, `product_router`, `order_router`, `dashboard_router`) con prefijos comunes (ej: `/api/v1`).

### B. Inyección de Dependencias (`Depends`)
- **¿Qué es?** Es una de las características estrella de FastAPI. Permite declarar lo que un endpoint necesita para funcionar y dejar que el framework resuelva y provea esas dependencias de manera limpia, reutilizable y desacoplada.
- **Partes Básicas ([`backend/app/routers/deps.py`](file:///home/favo/Documentos/final/backend/app/routers/deps.py)):**
  1. **Inyección de la Sesión de Base de Datos (`get_db`):**
     ```python
     def get_db() -> Generator[Session, None, None]:
         with Session(engine) as session:
             yield session
     ```
     - Gracias al `with` y al `yield`, FastAPI crea una sesión al recibir la solicitud y **garantiza que se cierre** al finalizar, liberando la conexión al pool de PostgreSQL incluso si ocurre un error.
  2. **Inyección del Usuario Autenticado (`get_current_user`):**
     ```python
     def get_current_user(
         token: str = Depends(oauth2_scheme),
         session: Session = Depends(get_db)
     ) -> User:
         # Valida el JWT con security.py, busca el ID en UserRepository y retorna el User
     ```
     - Si el endpoint requiere autenticación, simplemente declara `current_user: User = Depends(get_current_user)`. Si el token falta o es inválido, FastAPI responde `401 Unauthorized` de forma automática sin llegar a ejecutar el cuerpo del endpoint.
  3. **Control de Roles (`get_current_active_admin`):**
     - Depende de `get_current_user`. Verifica que `current_user.role == UserRole.ADMIN`. Si no lo es, responde `403 Forbidden`.

### C. SQLModel y SQLAlchemy
- **¿Qué es SQLModel?**
  - Creado por **Sebastián Ramírez** (el mismo autor de FastAPI).
  - Resuelve el problema histórico de tener que duplicar código definiendo **modelos de SQLAlchemy** (para las tablas de la BD) y **modelos de Pydantic** (para la validación de la API).
  - En SQLModel, **una sola clase de Python sirve para ambas cosas**.
- **Cómo se relaciona con SQLAlchemy:**
  - SQLModel **no reemplaza a SQLAlchemy**: está construido directamente encima de él.
  - Utiliza el motor de SQLAlchemy (`create_engine`) y su sistema de sesiones (`Session`).
- **Partes Básicas ([`backend/app/models/product.py`](file:///home/favo/Documentos/final/backend/app/models/product.py)):**
  ```python
  class Product(SQLModel, table=True):
      __tablename__ = "products"
      
      id: Optional[int] = Field(default=None, primary_key=True)
      nombre: str = Field(index=True, max_length=150)
      precio: float = Field(ge=0.0)
      stock_actual: int = Field(ge=0)
      categoria: str = Field(index=True)
  ```
  - `table=True`: Le indica a SQLAlchemy que cree una tabla física en PostgreSQL.
  - `Field(ge=0)`: Regla de validación de Pydantic (el precio no puede ser menor a 0).
  - **Operaciones del ORM:**
    - `select(Product).where(Product.categoria == "Laptops")`: Construye consultas SQL tipadas y protegidas contra inyecciones SQL.
    - `session.exec(statement)`: Ejecuta la consulta contra PostgreSQL.
    - `session.add(instancia)`: Encola una entidad para ser insertada o actualizada.
    - `session.commit()`: Confirma los cambios de la transacción en la base de datos.
    - `session.rollback()`: Deshace todas las operaciones de la transacción si ocurrió un error.

### D. Pydantic (Esquemas DTO - Data Transfer Objects)
- **¿Por qué separar Modelos de Esquemas? ([`backend/app/schemas/`](file:///home/favo/Documentos/final/backend/app/schemas/))**
  - Aunque SQLModel permite unificar, por seguridad y buenas prácticas se utilizan esquemas Pydantic dedicados para el transporte HTTP:
    - **Esquema de Entrada (`UserCreate`):** Recibe `email`, `nombre` y `password` en texto plano.
    - **Modelo de Base de Datos (`User`):** Guarda `email`, `nombre` y `hashed_password`.
    - **Esquema de Salida (`UserResponse`):** Retorna `id`, `email`, `nombre`, `role` y **omite por completo la contraseña**, evitando fugas de información sensible.

### E. Seguridad: Bcrypt y JWT (OAuth2)
- **Hashing de Contraseñas ([`backend/app/core/security.py`](file:///home/favo/Documentos/final/backend/app/core/security.py)):**
  - Se utiliza la librería **Passlib** con el algoritmo **Bcrypt** (`CryptContext(schemes=["bcrypt"])`).
  - Las contraseñas nunca se almacenan en texto claro. Bcrypt aplica un valor aleatorio (*salt*) y múltiples rondas de hash computacionalmente costosas para prevenir ataques de diccionario o tablas arcoíris (*rainbow tables*).
  - `verify_password(plain, hashed)`: Compara la contraseña ingresada con el hash guardado sin necesidad de descifrarlo.
- **Tokens JWT (JSON Web Tokens):**
  - Se generan con **PyJWT** usando el algoritmo simétrico **HS256** y una clave secreta (`SECRET_KEY`).
  - **Estructura del Token:**
    1. *Header:* Algoritmo y tipo de token.
    2. *Payload:* Datos públicos no sensibles (*claims*), como el ID del usuario (`sub`) y la fecha de expiración (`exp`).
    3. *Firma:* Cifrado del Header + Payload con la `SECRET_KEY` para certificar que nadie alteró el token en el camino.
  - Es **Stateless (sin estado):** El servidor backend no necesita consultar una tabla de sesiones activas en la BD para saber quién es el usuario; basta con verificar matemáticamente la firma del token.

### F. PostgreSQL 15 en Docker
- **¿Por qué PostgreSQL?** Es uno de los sistemas gestores de bases de datos relacionales más potentes y fiables del mundo. Ofrece cumplimiento estricto del estándar SQL, soporte íntegro para transacciones **ACID** (Atomicidad, Consistencia, Aislamiento y Durabilidad) y control de concurrencia multiversión (MVCC).
- **Por qué en Docker ([`backend/docker-compose.yml`](file:///home/favo/Documentos/final/backend/docker-compose.yml)):**
  - **Aislamiento e Inmutabilidad:** Garantiza que la base de datos se ejecute en la misma versión exacta (`postgres:15-alpine`), con las mismas extensiones y configuración tanto en la máquina del desarrollador como en producción o en la mesa de examen.
  - **Persistencia de Datos:** Utiliza un volumen montado de Docker (`postgres_data:/var/lib/postgresql/data`) para que, al reiniciar o apagar el contenedor, la información y los registros no se pierdan.

---

## 5. El Ciclo de Vida de una Petición: Arquitectura en Capas

El backend de EduCart sigue una separación estricta de 4 capas:

```text
1. Router (HTTP) ──> 2. Service (Negocio) ──> 3. Repository (Datos) ──> 4. Model / Database
```

| Capa | Responsabilidad | Lo que NUNCA debe hacer |
|---|---|---|
| **Routers** | Recibir la petición HTTP, validar el DTO con Pydantic, invocar dependencias de seguridad y devolver códigos de estado (200, 201, 404). | **Nunca** ejecutar consultas SQL ni contener lógica de cálculo de negocio. |
| **Services** | Implementar las reglas de negocio puras, coordinar múltiples repositorios y gestionar transacciones complejas. | **Nunca** leer headers HTTP ni depender de objetos como `Request` o `Response`. |
| **Repositories** | Aislar las consultas de base de datos (`select`, `session.add`, filtros SQLModel). | **Nunca** validar permisos de usuario ni contener reglas de negocio. |
| **Models** | Definir la estructura de las tablas, relaciones y tipos de datos en PostgreSQL. | **Nunca** contener lógica de aplicación. |

---

### Caso Práctico de Examen: La Transacción Atómica de una Orden
En [`backend/app/services/order_service.py`](file:///home/favo/Documentos/final/backend/app/services/order_service.py), el método `create_order` es el mejor ejemplo para explicar la robustez del backend:

```python
def create_order(self, user_id: int, data: OrderCreate) -> Order:
    # 1. Verificar existencia del usuario
    user = self.user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    try:
        # 2. FASE DE VERIFICACIÓN PREVIA (Evita estados inconsistentes)
        # Se comprueba que TODOS los productos existan y tengan stock suficiente
        for item in data.items:
            product = self.product_repo.get_by_id(item.product_id)
            if not product or product.stock_actual < item.cantidad:
                raise HTTPException(status_code=400, detail=f"Stock insuficiente para {product.nombre}")

        # 3. FASE DE DESCUENTO ATÓMICO
        for item in data.items:
            self.product_repo.descontar_stock(item.product_id, item.cantidad)

        # 4. CREACIÓN DEL PEDIDO Y SUS DETALLES
        order = self.order_repo.create(user_id=user_id, items=data.items)

        # 5. COMMIT DE LA TRANSACCIÓN
        self.session.commit()
        return order

    except Exception as e:
        # En caso de cualquier falla imprevista, ROLLBACK total
        self.session.rollback()
        raise e
```

**Por qué esto impresiona a los evaluadores:**
Demuestra que el sistema previene condiciones de carrera y no deja la base de datos en un estado corrupto (por ejemplo, cobrar una orden donde se descontaron 2 productos pero el tercero no tenía stock). **O se guarda todo, o no se guarda nada (Atomicidad ACID)**.

---

## 6. Preguntas Típicas de Profesores y Evaluadores

### Pregunta 1: "¿Por qué usan Redux y TanStack Query al mismo tiempo? ¿No es redundante tener dos manejadores de estado?"
**Respuesta:**
> *"No es redundante porque gestionan dos naturalezas de estado completamente distintas. Redux Toolkit está optimizado para el **Client State**: datos síncronos propios de la interacción del usuario como el carrito de compras o la sesión activa, los cuales persistimos en `localStorage` con Redux Persist.*
> 
> *TanStack Query está especializado en **Server State**: datos asíncronos y remotos de la base de datos (catálogo, filtros, inventario). Si usáramos Redux para los productos, tendríamos que escribir manualmente reducers para `loading`, `success`, `error`, crear variables de caché, implementar temporizadores para revalidar datos y gestionar cancelaciones. TanStack Query resuelve todo eso de forma declarativa con su motor de caché inteligente y `invalidateQueries`."*

---

### Pregunta 2: "¿Qué pasa si un usuario malintencionado modifica el precio de un producto en el frontend antes de enviar la orden?"
**Respuesta:**
> *"El sistema es inmune a esa manipulación porque aplicamos el principio de **cero confianza en el cliente (*Zero Trust Client*)**. Aunque el frontend envíe datos en el payload, la capa de Servicios en el backend (`OrderService`) consulta directamente en la base de datos PostgreSQL el precio unitario real vigente al momento de procesar la compra y recalcula el total en el servidor. Nunca se confía en los precios o importes enviados desde el navegador."*

---

### Pregunta 3: "¿Dónde reside la seguridad del sistema? ¿En el frontend o en el backend?"
**Respuesta:**
> *"La seguridad real y definitiva reside **exclusivamente en el Backend**. Las protecciones del Frontend con `ProtectedRoute` y los interceptores de Axios son únicamente mejoras de **Experiencia de Usuario (UX)** para no mostrar pantallas a las que no se tiene acceso.*
> 
> *Cualquier atacante podría saltarse el frontend usando herramientas como cURL o Postman. Por eso, cada endpoint en FastAPI valida criptográficamente el token JWT a través de la inyección de dependencias `Depends(get_current_user)` y `Depends(get_current_active_admin)`, bloqueando a nivel de protocolo HTTP cualquier petición no autorizada con códigos 401 o 403."*

---

### Pregunta 4: "¿Por qué implementar el patrón Repositorio si SQLModel ya es un ORM?"
**Respuesta:**
> *"Para garantizar el **desacoplamiento arquitectónico** y cumplir con el principio de responsabilidad única de SOLID. Si colocáramos las consultas `select()` dentro de los servicios o de los routers, la lógica de negocio quedaría fuertemente acoplada a la tecnología de base de datos.*
> 
> *Al aislar el acceso a datos en repositorios (`UserRepository`, `ProductRepository`), si el día de mañana cambiamos la forma de consultar, optimizamos con índices o cambiamos de ORM, la capa de servicios y la capa de routers permanecen intactas."*

---

### Pregunta 5: "¿Por qué el token JWT no se almacena en una base de datos en el backend?"
**Respuesta:**
> *"Porque el protocolo JWT está diseñado para ser **Stateless (sin estado)**. Toda la información necesaria para autenticar al usuario (su identificador y fecha de expiración) viaja dentro del propio token en el payload, protegida por una firma criptográfica con algoritmo HS256.*
> 
> *El backend solo necesita verificar la firma utilizando su clave secreta. Esto permite que el backend sea horizontalmente escalable, ya que cualquier instancia del servidor puede validar la petición sin necesidad de consultar una tabla de sesiones compartida."*

---

## 7. Cómo apoyar la Exposición con los Diagramas de Archify

Durante tu presentación, proyecta los dos diagramas interactivos HTML generados en la carpeta `docs/`:

1. **Al hablar del Frontend:**
   - Abre: [`docs/frontend-flow.html`](file:///home/favo/Documentos/final/docs/frontend-flow.html)
   - Haz clic en la pestaña superior **"1. Entrada y Enrutamiento Protegido"** para mostrar cómo viaja el usuario por `main.tsx`, `AppRouter` y `ProtectedRoute`.
   - Luego haz clic en **"2. Petición de Datos y Backend"** para mostrar cómo `useProducts` llama a `axiosInstance` con el token JWT inyectado y cómo `addToCart` enlaza con Redux.
2. **Al hablar del Backend:**
   - Abre: [`docs/backend-flow.html`](file:///home/favo/Documentos/final/docs/backend-flow.html)
   - Haz clic en la pestaña superior **"1. Ciclo de Vida de Petición"** para recorrer la ruta completa: `main.py` ➔ `routers` ➔ `services` ➔ `repositories` ➔ `PostgreSQL`.
   - Luego haz clic en **"2. Seguridad e Inyección"** para explicar cómo `deps.py` y `security.py` protegen la entrada a las rutas.
