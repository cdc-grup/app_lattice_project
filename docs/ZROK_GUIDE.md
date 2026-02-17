# Guía de Uso: Zrok para Desarrollo Mobile

Esta guía explica cómo exponer tu servidor API local para que la app de Expo pueda conectarse desde un dispositivo físico.

## 1. Instalación de Zrok
Si no tienes Zrok instalado, descárgalo desde [zrok.io](https://zrok.io/download/).

## 2. Autenticación (Solo la primera vez)
```bash
zrok enable <tu_token_de_zrok>
```

## 3. Compartir el Servidor Local
Ejecuta el siguiente comando para abrir un túnel al puerto `3000` (el puerto por defecto de nuestra API):

```bash
zrok share public http://localhost:3000
```

## 4. Configuración en la App (Expo)
Al ejecutar el comando anterior, Zrok te dará una URL pública del tipo `https://xxxx.share.zrok.io`. 

Copia esa URL y pégala en la configuración de tu entorno en la aplicación móvil para que todas las peticiones apunten allí.

## 5. Ventajas
- **HTTPS gratuito:** Mapbox y otras librerías requieren conexiones seguras.
- **Acceso Global:** Funciona aunque el móvil esté en 4G/5G fuera de tu red local.
- **Diferenciación:** Al usar el Proxy configurado en la API, las rutas que aún no has programado localmente seguirán funcionando (se pedirán al servidor externo).
