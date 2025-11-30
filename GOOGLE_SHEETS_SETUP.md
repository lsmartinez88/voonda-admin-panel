# Configuración de Google Sheets API para Sincronización de Catálogo

## Descripción

La funcionalidad de sincronización de catálogo permite leer una planilla de Google Sheets existente y comparar los datos con el catálogo actual de la API de Fratelli. Esto optimiza el proceso evitando re-procesar vehículos que no han cambiado y ahorrando tokens de OpenAI.

## Requisitos

Para usar esta funcionalidad necesitas configurar una API Key de Google Cloud Platform que tenga acceso a la Google Sheets API.

## Pasos para Configurar

### 1. Crear/Seleccionar Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto

### 2. Habilitar Google Sheets API

1. En el menú lateral, ve a **APIs y servicios** → **Biblioteca**
2. Busca "Google Sheets API"
3. Haz clic en **Google Sheets API**
4. Haz clic en el botón **HABILITAR**

### 3. Crear API Key

1. En el menú lateral, ve a **APIs y servicios** → **Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES**
3. Selecciona **Clave de API**
4. Se generará una nueva API Key
5. **IMPORTANTE**: Haz clic en **RESTRINGIR CLAVE** para mayor seguridad

### 4. Restringir la API Key (Recomendado)

#### Restricción de aplicación:

- Selecciona **Sitios web (HTTP referrers)**
- Agrega tus dominios permitidos:
    - `http://localhost:*` (para desarrollo)
    - `https://tu-dominio.com/*` (para producción)

#### Restricción de API:

- Selecciona **Restringir clave**
- En la lista de APIs, marca únicamente:
    - ✅ **Google Sheets API**
- Guarda los cambios

### 5. Configurar en el Proyecto

1. Copia la API Key generada
2. Abre tu archivo `.env.local` (o créalo si no existe)
3. Agrega la siguiente línea:
    ```
    VITE_GOOGLE_SHEETS_API_KEY=tu_api_key_aqui
    ```
4. Reinicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## Uso

### Preparar la Planilla de Google Sheets

1. La planilla debe tener el mismo formato que la exportación del sistema
2. La **primera fila** debe contener los headers (nombres de columnas)
3. La **primera columna** debe ser `id` (identificador del vehículo)
4. Configura los permisos de la planilla como **"Cualquiera con el enlace puede ver"**

### Sincronizar Catálogo

1. Ve a **Voonda** → **Sincronizar Catálogo**
2. Selecciona **🔄 Sincronizar con planilla existente**
3. Pega la URL de tu Google Sheets
    - Formato: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
4. Haz clic en **Leer y Comparar**
5. Revisa la tabla de comparación:
    - ✅ **Sin cambios**: Se mantendrán igual (no se procesan)
    - 🔄 **Modificados**: Se actualizarán campos específicos (precio, km, etc.)
    - 🆕 **Nuevos**: Se validarán versiones y enriquecerán con OpenAI
    - 🗑️ **Eliminados**: No aparecerán en la salida final
6. Continúa con los siguientes pasos normalmente

## Beneficios

- ⚡ **Más rápido**: Solo procesa vehículos nuevos o modificados
- 💰 **Ahorro de costos**: Reduce el uso de tokens de OpenAI en un 80-90%
- 🎯 **Preciso**: Detecta cambios exactos en precio, kilometraje y otros campos
- 📊 **Transparente**: Muestra exactamente qué se va a procesar antes de comenzar

## Seguridad

### ⚠️ Consideraciones Importantes

1. **API Key expuesta**: La API Key se usa desde el frontend (navegador del usuario)
    - Google permite esto para APIs públicas de solo lectura
    - La key debe estar **restringida** solo a Google Sheets API
    - La key debe estar **restringida** a tus dominios

2. **Datos públicos**: Solo funciona con planillas que tengan permisos de "Cualquiera puede ver"
    - No es posible leer planillas privadas desde el frontend
    - Si necesitas leer planillas privadas, requiere backend con Service Account

3. **Limitaciones de cuota**: Google tiene límites de uso gratuito
    - 300 solicitudes por minuto por proyecto
    - 60 solicitudes por minuto por usuario
    - Para proyectos grandes, considera implementar caché o backend

## Troubleshooting

### Error: "API Key de Google Sheets no configurada"

- Verifica que agregaste `VITE_GOOGLE_SHEETS_API_KEY` al `.env.local`
- Verifica que el nombre de la variable incluya el prefijo `VITE_`
- Reinicia el servidor de desarrollo

### Error: "The caller does not have permission"

- Verifica que habilitaste Google Sheets API en tu proyecto
- Verifica las restricciones de la API Key
- Prueba con una key sin restricciones primero (solo para debug)

### Error: "URL de Google Sheets inválida"

- Verifica que la URL tenga el formato correcto
- Debe incluir `/spreadsheets/d/SPREADSHEET_ID/`

### Error: "La hoja de cálculo está vacía"

- Verifica que la planilla tenga al menos la fila de headers
- Verifica que la primera columna sea "id"

## Soporte

Si tienes problemas con la configuración:

1. Revisa la consola del navegador (F12) para ver logs detallados
2. Verifica que la API Key esté correctamente configurada en Google Cloud
3. Prueba con una planilla de ejemplo simple primero
