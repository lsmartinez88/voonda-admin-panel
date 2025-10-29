# Configuración de GitHub Secrets

Para que el pipeline de CI/CD funcione correctamente, necesitas configurar los siguientes secretos en tu repositorio de GitHub.

## 🔐 Secretos requeridos

### 1. Acceder a la configuración de secretos

1. Ve a tu repositorio en GitHub
2. Haz clic en `Settings`
3. En el menú lateral, selecciona `Secrets and variables` > `Actions`
4. Haz clic en `New repository secret`

### 2. Secretos necesarios

#### `VITE_SUPABASE_URL`

- **Descripción**: URL de tu proyecto de Supabase
- **Ejemplo**: `https://tu-proyecto.supabase.co`
- **Dónde obtenerlo**: Panel de Supabase > Settings > API

#### `VITE_SUPABASE_ANON_KEY`

- **Descripción**: Clave anónima de Supabase
- **Ejemplo**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Dónde obtenerlo**: Panel de Supabase > Settings > API > anon public

#### `VITE_GOOGLE_MAPS_API_KEY`

- **Descripción**: Clave API de Google Maps
- **Ejemplo**: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Dónde obtenerlo**: Google Cloud Console > APIs & Services > Credentials

#### `VITE_GOOGLE_SHEETS_API_KEY` (opcional)

- **Descripción**: Clave API de Google Sheets
- **Dónde obtenerlo**: Google Cloud Console > APIs & Services > Credentials

#### `VITE_GOOGLE_CLIENT_EMAIL` (opcional)

- **Descripción**: Email del service account de Google
- **Dónde obtenerlo**: Google Cloud Console > IAM & Admin > Service Accounts

#### `VITE_GOOGLE_PRIVATE_KEY` (opcional)

- **Descripción**: Clave privada del service account de Google
- **Dónde obtenerlo**: Google Cloud Console > IAM & Admin > Service Accounts

## 📋 Pasos para configurar cada secreto

### Para cada secreto:

1. **Nombre**: Introduce exactamente el nombre del secreto (ej: `VITE_SUPABASE_URL`)
2. **Valor**: Pega el valor correspondiente
3. Haz clic en `Add secret`

### Ejemplo de configuración:

```
Nombre: VITE_SUPABASE_URL
Valor: https://xyzproject.supabase.co
```

```
Nombre: VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5enByb2plY3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNTIyNDk4NSwiZXhwIjoxOTMwODAwOTg1fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```
Nombre: VITE_GOOGLE_MAPS_API_KEY
Valor: AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ✅ Verificar configuración

Una vez configurados todos los secretos:

1. Los secretos aparecerán listados en la página de Actions secrets
2. El próximo push al repositorio activará el workflow con las variables configuradas
3. Puedes verificar que funciona correctamente en la pestaña `Actions` del repositorio

## 🔄 Actualizar secretos

Para actualizar un secreto existente:

1. Ve a la página de secretos
2. Haz clic en el nombre del secreto que quieres actualizar
3. Haz clic en `Update`
4. Introduce el nuevo valor
5. Haz clic en `Update secret`

## 🚨 Importante

- **Nunca compartas estos valores públicamente**
- **No los incluyas en el código fuente**
- **Usa siempre el archivo `.env` para desarrollo local**
- **Los secretos son específicos para cada entorno (desarrollo, producción)**

## 🆘 Solución de problemas

### Si el workflow falla:

1. **Verifica que todos los secretos estén configurados** correctamente
2. **Revisa los logs** del workflow en GitHub Actions
3. **Confirma que las claves** son válidas y tienen los permisos necesarios
4. **Verifica la sintaxis** de las variables de entorno en el archivo `.env.example`

### Logs comunes de error:

- `Error: Missing required environment variable`: Falta configurar un secreto
- `Error: Invalid API key`: La clave API no es válida o no tiene permisos
- `Error: Network request failed`: Problema de conectividad con los servicios externos

¡Una vez configurados estos secretos, tu pipeline de CI/CD estará completamente funcional! 🎉
