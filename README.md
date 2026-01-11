# 🌿 Turismo Comunitario Sostenible México

Una plataforma integral para conectar viajeros con experiencias auténticas de turismo comunitario en México, promoviendo la conservación de la biodiversidad y el desarrollo sostenible de las comunidades locales.

![Turismo Comunitario](https://img.shields.io/badge/Turismo-Comunitario-166534?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📋 Descripción

**Turismo Comunitario Sostenible México** es una plataforma web que facilita la conexión entre viajeros conscientes y comunidades mexicanas que ofrecen experiencias turísticas auténticas y sostenibles. El proyecto integra herramientas para explorar destinos, capacitarse en turismo sostenible, obtener certificaciones y realizar reservaciones directamente con las comunidades.

### Características Principales

| Módulo | Descripción |
|--------|-------------|
| **Geoportal Interactivo** | Mapa interactivo de México con todas las experiencias turísticas comunitarias geolocalizadas |
| **Centro de Contenido** | Biblioteca de recursos, guías y manuales sobre turismo sostenible y biodiversidad |
| **Campus Virtual** | Plataforma de cursos en línea para capacitación en turismo comunitario |
| **Sistema de Distintivos** | Certificaciones para prestadores de servicios turísticos comunitarios |
| **Galería de Experiencias** | Catálogo de experiencias con imágenes, descripciones detalladas y sistema de reservaciones |
| **Panel de Administración** | Gestión de comunidades, experiencias, cursos y certificaciones |

## 🚀 Tecnologías

### Frontend
- **React 19** con TypeScript
- **Tailwind CSS 4** para estilos
- **shadcn/ui** para componentes de interfaz
- **Wouter** para enrutamiento
- **TanStack Query** para gestión de estado del servidor

### Backend
- **Express 4** como servidor HTTP
- **tRPC 11** para APIs tipadas end-to-end
- **Drizzle ORM** para acceso a base de datos
- **MySQL/TiDB** como base de datos

### Autenticación y Seguridad
- **Manus OAuth** para autenticación de usuarios
- **JWT** para sesiones seguras
- Control de acceso basado en roles (admin/user)

## 📁 Estructura del Proyecto

```
turismo-comunitario-mvp/
├── client/                    # Aplicación frontend
│   ├── public/               # Archivos estáticos (favicon, imágenes)
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── contexts/         # Contextos de React
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── lib/              # Utilidades y configuración
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── App.tsx           # Componente principal y rutas
│   │   └── main.tsx          # Punto de entrada
│   └── index.html            # Template HTML
├── server/                    # Servidor backend
│   ├── _core/                # Infraestructura del servidor
│   ├── db.ts                 # Helpers de base de datos
│   ├── routers.ts            # Procedimientos tRPC
│   └── *.test.ts             # Pruebas unitarias
├── drizzle/                   # Esquema y migraciones de BD
│   └── schema.ts             # Definición de tablas
├── shared/                    # Código compartido
└── storage/                   # Helpers de almacenamiento S3
```

## 🗄️ Modelo de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios registrados con roles (admin/user) |
| `experiences` | Experiencias turísticas comunitarias |
| `experience_images` | Galería de imágenes por experiencia |
| `communities` | Comunidades prestadoras de servicios |
| `reservations` | Reservaciones de experiencias |
| `reviews` | Reseñas y calificaciones |
| `courses` | Cursos del campus virtual |
| `enrollments` | Inscripciones a cursos |
| `certificates` | Certificados emitidos |
| `badges` | Distintivos de certificación |
| `resources` | Recursos del centro de contenido |

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 22+
- pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jorgebogu/turismo-comunitario-mvp.git
cd turismo-comunitario-mvp

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales necesarias

# Aplicar migraciones de base de datos
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Compila el proyecto para producción |
| `pnpm test` | Ejecuta las pruebas unitarias |
| `pnpm db:push` | Aplica cambios del esquema a la BD |

## 🧪 Pruebas

El proyecto incluye una suite completa de pruebas unitarias con Vitest:

```bash
# Ejecutar todas las pruebas
pnpm test

# Ejecutar pruebas en modo watch
pnpm test:watch
```

**Cobertura actual:** 120+ pruebas unitarias cubriendo:
- Autenticación y autorización
- CRUD de experiencias y comunidades
- Sistema de reservaciones
- Inscripciones y certificados
- Reseñas y calificaciones

## 🌐 Funcionalidades por Rol

### Usuario Público
- Explorar experiencias en el geoportal
- Ver detalles y galerías de imágenes
- Acceder al centro de contenido
- Verificar certificados

### Usuario Registrado
- Realizar reservaciones
- Inscribirse en cursos
- Escribir reseñas
- Descargar certificados

### Administrador
- Gestionar experiencias y comunidades
- Administrar cursos y contenido
- Emitir certificados y distintivos
- Ver estadísticas y reportes

## 🎨 Diseño y UX

El diseño utiliza una paleta de colores inspirada en la naturaleza mexicana:

| Color | Uso | Código |
|-------|-----|--------|
| Verde Bosque | Color primario | `#166534` |
| Dorado | Acentos | `#CA8A04` |
| Verde Claro | Fondos | `#F0FDF4` |
| Gris | Texto secundario | `#6B7280` |

### Características de Accesibilidad
- Diseño responsive para todos los dispositivos
- Navegación por teclado
- Contraste adecuado de colores
- Textos alternativos en imágenes

## 📊 SEO

El sitio está optimizado para motores de búsqueda:
- Meta descripción y palabras clave
- Open Graph para redes sociales
- Favicon personalizado en múltiples tamaños
- Idioma configurado como es-MX

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Email:** contacto@turismocomunitario.mx
- **Teléfono:** +52 55 5555 5555

---

Desarrollado con 💚 para las comunidades de México
