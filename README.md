
# Sistema de Gestión de Tareas

Aplicación web desarrollada con Next.js y Supabase que permite a los usuarios organizar y administrar sus tareas personales.

Este proyecto fue creado como práctica para fortalecer conocimientos en desarrollo web, bases de datos, autenticación y control de versiones.

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Git y GitHub

## Funcionalidades

- Registro de usuarios.
- Confirmación de cuenta por correo electrónico.
- Inicio y cierre de sesión.
- Creación de tareas.
- Consulta de tareas registradas.
- Edición y eliminación de tareas.
- Marcar tareas como completadas o pendientes.
- Dashboard con estadísticas y porcentaje de progreso.
- Separación de tareas por usuario.
- Seguridad mediante Row Level Security (RLS).

## Base de datos

La aplicación utiliza PostgreSQL mediante Supabase.

La tabla principal se llama `tareas` y contiene:

| Campo | Descripción |
|---|---|
| id | Identificador de la tarea |
| nombre | Nombre de la tarea |
| completada | Estado de la tarea |
| usuario_id | Identificador del usuario |
| created_at | Fecha de creación |

Se implementaron políticas RLS para que cada usuario pueda consultar y administrar únicamente sus propias tareas.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Chagoxyz/practica-iqsource.git
```

### 2. Entrar a la carpeta

```bash
cd practica-iqsource
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto con las variables públicas de conexión a Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=TU_CLAVE_PUBLICABLE
```

Las variables deben coincidir con las utilizadas en `lib/supabase.ts`.

No se deben publicar claves secretas ni credenciales privadas.

### 5. Ejecutar la aplicación

```bash
npm run dev
```

Abrir en el navegador:

http://localhost:3000

Para utilizar la aplicación también se necesita un proyecto de Supabase con la tabla `tareas`, autenticación por correo y las políticas RLS correspondientes.

## Aprendizajes

Durante el desarrollo de este proyecto se practicaron:

- Creación de interfaces web con React y Next.js.
- Programación con TypeScript.
- Conexión de una aplicación web con PostgreSQL.
- Operaciones CRUD.
- Autenticación de usuarios con Supabase.
- Protección de datos mediante RLS.
- Manejo de sesiones.
- Control de versiones con Git y GitHub.

## Autor

Desarrollado por [Chagoxyz](https://github.com/Chagoxyz) como proyecto de práctica y aprendizaje.
