# BatFiles frontend

Aplicación cliente independiente construida con React y Vite. El frontend se
comunica con el backend únicamente mediante peticiones HTTP; no importa código
ni dependencias desde `../backend`.

## Configuración

1. Copia `.env.example` como `.env`.
2. Configura `VITE_API_URL` con la URL pública del backend.
3. Instala las dependencias con `npm install`.
4. Inicia el entorno local con `npm run dev`.

Por defecto, el cliente utiliza `http://localhost:5000/api`.

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compilación de producción.
- `npm run lint`: análisis estático del código.
- `npm run preview`: vista previa de la compilación.

## Estructura

- `src/api`: comunicación HTTP con el backend.
- `src/components`: componentes reutilizables.
- `src/pages`: pantallas de la aplicación.
- `src/styles`: estilos globales.
- `public`: recursos estáticos servidos directamente por Vite.
