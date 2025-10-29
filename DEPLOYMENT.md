# Despliegue a Vercel desde GitHub Actions

Este documento explica cómo configurar los secretos necesarios y cómo reemplazar una app existente en Vercel para que se regenere al pushear a la rama `main`.

## Secretos necesarios en GitHub

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions → New repository secret y añade:

- `VERCEL_TOKEN` — Genera un token en Vercel: https://vercel.com/account/tokens (botón "Create Token"). Dale un nombre y copia el valor.
- `VERCEL_ORG_ID` — En Vercel Dashboard: selecciona tu team/organización → Settings → verás el `Org ID` o `Team ID` en la sección General.
- `VERCEL_PROJECT_ID` — En Vercel Dashboard: abre el proyecto → Settings → General → Project ID.

Opcional: si no quieres usar workflow, conecta el repositorio en Vercel (Import Project) y selecciona la rama `main`.

## Reemplazar app antigua en Vercel (dos alternativas)

Opción A — Mantener el proyecto existente y que GitHub Actions haga el deploy:

1. Copia el `Project ID` del proyecto viejo (Vercel Dashboard → Project → Settings → General).
2. Añade `VERCEL_PROJECT_ID` con ese valor en los GitHub Secrets. Añade también `VERCEL_ORG_ID` y `VERCEL_TOKEN`.
3. Push a `main`; el workflow de GitHub Actions (`ci-cd.yml`) construirá y desplegará al proyecto indicado.

Opción B — Conectar directamente el repo a Vercel (recomendado):

1. En Vercel, Import Project → Connect to Git Provider (GitHub) → busca `lsmartinez88/voonda-admin-panel` → Import.
2. Configura variables de entorno en Vercel (si las necesitas) y la rama `main` como rama de producción.
3. Vercel desplegará automáticamente cada push a `main`.

## Comprobación

- Una vez pusheado a `main`, en GitHub Actions > Actions verás el workflow `CI/CD Pipeline` ejecutándose.
- En Vercel Dashboard > Project > Deployments verás nuevas deploys (o el despliegue actualizado si usas el mismo Project ID).

## Obtener IDs con Vercel CLI (opcional)

Instala el CLI:

```bash
npm i -g vercel
# o: corepack enable && corepack prepare vercel@latest --activate
```

Lista proyectos:

```bash
vercel projects ls
```

Para ver detalles de un proyecto en el dashboard es más sencillo (Project → Settings → General).

## Problemas comunes

- 400 o 403 al push: revisa que `VERCEL_TOKEN` sea válido y que el token tenga acceso al equipo/proyecto.
- Si el despliegue crea un nuevo proyecto en lugar de reemplazar el viejo: asegúrate de usar el `Project ID` correcto o conectar el repo directamente.
