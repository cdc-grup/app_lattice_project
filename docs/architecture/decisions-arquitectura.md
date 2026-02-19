# Decisions d'Arquitectura: Nomenclatura, Estructura i Versionat

Aquest document detalla les convencions i decisions estratègiques preses per garantir la robustesa i escalabilitat del projecte.

## 1. Backend: Carpeta `apps/server`
S'utilitza `server` com a contenidor de tots els microserveis del backend per diferenciar clarament el codi de servidor del codi mòbil.

## 2. Frontend: `api` vs `services`
Dins de `apps/mobile/src`:
- **`api` (Network Layer)**: Exclusivament per a la comunicació externa (hooks de React Query, instàncies de fetch).
- **`services` (Business Logic)**: Per a la lògica de negoci, càlculs locals i interacció amb hardware (GPS, AR).

## 3. Versionat de l'API (`/v1`)
Totes les rutes de comunicació externa utilitzen el prefix `/api/v1`.

### Per què és important?
1. **Retrocompatibilitat**: Permet que versions antigues de l'app segueixin funcionant amb `v1` mentre els nous usuaris utilitzen una futura `v2`.
2. **Escalabilitat**: Facilita l'evolució de l'API sense trencar integracions existents.
3. **Estàndard Professional**: Segueix les millors pràctiques d'empreses com Stripe, Twilio o GitHub.

### Implementació al Gateway
El Gateway central està configurat per encaminar tant les rutes amb prefix `/api/v1` com les rutes directes, assegurant una transició suau.
