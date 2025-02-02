# Front To-Do List - Angular

Este proyecto es un frontend desarrollado en **Angular** que implementa autenticación mediante **cookies** para interactuar con un backend basado en **Node.js y Awilix**.  

Su objetivo es proporcionar una interfaz amigable y escalable para gestionar tareas, integrándose con un microservicio de autenticación y otro de gestión de tareas.  

## ✨ **Funcionalidades principales**  

- **Autenticación de usuarios**: Inicio de sesión con cookies (sin localStorage ni sessionStorage).  
- **Modularidad**: Arquitectura escalable con módulos independientes (`auth`, `home`, `shared`, `core`).  
- **Protección de rutas**: Guardias para restringir acceso a secciones privadas.  
- **Interfaz intuitiva**: Una **landing page** con botón para mostrar el **formulario de login**.  

## 🛠 **Tecnologías utilizadas**  

- **Angular**: Framework de frontend moderno y modular.  
- **TypeScript**: Lenguaje tipado para mejorar la mantenibilidad del código.  
- **SCSS**: Preprocesador CSS para estilos organizados.  
- **Angular Router**: Manejo de rutas con guardias de autenticación.  
- **HTTP Client**: Conexión con el backend usando `withCredentials: true`.  

## 📂 **Estructura del proyecto**  

```plaintext
src/
├── app/
│   ├── auth/        # Módulo de autenticación (login, servicios, guardias)
│   ├── core/        # Servicios globales (AuthService, Interceptors)
│   ├── home/        # Landing Page y páginas principales
│   ├── shared/      # Componentes reutilizables (botones, formularios)
│   ├── app-routing.module.ts  # Configuración de rutas
│   ├── app.component.ts        # Componente raíz
│   └── app.module.ts           # Módulo principal
└── assets/                     # Archivos estáticos (iconos, imágenes, estilos)
```
## 🚀 Cómo iniciar el proyecto
**1️⃣ Instalar Angular CLI (si no lo tienes)**
```bash
npm install -g @angular/cli
```
**2️⃣ Clonar el repositorio**
```bash
git clone https://github.com/AlexanderMota/FrontToDoListAngular.git
```
**3️⃣ Instalar dependencias**
```bash
npm install
```
**4️⃣ Configurar variables de entorno**
- Crea un archivo src/environments/environment.ts con:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4400/auth'  // Ajusta según tu backend
};
```
**5️⃣ Ejecutar el servidor de desarrollo**
```bash
ng serve --open
```
- Esto abrirá el proyecto en http://localhost:4200/.

## 🔐 Autenticación basada en Cookies
- El backend maneja sesiones con cookies, por lo que las peticiones deben incluir withCredentials: true.

## 🔄 Futuras funcionalidades
- Registro de usuarios
- Gestión de tareas
- Perfil de usuario con avatar
- Modo oscuro y mejoras en UI/UX

## 🤝 Contribuciones
Si deseas colaborar, abre un issue o envía un pull request. ¡Toda ayuda es bienvenida! 😊

