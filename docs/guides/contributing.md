# 🤝 Contribuint a Circuit Copilot

Gràcies per ajudar-nos a millorar l'experiència al circuit! Segueix aquestes directrius per mantenir el projecte net i funcional.

> [!TIP]
> Aquest és un monorepo gestionat amb **Turborepo**. Pots executar la majoria de tasques des de l'arrel del projecte.

## 🌿 Estratègia de Branques

Utilitzem branques de funcionalitat (feature branches):
- `feat/nom-funcionalitat`: Noves funcionalitats.
- `fix/nom-error`: Correcció d'errors.
- `docs/descripcio`: Millores en la documentació.

## 📝 Convenció de Commits

Seguim els **Conventional Commits**: `tipus(abast): descripció`
- `feat(mobile): add user tracking`
- `fix(api): fix PostGIS query`
- `chore(root): update dependencies`

## 🛠️ Estàndards de Desenvolupament

> [!IMPORTANT]
> Abans de pujar codi, assegura't que el linter no dona errors.

### Lògica Compartida
Si una funció o tipus s'utilitza en més d'un lloc, posa'l a `packages/shared`.

### Comandes Recomanades
```bash
npm run dev     # Desenvolupament actiu
npm run lint    # Verificació d'estil
npm run test    # Execució de tests
npm run format  # Formatat automàtic
```

## 🚀 Procés de Pull Request

1. **Auto-revisió:** Revisa el teu codi buscant `console.log` o codi mort.
2. **Documentació:** Si canvies una funcionalitat, actualitza els documents rellevants a `docs/`.
3. **Vídeo/GIF:** Si canvies la interfície d'usuari (UI) o la Realitat Augmentada (AR), inclou una mostra visual a la PR.

> [!CAUTION]
> No et saltis els **Git Hooks**. Estan per garantir que el codi enviat és de qualitat.
