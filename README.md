![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

# Portfolio Generator

**Creado por [Gregory Pimentel](https://github.com/ZGrengo)**

Una aplicación web moderna construida con Next.js que permite crear y gestionar portafolios profesionales con plantillas personalizables.

- [Características](#-características)
- [Stack Tecnológico](#%EF%B8%8F-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Inicio Rápido](#-inicio-rápido)
- [Dominios de Imágenes Soportados](#%EF%B8%8F-dominios-de-imágenes-soportados)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Deployment](#-deployment)
- [Uso](#-uso)
- [Seguridad](#-seguridad)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## 🚀 Características

### Gestión de Portafolios

-   **Creación y edición de portafolios** - Crea múltiples portafolios personalizados
-   **Dos plantillas profesionales**:
    -   **Modern Template**: Diseño moderno con animaciones y efectos visuales
    -   **Minimalistic Template**: Diseño minimalista y editorial
-   **Personalización de colores** - Configura colores primarios, secundarios y de resalte
-   **Gestión completa de contenido**:
    -   Proyectos con galerías de imágenes
    -   Habilidades técnicas
    -   Experiencia laboral
    -   Educación

### Galería de Imágenes

-   **Carousel interactivo** con navegación por teclado y mouse
-   **Miniaturas** para navegación rápida
-   **Validación de URLs** - Solo acepta imágenes de dominios soportados
-   **Fallback automático** - Manejo elegante de errores de carga

### Seguridad y Autenticación

-   **Autenticación con Auth0** - Login seguro y gestión de sesiones
-   **Protección de rutas** - Middleware para proteger rutas del dashboard
-   **Validación de datos** - Validación en cliente y servidor

### Experiencia de Usuario

-   **Interfaz intuitiva** - Dashboard fácil de usar
-   **Validación en tiempo real** - Feedback inmediato al agregar contenido
-   **Tooltips informativos** - Guías claras cuando hay errores
-   **Diseño responsivo** - Funciona perfectamente en todos los dispositivos

## 🛠️ Stack Tecnológico

-   **Framework**: Next.js 15.5.7 (App Router)
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS 4
-   **Autenticación**: Auth0
-   **Base de Datos**: MongoDB con Mongoose
-   **Animaciones**: Framer Motion
-   **Deployment**: Vercel (recomendado)

## 📋 Requisitos Previos

-   Node.js 18+
-   npm o yarn
-   Cuenta de MongoDB (local o Atlas)
-   Cuenta de Auth0

<p align="center">
<img width="600" alt="Portada con plantillas" src="https://github.com/user-attachments/assets/7997e249-b5dd-416d-8096-b10c6a189070" />
    
<img width="600" alt="MinimalistaDesktop2" src="https://github.com/user-attachments/assets/c33e4796-7de1-4e0b-9f24-2bacb2a96bbb" />
</p>
<p align="center">
<img height="600" alt="ModernMovil2" src="https://github.com/user-attachments/assets/d5d9d730-27b2-4184-a55e-97369f679907" />
<img height="600" alt="MinimalistaMovil2" src="https://github.com/user-attachments/assets/3982b7c8-6f82-4ee9-ba2d-2ffa13c3d654" />
</p>

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd portfolio-generator
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB
MONGODB_URI=tu_connection_string_de_mongodb

# Auth0
AUTH0_SECRET=una_cadena_aleatoria_segura_de_32_bytes_minimo
AUTH0_DOMAIN=tu_dominio.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
AUTH0_BASE_URL=http://localhost:3000

# Rutas públicas (opcional, para rutas personalizadas)
NEXT_PUBLIC_LOGIN_ROUTE=/api/auth/login
NEXT_PUBLIC_PROFILE_ROUTE=/api/auth/profile
NEXT_PUBLIC_ACCESS_TOKEN_ROUTE=/api/auth/access-token
```

### 4. Configurar Auth0

1. Crea una aplicación en [Auth0 Dashboard](https://manage.auth0.com)
2. Configura las siguientes URLs:
    - **Allowed Callback URLs**:
        - `http://localhost:3000/api/auth/callback`
        - `https://tu-dominio.vercel.app/api/auth/callback`
    - **Allowed Logout URLs**:
        - `http://localhost:3000`
        - `https://tu-dominio.vercel.app`
    - **Allowed Web Origins**:
        - `http://localhost:3000`
        - `https://tu-dominio.vercel.app`

### 5. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

### 6. Abrir en el navegador

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🖼️ Dominios de Imágenes Soportados

La aplicación valida que las URLs de imágenes provengan de los siguientes servicios:

-   **Imgur** (`imgur.com`, `i.imgur.com`)
-   **Unsplash** (`unsplash.com`)
-   **Cloudinary** (`cloudinary.com`)
-   **GitHub** (`githubusercontent.com`)
-   **Amazon AWS S3** (`amazonaws.com`)
-   **Gravatar** (`gravatar.com`)
-   **Google** (`googleusercontent.com`)
-   **Auth0** (`auth0.com`, `auth0usercontent.com`)

> **Nota**: Si intentas agregar una imagen de un dominio no soportado, el botón "Add Project" se deshabilitará y mostrará un tooltip con los dominios válidos.

## 📁 Estructura del Proyecto

```
portfolio-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[auth0]/     # Rutas de autenticación
│   │   │   └── portfolio/        # API de portafolios
│   │   ├── dashboard/            # Dashboard de gestión
│   │   ├── portfolio/[id]/       # Vista pública del portafolio
│   │   └── page.tsx              # Página de inicio
│   ├── components/
│   │   ├── templates/            # Plantillas de portafolio
│   │   ├── GalleryCarousel.tsx   # Componente de galería
│   │   ├── Navbar.tsx
│   │   └── ShareButton.tsx
│   ├── lib/
│   │   ├── auth0.ts              # Configuración de Auth0
│   │   ├── db.ts                 # Conexión a MongoDB
│   │   └── imageValidation.ts    # Validación de URLs de imágenes
│   ├── models/
│   │   └── Portfolio.ts          # Modelo de MongoDB
│   └── middleware.ts             # Middleware de protección de rutas
├── public/
└── next.config.ts
```

## 🚢 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Agrega todas las variables de entorno en la configuración de Vercel
3. Asegúrate de actualizar `AUTH0_BASE_URL` con tu URL de producción
4. Actualiza las URLs en Auth0 con tu dominio de Vercel

### Variables de Entorno en Producción

Asegúrate de configurar:

-   `AUTH0_BASE_URL` con tu URL de producción (ej: `https://tu-app.vercel.app`)
-   Todas las credenciales de Auth0
-   `MONGODB_URI` con tu string de conexión de MongoDB Atlas

## 🎨 Uso

1. **Iniciar sesión**: Haz clic en "Login" y autentícate con Auth0
2. **Crear portafolio**: En el dashboard, completa el formulario de creación
3. **Agregar contenido**:
    - Proyectos con imágenes (solo de dominios soportados)
    - Habilidades técnicas
    - Experiencia laboral
    - Educación
4. **Personalizar**: Elige entre las dos plantillas y personaliza los colores
5. **Compartir**: Cada portafolio tiene una URL única que puedes compartir

## 🔒 Seguridad

-   Todas las rutas del dashboard están protegidas con autenticación
-   Las APIs validan la sesión del usuario antes de procesar requests
-   Validación de datos en cliente y servidor
-   Validación estricta de URLs de imágenes para prevenir XSS

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.
