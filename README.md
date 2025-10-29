# Voonda Admin Panel

Panel de administración (front-end) construido con Vite + React. Este repositorio contiene la app usada por Voonda.

## Contenido

- Código fuente en `src/`
- Configuración de build con Vite
- Workflow de CI/CD en `.github/workflows/ci-cd.yml` que build y despliega a Vercel al pushear a `main`.

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Desarrollo (local)

1. Instala dependencias:

```bash
npm ci
```

2. Ejecuta en modo desarrollo:

```bash
npm run dev
```

3. Abrir http://localhost:5173 (o la URL que muestra Vite).

## Build

```bash
npm run build
```

Los archivos estáticos resultantes quedan en `dist/`.

## CI/CD y despliegue a Vercel

Este repositorio incluye un workflow GitHub Actions (`.github/workflows/ci-cd.yml`) que:

- Linta y builda en la job `test`.
- En la job `deploy` construye y despliega a Vercel cuando haces push a `main`.

Para que el despliegue automático funcione, debes configurar los siguientes Secrets en tu repo (Settings → Secrets → Actions):

- `VERCEL_TOKEN` — token personal generado en Vercel (Account → Tokens) con permisos de despliegue.
- `VERCEL_ORG_ID` — Team / Organization ID (en Project Settings → General verás Team/Org ID).
- `VERCEL_PROJECT_ID` — Project ID (en Project Settings → General → Project ID).

Si prefieres, también puedes conectar directamente este repositorio desde el dashboard de Vercel (recomendado). Si lo haces, Vercel desplegará automáticamente cuando empujes a `main`.

### Reemplazar una app existente en Vercel

Si ya tienes una app antigua en Vercel que quieres reemplazar por esta:

1. En Vercel Dashboard ve al proyecto antiguo → Settings → General y copia el `Project ID`.
2. Añade ese `Project ID` como `VERCEL_PROJECT_ID` en los GitHub Secrets. Añade además `VERCEL_ORG_ID` y `VERCEL_TOKEN`.
3. Habilita el workflow: al pushear a `main` el workflow desplegará y actualizará la app existente (si usas el mismo `Project ID`).

Alternativa recomendada: Conectar este repositorio a Vercel y crear un nuevo proyecto apuntando al repo; luego puedes transferir dominio/ajustes del proyecto antiguo al nuevo.

## Documentación de despliegue

Consulta `DEPLOYMENT.md` para pasos detallados sobre cómo obtener los secretos y configurar la automatización.

---

Si quieres, puedo:

- Añadir un `README` más extenso con fotos y ejemplos.
- Crear `DEPLOYMENT.md` con pasos paso a paso (lo crearé ahora).

# Voonda Admin Panel# React + JavaScript + Vite

Un panel de administración moderno y completo construido con React, Vite y Material-UI para gestionar las operaciones de Voonda.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 📋 CaracterísticasCurrently, two official plugins are available:

- ✨ **Interfaz moderna**: Diseño limpio y profesional con Material-UI- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh

- 📱 **Responsive**: Optimizado para dispositivos móviles y desktop- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- 🔐 **Autenticación**: Sistema de login seguro

- 📊 **Dashboards**: Múltiples dashboards especializados (CRM, Crypto, E-commerce, etc.)## Expanding the ESLint configuration

- 📈 **Gráficos y Analytics**: Visualización de datos con Recharts

- 🌍 **Multiidioma**: Soporte para múltiples idiomas (ES, EN, FR, IT, AR, ZH)If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- 🎨 **Temas personalizables**: Modo claro, oscuro y semi-oscuro

- 📧 **Apps integradas**: Mail, Chat, Contactos, Calendario- Configure the top-level `parserOptions` property like this:

- 🗺️ **Mapas**: Integración con Google Maps

- 📁 **Gestión de archivos**: Drag & drop con Dropzone```js

- 📝 **Editores avanzados**: CKEditor y TipTap WYSIWYGexport default {

    // other rules...

## 🛠️ Tecnologías utilizadas parserOptions: {

    ecmaVersion: "latest",

- **Frontend Framework**: React 18 sourceType: "module",

- **Build Tool**: Vite project: ["./tsconfig.json", "./tsconfig.node.json"],

- **UI Library**: Material-UI (MUI) tsconfigRootDir: \_\_dirname,

- **Routing**: React Router },

- **Charts**: Recharts};

- **Forms**: React Hook Form```

- **Internationalization**: i18next

- **Maps**: Google Maps API- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`

- **Drag & Drop**: React Dropzone- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`

- **Notifications**: SweetAlert2- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## 📁 Estructura del proyecto

```
voonda-admin-panel/
├── @assets/                 # Assets estáticos (fuentes, imágenes)
├── @jumbo/                  # Componentes base del framework
│   ├── components/          # Componentes reutilizables
│   ├── shared/             # Componentes compartidos
│   ├── utilities/          # Utilidades y helpers
│   └── vendors/            # Integraciones con librerías
├── public/                 # Archivos públicos
└── src/
    ├── components/         # Componentes específicos del proyecto
    ├── config/            # Configuración de la aplicación
    ├── hooks/             # Custom hooks
    ├── layouts/           # Layouts de la aplicación
    ├── pages/             # Páginas de la aplicación
    ├── routes/            # Configuración de rutas
    ├── services/          # Servicios y APIs
    ├── styles/            # Estilos globales
    ├── themes/            # Temas personalizados
    ├── translations/      # Archivos de traducción
    └── utilities/         # Utilidades del proyecto
```

## 🚀 Instalación y configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Git

### Pasos de instalación

1. **Clonar el repositorio**

    ```bash
    git clone https://github.com/lsmartinez88/voonda-admin-panel.git
    cd voonda-admin-panel
    ```

2. **Instalar dependencias**

    ```bash
    npm install
    # o
    yarn install
    ```

3. **Configurar variables de entorno**

    ```bash
    cp .env.example .env
    ```

    Edita el archivo `.env` con tus configuraciones específicas.

4. **Ejecutar en modo desarrollo**

    ```bash
    npm run dev
    # o
    yarn dev
    ```

5. **Abrir en el navegador**
   La aplicación estará disponible en `http://localhost:5173`

## 🔧 Scripts disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Corrige automáticamente los errores del linter

## 🌍 Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=your_api_base_url
VITE_API_KEY=your_api_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase (si se usa)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Environment
VITE_APP_ENV=development
```

## 📱 Dashboards disponibles

- **CRM Dashboard**: Gestión de relaciones con clientes
- **Crypto Dashboard**: Análisis de criptomonedas
- **E-commerce Dashboard**: Métricas de ventas y productos
- **Intranet Dashboard**: Panel interno de la empresa
- **News Dashboard**: Gestión de noticias y contenido
- **Listing Dashboard**: Gestión de propiedades y listados
- **Miscellaneous Dashboard**: Métricas generales

## 🔐 Autenticación

El sistema incluye:

- Login con email/contraseña
- Registro de usuarios
- Recuperación de contraseña
- Pantalla de bloqueo
- Protección de rutas privadas

## 🎨 Personalización de temas

La aplicación soporta múltiples temas:

- **Light Theme**: Tema claro (por defecto)
- **Dark Theme**: Tema oscuro
- **Semi-Dark Theme**: Tema semi-oscuro
- **Custom Themes**: Temas personalizados (theme1-4)

## 📊 Componentes de gráficos

Incluye una amplia gama de gráficos:

- Gráficos de área
- Gráficos de barras
- Gráficos de líneas
- Gráficos de pastel
- Gráficos de radar
- Gráficos de dispersión
- Treemaps

## 🗺️ Integración con mapas

Funcionalidades de mapas incluidas:

- Mapas básicos
- Direcciones
- Geolocalización
- Clustering de marcadores
- Capas KML
- Street View
- Mapas estilizados

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Lucas Martinez** - [@lsmartinez88](https://github.com/lsmartinez88)

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- Crea un [Issue](https://github.com/lsmartinez88/voonda-admin-panel/issues)
- Contacta al equipo de desarrollo

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella!
