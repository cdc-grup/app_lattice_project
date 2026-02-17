# 🤝 Contributing to Circuit Copilot

Thank you for helping us improve the circuit experience! Follow these guidelines to keep the project clean and functional.

> [!TIP]
> This is a monorepo managed with **Turborepo**. You can run most tasks from the project root.

## 🌿 Branching Strategy

We use feature branches:
- `feat/feature-name`: New features.
- `fix/error-name`: Bug fixes.
- `docs/description`: Documentation improvements.

## 📝 Commit Convention

We follow **Conventional Commits**: `type(scope): description`
- `feat(mobile): add user tracking`
- `fix(api): fix PostGIS query`
- `chore(root): update dependencies`

## 🛠️ Development Standards

> [!IMPORTANT]
> Before pushing code, make sure the linter does not give errors.

### Shared Logic
If a function or type is used in more than one place, put it in `packages/shared`.

### Recommended Commands
```bash
npm run dev     # Active development
npm run lint    # Style verification
npm run test    # Test execution
npm run format  # Automatic formatting
```

## 🚀 Pull Request Process

1. **Self-review:** Review your code looking for `console.log` or dead code.
2. **Documentation:** If you change a feature, update the relevant documents in `docs/`.
3. **Video/GIF:** If you change the UI or AR, include a visual sample in the PR.

> [!CAUTION]
> Do not skip the **Git Hooks**. They are there to ensure that the code sent is of quality.
