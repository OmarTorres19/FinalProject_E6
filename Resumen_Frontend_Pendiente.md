# Frontend - Estado y Pendientes para Completar el Proyecto

Este documento resume el estado de la aplicación React ubicada en `frontend/`.
para que cualquier integrante del equipo pueda identificar qué funciona,
qué falta y qué tareas dependen de cambios en el backend.

## Completado ✅

### Arquitectura y organización

- Frontend separado en la carpeta `frontend/`.
- Aplicación construida con React y Vite.
- Separación por `pages`, `components` y `api`.
- Cliente HTTP centralizado en `src/api/apiClient.js`.
- Variables de entorno mediante `VITE_API_URL`.
- Archivos HTML, CSS y JavaScript del proyecto anterior retirados.

### Autenticación

- Formulario de registro.
- Formulario de inicio de sesión.
- Almacenamiento del JWT y del usuario en `localStorage`.
- Restauración de la sesión al recargar la aplicación.
- Comprobación local de expiración del JWT.
- Envío automático de `Authorization: Bearer <token>`.
- Limpieza de sesión cuando la API responde `401`.
- Cierre de sesión local aunque el backend no responda.

### Navegación y roles

- `ProtectedRoute` para usuarios autenticados.
- `AdminRoute` para rutas exclusivas del administrador.
- Redirección del usuario `OPERATIVO` a `/dashboard`.
- Redirección del usuario `ADMIN` a `/users`.
- Home adaptado al estado de autenticación y al rol.
- Un operativo solo puede abrir la edición de su propio ID desde la interfaz.

### Interfaces

- Home.
- Registro.
- Login.
- Dashboard React para usuarios operativos.
- Galería de usuarios para administradores.
- Tabla alternativa de usuarios.
- Formulario de edición de usuario.
- Eliminación lógica desde la interfaz.
- Lista de usuarios eliminados.
- Restauración de usuarios eliminados.
- Estados visuales de carga, error, lista vacía y guardado.

### Calidad y despliegue

- ESLint configurado y sin errores actuales.
- Compilación de producción con Vite funcionando.
- `vercel.json` para las rutas de la SPA.
- Workflow de GitHub Actions para desplegar el frontend en Vercel.

---

## Pendiente #1: Completar el detalle individual de expedientes

Estado actual:

- `Dashboard.jsx` ya existe en React.
- `criminalsApi.js` consulta `GET /api/criminals`.
- El backend ya expone los tres expedientes del dashboard antiguo.
- La galería, imágenes, niveles de peligro y skeletons ya están integrados.

Frontend pendiente:

- Agregar navegación al expediente individual.
- Crear una página React para el detalle del expediente.
- Agregar estados de imagen ausente y datos incompletos.

Dependencia del backend: **Sí**.

Endpoints sugeridos:

```text
GET /api/criminals/:id
```

---

## Pendiente #2: Probar el flujo completo con una cuenta ADMIN

Estado actual:

- Los registros públicos reciben el rol `OPERATIVO` por defecto.
- La ruta `/users` ya está restringida visualmente a `ADMIN`.
- Las interfaces administrativas están implementadas.

Pruebas pendientes:

- Login con una cuenta `ADMIN` real.
- Carga de galería y tabla.
- Edición de otro usuario.
- Eliminación lógica.
- Consulta de eliminados.
- Restauración.
- Bloqueo de un operativo al intentar abrir rutas administrativas.

Dependencia del backend/base de datos: **Sí**, se necesita una cuenta ADMIN.

---

## Pendiente #3: Seguridad real de las operaciones por rol

El frontend oculta y protege las rutas visuales, pero eso no evita que alguien
llame manualmente a la API.

Pendiente del backend:

- Validar el JWT en todas las rutas de usuarios.
- Permitir que un operativo consulte y edite solamente su propia cuenta.
- Permitir que solamente un administrador liste, elimine y restaure usuarios.
- Responder `401` para una sesión inválida y `403` para permisos insuficientes.

Frontend pendiente después de definir esas respuestas:

- Mostrar un mensaje específico para errores `403`.
- Verificar todas las redirecciones con respuestas reales del servidor.

Dependencia del backend: **Sí, obligatoria antes de producción**.

---

## Pendiente #4: Evitar datos sensibles en la respuesta de usuarios

La API actual puede devolver campos que el frontend no necesita, como contraseña
cifrada y datos de recuperación. React no los muestra, pero siguen llegando al
navegador y pueden verse en la pestaña Network.

Respuesta esperada para una tarjeta:

```json
{
  "id": 1,
  "nombre": "Usuario",
  "correo": "usuario@ejemplo.com",
  "rol": "OPERATIVO"
}
```

Dependencia del backend: **Sí, obligatoria antes de producción**.

---

## Pendiente #5: Definir administración de roles

Decisión pendiente del equipo:

- Mantener los roles asignados solamente desde la base de datos; o
- Permitir que un administrador cambie `ADMIN` / `OPERATIVO` desde `EditUser`.

Si se permite editar roles:

- Agregar un selector de rol en `EditUser.jsx` solo para administradores.
- Validar los valores permitidos.
- Evitar que el último administrador se quite su propio rol.
- Actualizar el endpoint `PUT /api/users/:id` para aceptar el rol.

Dependencia del backend: **Sí**.

---

## Pendiente #6: Completar el cierre de sesión seguro

Completado en frontend:

- Se eliminan el token y el usuario de `localStorage`.
- React actualiza inmediatamente el estado de autenticación.

Pendiente:

- Invalidar el token en el servidor.
- Definir blacklist, sesión o estrategia de refresh tokens.
- Probar que un token cerrado ya no pueda utilizarse.

Dependencia del backend: **Sí**.

---

## Pendiente #7: Mejorar formularios y mensajes

Frontend pendiente:

- Confirmación de contraseña durante el registro.
- Mensaje de registro exitoso antes de enviar al login.
- Mensajes diferenciados para servidor apagado, validación y permisos.
- Normalizar correos y espacios antes del envío.
- Confirmación visual propia en lugar de `window.confirm` para eliminar.
- Evitar envíos duplicados en todas las acciones.
- Revisar textos para utilizar un solo idioma en toda la aplicación.

Dependencia del backend: **No**, salvo para validar mensajes de error reales.

---

## Pendiente #8: Pruebas automatizadas

Actualmente no existen pruebas automatizadas en `frontend/`.

Herramientas sugeridas:

- Vitest.
- React Testing Library.
- MSW o mocks del cliente API.

Pruebas mínimas:

- Registro correcto y registro con error.
- Login `OPERATIVO` y redirección a `/dashboard`.
- Login `ADMIN` y redirección a `/users`.
- Rutas sin token.
- Rutas administrativas con rol operativo.
- Token expirado.
- Respuesta `401`.
- Carga y error de usuarios.
- Edición administrativa.
- Eliminación y restauración.
- Cierre de sesión.

Dependencia del backend: **No** para pruebas unitarias; **sí** para pruebas E2E.

---

## Pendiente #9: Revisión visual, accesibilidad y dispositivos

- Probar móvil, tableta y escritorio.
- Verificar navegación completa con teclado.
- Revisar contraste y estados `focus`.
- Agregar textos alternativos definitivos a las imágenes de expedientes.
- Verificar que tabla y formularios no se desborden.
- Probar estados de carga con conexiones lentas.
- Revisar la aplicación en Chrome, Edge y Firefox.

Dependencia del backend: **No** para la mayor parte de estas pruebas.

---

## Pendiente #10: Despliegue real en Vercel

Configuración pendiente:

- Crear o vincular el proyecto frontend en Vercel.
- Configurar `VERCEL_TOKEN` en GitHub Actions.
- Configurar `VERCEL_ORG_ID`.
- Configurar `VERCEL_FRONTEND_PROJECT_ID`.
- Definir `VITE_API_URL` con la URL pública del backend.
- Ejecutar el workflow desde `main`.
- Probar recarga directa en todas las rutas de React.
- Verificar CORS entre las URLs finales.

Dependencia del backend: **Sí**, para disponer de una URL pública de la API.

---

## Pendiente #11: Limpieza final de Git

- Registrar correctamente el cambio de `react-app/` a `frontend/`.
- Confirmar que `frontend/node_modules/` y `frontend/dist/` permanezcan ignorados.
- Revisar que no se suban archivos `.env`.
- Crear un commit exclusivo para la separación y limpieza del frontend.
- Revisar los workflows antes de fusionar a `main`.

Dependencia del backend: **No**, siempre que no se alteren sus archivos pendientes.

---

## Orden recomendado de trabajo

1. Conseguir una cuenta ADMIN de prueba.
2. Probar el CRUD completo de usuarios desde React.
3. Implementar seguridad JWT y roles en el backend.
4. Corregir las respuestas de usuarios para excluir datos sensibles.
5. Definir e implementar la API de expedientes.
6. Crear la vista React del expediente individual.
7. Decidir si el administrador puede cambiar roles.
8. Mejorar validaciones y mensajes de los formularios.
9. Agregar pruebas automatizadas.
10. Realizar pruebas visuales y de accesibilidad.
11. Configurar variables y secretos de despliegue.
12. Desplegar y ejecutar pruebas E2E en Vercel.

---

## Matriz rápida de dependencias

| Pendiente | Solo frontend | Requiere backend |
|---|:---:|:---:|
| Mejoras visuales y mensajes | ✅ | |
| Confirmación de contraseña | ✅ | |
| Pruebas unitarias | ✅ | |
| Accesibilidad y responsive | ✅ | |
| Detalle individual de expedientes | | ✅ |
| Seguridad JWT y roles | | ✅ |
| Respuestas sin datos sensibles | | ✅ |
| Cambio de roles | | ✅ |
| Invalidación real del token | | ✅ |
| Pruebas E2E | | ✅ |
| Despliegue integrado | | ✅ |

---

## Estado estimado

Frontend visual y estructural: **75% - 80%**.

Frontend listo para producción: **55% - 60%**.

La diferencia se debe principalmente a:

- Falta de pruebas automatizadas.
- Detalle individual de expedientes pendiente.
- Seguridad por roles pendiente en el servidor.
- Respuestas de usuarios con campos sensibles.
- Despliegue real e integración E2E pendientes.

## Criterio de terminado

El frontend podrá considerarse completo cuando:

- Un operativo pueda registrarse, iniciar sesión, ver su dashboard
- Un administrador pueda listar, editar, eliminar y restaurar usuarios.
- Ninguna respuesta exponga información sensible.
- Las rutas estén protegidas tanto en React como en la API.
- El logout invalide realmente el token.
- Existan pruebas de los flujos principales.
- Frontend y backend estén desplegados y comunicándose en producción.
