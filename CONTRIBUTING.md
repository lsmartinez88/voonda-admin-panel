# Guía de Contribución

¡Gracias por tu interés en contribuir a Voonda Admin Panel! Esta guía te ayudará a entender cómo puedes colaborar en el proyecto.

## 🤝 Cómo contribuir

### 1. Fork del repositorio

1. Haz fork del repositorio en GitHub
2. Clona tu fork localmente:
    ```bash
    git clone https://github.com/tu-usuario/voonda-admin-panel.git
    cd voonda-admin-panel
    ```

### 2. Configurar el entorno de desarrollo

1. Instala las dependencias:

    ```bash
    npm install
    ```

2. Copia el archivo de variables de entorno:

    ```bash
    cp .env.example .env
    ```

3. Configura las variables de entorno necesarias en el archivo `.env`

4. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

### 3. Crear una rama de trabajo

```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b bugfix/nombre-del-bug
```

### 4. Realizar cambios

- Mantén el código limpio y bien documentado
- Sigue las convenciones de código existentes
- Añade comentarios cuando sea necesario
- Asegúrate de que el código pase el linter:
    ```bash
    npm run lint
    ```

### 5. Commit de cambios

Usamos conventional commits para mantener un historial limpio:

```bash
git commit -m "feat: añadir nueva funcionalidad de dashboard"
git commit -m "fix: corregir problema de autenticación"
git commit -m "docs: actualizar documentación de API"
```

Tipos de commit:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, comas, etc.)
- `refactor`: Refactorización de código
- `test`: Añadir o corregir tests
- `chore`: Cambios en herramientas o configuración

### 6. Push y Pull Request

```bash
git push origin feature/nombre-de-tu-feature
```

Luego crea un Pull Request en GitHub con:

- Título descriptivo
- Descripción detallada de los cambios
- Screenshots si aplica
- Referencia a issues relacionados

## 📋 Estándares de código

### JavaScript/React

- Usa componentes funcionales con hooks
- Implementa PropTypes para validación de props
- Mantén componentes pequeños y reutilizables
- Usa nombres descriptivos para variables y funciones
- Implementa manejo de errores apropiado

### CSS/Styling

- Usa Material-UI como librería principal
- Mantén consistencia con el sistema de diseño
- Usa variables CSS para colores y espaciado
- Implementa diseño responsive

### Estructura de archivos

```
src/components/NuevoComponente/
├── NuevoComponente.jsx
├── index.js
├── NuevoComponente.test.js (si aplica)
└── data/
    └── index.js (si necesita datos mock)
```

## 🧪 Testing

- Añade tests para nuevas funcionalidades
- Ejecuta los tests antes de hacer commit:
    ```bash
    npm run test
    ```
- Mantén una cobertura de código alta

## 📝 Documentación

- Documenta nuevas funcionalidades en el README.md
- Añade comentarios JSDoc para funciones complejas
- Actualiza la documentación de API si aplica

## 🐛 Reportar bugs

Cuando reportes un bug, incluye:

- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Información del entorno (navegador, OS, etc.)

## 💡 Sugerir nuevas funcionalidades

Para sugerir nuevas funcionalidades:

- Abre un issue con la etiqueta "enhancement"
- Describe claramente la funcionalidad propuesta
- Explica el caso de uso
- Considera la complejidad de implementación

## 📞 Comunicación

- Usa GitHub Issues para bugs y sugerencias
- Sé respetuoso y constructivo en las discusiones
- Proporciona contexto suficiente en tus comentarios

## ⚖️ Licencia

Al contribuir a este proyecto, aceptas que tu contribución será licenciada bajo la misma licencia MIT del proyecto.

¡Gracias por contribuir! 🎉
