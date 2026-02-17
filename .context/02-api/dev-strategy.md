# Estratègia de Desenvolupament: Proxy & Túnel

Per facilitar el desenvolupament en paral·lel de l'API i l'App mòbil, s'ha implementat una estratègia de **Proxy Incremental** i **Túnels Segurs**.

## 1. Proxy Incremental (Fallback)

L'API local (`apps/api`) actua com a punt central. 
- Si una ruta està implementada localment, es serveix des del codi local.
- Si una ruta **NO** està implementada (per exemple, rutes de producció ja existents), el servidor redirigeix automàticament la petició a `EXTERNAL_API_URL`.

### Configuració
S'utilitzen fitxers `.env` per diferenciar entorns (Ignorats per Git):
- `.env.development`: Configuració local per al dia a dia (Proxy actiu).
- `.env.production`: Configuració de producció (Proxy desactivat).
- `.env.example`: Plantilla de referència amb valors de mostra (Únic fitxer comitat).

**Nota:** Cada desenvolupador hauria de copiar el `.env.example` a `.env.development` i posar la URL real del servidor extern a `EXTERNAL_API_URL`.

## 2. Túnel amb Zrok (Accés des de Mòbil)

Perquè els dispositius físics (iOS/Android) puguin connectar-se a l'API que corre al teu ordinador, s'utilitza **Zrok**.

### Flux de dades:
`Mòbil` -> `URL Zrok (HTTPS)` -> `Local API (3000)` -> `(Opcional) External Server`

## 3. Comandes útils
- **Port local:** 3000
- **Compartir túnel:** `zrok share public http://localhost:3000`

Per més detalls, consulta el fitxer [ZROK_GUIDE.md](file:///home/kore/Documents/Code/Projects/app_25_26_tr3g3_cdc/docs/ZROK_GUIDE.md).
