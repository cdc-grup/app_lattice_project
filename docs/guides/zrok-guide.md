# Guia d'Ús: Zrok per a Desenvolupament Mòbil

Aquesta guia explica com exposar el teu servidor API local perquè l'app d'Expo pugui connectar-se des d'un dispositiu físic.

## 1. Instal·lació de Zrok

Si no tens Zrok instal·lat, descarrega'l des de [zrok.io](https://zrok.io/download/).

## 2. Autenticació (Només la primera vegada)

```bash
zrok enable <el_teu_token_de_zrok>
```

## 3. Compartir el Servidor Local

Executa la següent comanda per obrir un túnel al port `3000` (el port per defecte de la nostra API):

```bash
zrok share public http://localhost:3000
```

## 4. Configuració a l'App (Expo)

En executar la comanda anterior, Zrok et donarà una URL pública del tipus `https://xxxx.share.zrok.io`.

Copia aquesta URL i enganxa-la a la configuració del teu entorn a l'aplicació mòbil perquè totes les peticions apuntin allà.

## 5. Avantatges

- **HTTPS gratuït:** Mapbox i altres llibreries requereixen connexions segures.
- **Accés Global:** Funciona encara que el mòbil estigui en 4G/5G fora de la teva xarxa local.
- **Diferenciació:** En utilitzar el Proxy configurat a l'API, les rutes que encara no has programat localment seguiran funcionant (es demanaran al servidor extern).
