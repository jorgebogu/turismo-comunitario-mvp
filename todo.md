# Turismo Comunitario Sostenible MVP - TODO

## Funcionalidades Principales

- [x] Página de inicio con información del proyecto y objetivos de conservación
- [x] Sección de geoportal interactivo con mapa de experiencias turísticas
- [x] Centro de contenido con recursos educativos y guías
- [x] Información sobre campus virtual para capacitación
- [x] Sistema de registro y visualización de distintivos/certificaciones
- [x] Galería de experiencias comunitarias con imágenes
- [x] Sección de contacto para comunidades interesadas
- [x] Navegación principal elegante y responsive
- [x] Footer con información institucional (SECTUR, FONATUR)
- [x] Diseño elegante con paleta de colores sostenible/naturaleza

## Base de Datos

- [x] Esquema de experiencias turísticas comunitarias
- [x] Esquema de distintivos/certificaciones
- [x] Esquema de recursos educativos
- [x] Esquema de solicitudes de contacto
- [x] Esquema de cursos del campus virtual
- [x] Datos de ejemplo insertados

## Backend

- [x] API para experiencias turísticas (listar, detalle, filtros)
- [x] API para distintivos (listar, detalle)
- [x] API para recursos del centro de contenido
- [x] API para formulario de contacto
- [x] API para cursos del campus virtual
- [x] API para estadísticas generales
- [x] Pruebas unitarias para todas las APIs

## Frontend

- [x] Componente Hero Section
- [x] Componente de navegación (Navbar)
- [x] Componente de mapa interactivo (Geoportal)
- [x] Componente de tarjetas de experiencias
- [x] Componente de galería
- [x] Componente de distintivos
- [x] Formulario de contacto
- [x] Página de detalle de experiencia
- [x] Página Acerca del Proyecto
- [x] Footer con enlaces y aliados institucionales

## Páginas Completadas

- [x] Home - Página principal con hero y secciones destacadas
- [x] Geoportal - Mapa interactivo con experiencias
- [x] Centro de Contenido - Recursos educativos
- [x] Campus Virtual - Cursos y capacitación
- [x] Distintivos - Sistema de certificaciones
- [x] Galería - Galería visual de experiencias
- [x] Contacto - Formulario y preguntas frecuentes
- [x] Acerca - Información del proyecto
- [x] Detalle de Experiencia - Vista individual

## Mejoras Adicionales

- [x] Integrar mapa interactivo de Google Maps en el geoportal
- [x] Mostrar marcadores para cada experiencia turística
- [x] Popup con información al hacer clic en marcadores
- [x] Lista lateral de experiencias sincronizada con el mapa
- [x] Vista de mapa como opción por defecto

- [x] Implementar geolocalización del usuario
- [x] Agregar filtro de búsqueda por distancia (radio en km)
- [x] Ordenar experiencias por distancia a la ubicación del usuario
- [x] Mostrar distancia en las tarjetas de experiencias
- [x] Círculo visual en el mapa mostrando el radio de búsqueda
- [x] Marcador de ubicación del usuario con animación

- [x] Implementar rutas de navegación con Google Directions
- [x] Mostrar ruta visual en el mapa
- [x] Mostrar distancia y tiempo estimado de viaje
- [x] Botón "Cómo llegar" en las tarjetas de experiencias
- [x] Opciones de modo de transporte (auto, transporte público, caminando)
- [x] Diálogo con indicaciones paso a paso
- [x] Botón para abrir ruta en Google Maps

## Bugs Corregidos

- [x] Error de accesibilidad: DialogContent sin DialogTitle en Campus Virtual

## Sistema de Reseñas y Calificaciones

- [x] Crear tabla de reseñas en la base de datos
- [x] Implementar API para crear, leer y eliminar reseñas
- [x] Componente de estrellas para calificación
- [x] Formulario para escribir reseñas
- [x] Mostrar reseñas en la página de detalle de experiencia
- [x] Calcular y mostrar promedio de calificaciones
- [x] Distribución visual de calificaciones (barras)
- [x] Botón "Marcar como útil" en reseñas
- [x] Pruebas unitarias para el sistema de reseñas
- [x] Error de accesibilidad: DialogContent sin DialogTitle en Geoportal (corregido en command.tsx)

## Contenido del Centro de Contenido y Campus Virtual

- [x] Agregar recursos educativos al Centro de Contenido (22 recursos: guías, manuales, normatividad, videos, infografías)
- [x] Agregar cursos de capacitación al Campus Virtual (15 cursos en 3 niveles: básico, intermedio, avanzado)
- [x] Poblar base de datos con contenido relevante para turismo comunitario
- [x] Error de accesibilidad: DialogContent sin DialogTitle en Campus Virtual (corregido en sheet.tsx)

## Sistema de Inscripción a Cursos

- [x] Crear tabla de inscripciones en la base de datos
- [x] Implementar API para inscribirse a cursos
- [x] Implementar API para ver inscripciones del usuario
- [x] Implementar API para actualizar progreso del curso
- [x] Crear página de detalle de curso con botón de inscripción
- [x] Crear página "Mis Cursos" para ver inscripciones y progreso
- [x] Mostrar estado de inscripción en tarjetas de cursos
- [x] Agregar pruebas unitarias para el sistema de inscripciones (12 tests)
- [x] Enlace a "Mis Cursos" en el menú de usuario
- [x] Estadísticas de inscripciones del usuario

## Sistema de Certificados Descargables

- [x] Crear tabla de certificados en la base de datos
- [x] Implementar generación de PDF con diseño profesional
- [x] Crear API para generar y descargar certificados
- [x] Agregar código de verificación único para cada certificado (formato TCS-XXXXX-XXXXXXXX)
- [x] Mostrar botón de descarga en cursos completados
- [x] Crear página de verificación de certificados (/verificar-certificado)
- [x] Agregar sección de certificados en "Mis Cursos"
- [x] Pruebas unitarias para el sistema de certificados (21 tests)
- [x] Enlace a verificación de certificados en el Footer

## Experiencias Adicionales en el Geoportal

- [x] Buscar imágenes de destinos turísticos reales de México (10 imágenes)
- [x] Agregar 10 nuevas experiencias turísticas comunitarias
- [x] Incluir variedad de estados y categorías (Chiapas, Oaxaca, Yucatán, Querétaro, Quintana Roo, Chihuahua, Nayarit, Michoacán)
- [x] Total de experiencias en el geoportal: 18

## Sistema de Reservaciones

- [x] Crear tabla de reservaciones en la base de datos
- [x] Implementar API para crear solicitudes de reserva
- [x] Implementar API para ver reservaciones del usuario
- [x] Implementar API para cancelar reservaciones
- [x] Crear formulario de reservación en página de experiencia
- [x] Crear página "Mis Reservaciones" para usuarios
- [x] Agregar estados de reservación (pendiente, confirmada, cancelada, completada, rechazada)
- [x] Pruebas unitarias para el sistema de reservaciones (13 tests)
- [x] Enlace a "Mis Reservaciones" en el menú de usuario
- [x] Estadísticas de reservaciones del usuario

## Calendario de Disponibilidad

- [x] Crear tabla de disponibilidad en la base de datos
- [x] Implementar API para definir días disponibles por experiencia
- [x] Implementar API para consultar disponibilidad por fecha
- [x] Crear componente de calendario visual con leyenda
- [x] Mostrar fechas disponibles/no disponibles en el formulario de reservación
- [x] Validar capacidad máxima por día antes de confirmar reservación
- [x] Bloquear fechas pasadas y días no disponibles
- [x] Pruebas unitarias para el sistema de disponibilidad (12 tests)
- [x] Configuración de disponibilidad por día de la semana
- [x] Integración del calendario en el formulario de reservación
## Panel de Administración para Comunidades

- [x] Crear página principal del panel de administración (/admin)
- [x] Implementar dashboard con estadísticas de reservaciones
- [x] Crear vista de lista de reservaciones pendientes
- [x] Implementar acciones de confirmar/rechazar reservaciones
- [x] Crear calendario de gestión de disponibilidad (/admin/disponibilidad)
- [x] Permitir bloquear/desbloquear fechas específicas
- [x] Configurar capacidad máxima por día
- [x] Mostrar historial de reservaciones
- [x] Agregar filtros por estado y experiencia
- [x] Enlace al panel en el menú de usuario
- [x] Pruebas unitarias para las APIs de administración (14 tests)

## Sistema de Notificaciones por Email

- [x] Configurar servicio de envío de notificaciones (usando Manus Notification Service)
- [x] Crear plantillas de email HTML profesionales para notificaciones
- [x] Notificar al propietario cuando se reciba nueva reservación
- [x] Notificar cuando una reservación sea confirmada
- [x] Notificar cuando una reservación sea rechazada (con motivo)
- [x] Notificar cuando una reservación sea completada
- [x] Plantilla de recordatorio antes de la fecha de visita
- [x] Pruebas unitarias para el sistema de notificaciones (19 tests)
- [x] Plantillas de email en formato HTML y texto plano
- [x] Formato de fechas en español

## Revisión de Enlaces

- [x] Revisar enlaces de navegación principal
- [x] Revisar enlaces en el footer
- [x] Revisar enlaces en las páginas de contenido
- [x] Corregir enlaces rotos encontrados
- [x] Crear página de Aviso de Privacidad (/aviso-privacidad)
- [x] Crear página de Términos de Uso (/terminos-uso)
- [x] Actualizar enlaces en Footer.tsx para apuntar a las nuevas páginas

## Páginas Legales Agregadas

- [x] Aviso de Privacidad - Información sobre protección de datos personales y derechos ARCO
- [x] Términos de Uso - Condiciones de uso de la plataforma, responsabilidades y propiedad intelectual


## Bugs Reportados

- [x] Error de hooks en ExperienceDetail: "Rendered more hooks than during the previous render" - useState declarado después de early returns (CORREGIDO: movido useState al inicio del componente)

## Galería de Imágenes para Experiencias

- [x] Crear tabla experienceImages en el esquema de base de datos
- [x] Crear procedimientos tRPC para obtener imágenes de experiencias
- [x] Implementar componente ImageGallery con carrusel interactivo
- [x] Integrar galería en ExperienceDetail.tsx
- [x] Agregar imágenes de ejemplo a las experiencias existentes
- [x] Escribir pruebas unitarias para los nuevos procedimientos (10 tests)

## Mejora de Descripciones y Fotografías de Experiencias

- [x] Obtener lista completa de experiencias actuales (18 experiencias)
- [x] Redactar descripciones mejoradas y más detalladas para cada experiencia
- [x] Actualizar descripciones en la base de datos
- [x] Buscar imágenes representativas de alta calidad para cada experiencia
- [x] Agregar múltiples fotografías al carrusel de cada experiencia (3-4 imágenes por experiencia)
- [x] Verificar que el carrusel funcione correctamente en todas las experiencias
