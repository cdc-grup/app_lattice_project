# Sistema de Disseny: Circuit Copilot

Aquest document defineix els estàndards visuals per garantir una experiència premium i coherent a tota l'aplicació.

## 🧠 Filosofia de Disseny: "Mixed Style"

Aquesta interfície fusiona l'elegància i claredat del **disseny de Cupertino** amb l'estructura i funcionalitat del **disseny Material**, creant una experiència premium, senzilla i universal.

### Pilars Fonamentals:
1.  **Claredat Estètica**: Ús de materials translúcids (**Glassmorphism**) i radis de vora suaus (**rounded-2xl/3xl**).
2.  **Integritat Estructural**: Estratificació semàntica (Fons -> Superficie -> Sobrecapa) i ombres suaus per indicar interacció.
3.  **Simplicitat Universal**: Reducció del soroll visual i prioritat absoluta a la tipografia i l'espai en blanc.

## 🎨 Paleta de Colors (Semàntica)

Utilitzem un sistema de **Tokens Semàntics** basat en `colors.ts` i variables CSS. Això permet que l'app sigui fàcilment personalitzable per a diferents circuits o esdeveniments.

| Token | CSS Variable | Descripció |
| :--- | :--- | :--- |
| `primary` | `--primary` | Color principal de la marca (Vermell Circuit). |
| `background` | `--background` | Color de fons principal (Fons fosc premium). |
| `secondary` | `--secondary` | Superfícies secundàries i targetes. |
| `muted` | `--muted` | Textos i elements de baixa prioritat. |
| `accent` | `--accent` | Elements cridaners i interaccions. |
| `glass` | `--glass` | Material translúcid per a superfícies flotants. |

## 📐 Tipografia i Radi

- **Radi de Vora:** Utilitzem radis grans (`rounded-2xl`, `rounded-3xl`) per a un aspecte modern i suau.
- **Tipografia:** Hem implementat la font **Inter** com el pilar central de lectura.
  - `font-sans`: Inter Regular (400)
  - `font-medium`: Inter Medium (500)
  - `font-bold`: Inter Bold (700)
  - `font-black`: Inter Black (900)
- **Escalabilitat tipogràfica:** Les fonts s'integren mitjançant un sistema de *Font Mapping* centralitzat.

## ✨ Efectes Premium

### 1. Glassmorphism
Utilitzeu les classes de Tailwind per crear superfícies translúcides:
```html
<View className="bg-white/10 border border-white/20 backdrop-blur-lg">
  ...
</View>
```

### 2. Glow (Resplendor)
Efecte per ressaltar elements clau:
```html
<View className="shadow-lg shadow-primary/40">
  ...
</View>
```

## 🏗️ Arquitectura del Sistema (Sincronització)

Per garantir la màxima escalabilitat i mantenibilitat, seguim el model de **"Font de la Veritat Única" (SSOT)**.

### 1. El Nucli (`src/styles/colors.ts`)
Aquest fitxer és l'origen **únic** de totes les definicions visuals.
- **Regla d'Escalabilitat**: Està totalment prohibit definir colors o estils directament a `global.css`. Qualsevol nou color o token s'ha de donar d'alta primer aquí.

### 2. El Pont de Sincronització (`global.css`)
Aquest fitxer s'ha de mantenir net de lògica visual. Només conté les directives de Tailwind i, si és necessari, el mapatge de variables que es consumeixen des de NativeWind, però **mai valors hardcoded**.

### 3. La Capa d'Interfície (NativeWind + `tailwind.config.js`)
El motor de Tailwind s'encarrega d'injectar les variables definides al nucli de TypeScript cap al CSS de forma automatitzada o via configuració de tema.

## 📦 Arquitectura de Components (Atomicity)

L'aplicació segueix un enfocament de **Components Atòmics** per garantir la coherència visual i la reutilització de codi.

### 1. El UI Kit (`src/components/ui`)
Conté els "madrilles" bàsics de la interfície. Aquests components són totalment visuals i no tenen lògica de negoci.
- **`Typography`**: Gestiona els diferents pesos de la font Inter de forma consistent.
- **`Button / TextField`**: (Projectats) Components que asseguren que el feedback visual i hàptic sigui idèntic en tota l'app.

### 2. Components de Negoci (`src/components/...)
Components més complexos que utilitzen el UI Kit però que tenen consciència de les dades del circuit.

## 🔡 Sistema de Tipografia (Sincronització)

Igual que amb els colors, la tipografia segueix un flux professional:

1. **Configuració (`src/theme/typography.ts`)**: Defineix el mapa semàntic de les fonts.
2. **Càrrega (`src/hooks/useAppFonts.ts`)**: Hook centralitzat que gestiona la càrrega d'assets i la `SplashScreen`.
3. **Mapatge Tailwind**: Registre al `tailwind.config.js` per permetre l'ús de classes `font-*`.

## 📈 Beneficis de l'Enfocament
- **Manteniment Centralitzat:** Un únic canvi a `colors.ts` es propaga instantàniament a tota la infraestructura visual (JS i CSS).
- **Robustesa:** Elimina la duplicitat de codis hexadecimals, reduint errors humans i inconsistències visuals.
- **Preparat per Multitema:** L'arquitectura basada en variables CSS està preparada per suportar Mode Clar/Fosc o "branding" dinàmic per circuit sense refactoritzacions de codi.
