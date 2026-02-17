# 🤝 Contribuir a Circuit Copilot

Gràcies per ajudar-nos a millorar l'experiència al circuit! Segueix aquestes pautes per mantenir el projecte net i funcional.

> [!TIP]
> Aquest és un monorepo gestionat amb **Turborepo**. Pots executar la majoria de tasques des de l'arrel del projecte.

## 🌿 Estratègia de Brancament

Utilitzem branques de funcionalitat:
- `feat/nom-funcionalitat`: Noves característiques.
- `fix/nom-error`: Correcció de bugs.
- `docs/descripció`: Millores en la documentació.

## 📝 Convenció de Commits

Seguim els **Conventional Commits**: `tipus(àmbit): descripció`
- `feat(mobile): afegeix seguiment d'usuari`
- `fix(api): corregeix consulta PostGIS`
- `chore(root): actualitza dependències`

## 🛠️ Estàndards de Desenvolupament

> [!IMPORTANT]
> Abans de pujar codi, assegura't que el linter no dona errors.

### Lògica Compartida
Si una funció o tipus s'utilitza en més d'un lloc, posa-ho a `packages/shared`.

### Comandes Recomanades
```bash
npm run dev     # Desenvolupament actiu
npm run lint    # Verificació d'estil
npm run test    # Execució de proves
npm run format  # Formatat automàtic
```

## 🚀 Procés de Pull Request

1. **Auto-revisió:** Revisa el teu codi buscant `console.log` o codi mort.
2. **Documentació:** Si canvies una funcionalitat, actualitza els documents rellevants a `docs/`.
3. **Vídeo/GIF:** Si canvies la UI o AR, inclou una mostra visual a la PR.

> [!CAUTION]
> No et saltis els **Git Hooks**. Estan per assegurar que el codi que s'envia és de qualitat.
