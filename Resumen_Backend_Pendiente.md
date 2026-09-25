# Backend - Pendientes para Completar el Proyecto / practica

## Completado ✅

### Base de Datos

- Tabla users
- Roles ADMIN / OPERATIVO
- Eliminación lógica
- Bcrypt

### Archivos terminados

- config/database.js
- models/usersModel.js
- validators/usersValidator.js
- utils/jwt.js
- services/authService.js
- controllers/authController.js
- routes/authRoutes.js

### Pruebas realizadas

- Registro de usuario
- Validación de correo duplicado
- Login
- Generación de JWT
- Inserción en SQL Server

---

## Pendiente #1: authMiddleware.js

Objetivo:

- Validar JWT
- Validar expiración
- Cargar usuario autenticado en req.user

Funciones esperadas:

- authMiddleware()

Pruebas:

- Token válido
- Token inválido
- Sin token

---

## Pendiente #2: roleMiddleware.js

Objetivo:

- Restringir acceso según rol

Funciones sugeridas:

- isAdmin()
- isAdminOrOperativo()

Pruebas:

- ADMIN accede
- OPERATIVO bloqueado en rutas administrativas

---

## Pendiente #3: usersService.js

Funciones:

- getUsers()
- getUserById()
- updateUser()
- deleteUser()
- getDeletedUsers()
- restoreUser()

---

## Pendiente #4: usersController.js

Funciones:

- getUsers()
- getUserById()
- updateUser()
- deleteUser()
- getDeletedUsers()
- restoreUser()

---

## Pendiente #5: usersRoutes.js

Endpoints:

GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
GET /api/users/deleted
PATCH /api/users/:id/restore

---

## Pendiente #6: Integración app.js

Agregar:

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

---

## Pendiente #7: Pruebas Thunder Client

### Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

### Users

GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
GET /api/users/deleted
PATCH /api/users/:id/restore

---

## Pendiente #8: Restricciones por Rol

OPERATIVO

- Ver sus datos
- Modificar sus datos

No puede:

- Eliminar usuarios
- Restaurar usuarios
- Editar otros usuarios

ADMIN

- Ver todos
- Editar todos
- Eliminar todos
- Restaurar todos

---

## Pendiente #9: Función Extra

Recuperación de usuarios eliminados.

Ruta:
PATCH /api/users/:id/restore

---

## Pendiente #10: Logout con invalidación de JWT

Fase actual:

- Logout simple ✅

Fase futura:

- Blacklist de tokens
- Invalidación real de JWT

---

## Orden recomendado de desarrollo

1. authMiddleware.js
2. roleMiddleware.js
3. usersService.js
4. usersController.js
5. usersRoutes.js
6. Integrar rutas en app.js
7. Pruebas con Thunder Client
8. Restricciones ADMIN / OPERATIVO
9. Recuperación de usuarios
10. Logout avanzado

---

## Estado estimado

Backend completado: 65% - 70%

Lo más importante que falta:

- Middleware JWT
- Middleware Roles
- CRUD completo de usuarios
- Restricciones por rol
- Recuperación de usuarios
