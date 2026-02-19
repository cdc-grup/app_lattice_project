# Sistema de Disseny: Circuit Copilot

Aquest document defineix els estàndards visuals per garantir una experiència premium i coherent a tota l'aplicació.

## 🎨 Paleta de Colors (Semàntica)

Utilitzem un sistema de **Tokens Semàntics** basat en `colors.ts` i variables CSS. Això permet que l'app sigui fàcilment personalitzable per a diferents circuits o esdeveniments.

| Token | CSS Variable | Descripció |
| :--- | :--- | :--- |
| `primary` | `--primary` | Color principal de la marca (Vermell Circuit). |
| `background` | `--background` | Color de fons principal (Fons fosc premium). |
| `secondary` | `--secondary` | Superfícies secundàries i targetes. |
| `muted` | `--muted` | Textos i elements de baixa prioritat. |
| `accent` | `--accent` | Elements cridaners i interaccions. |

## 📐 Tipografia i Radi

- **Radi de Vora:** Utilitzem radis grans (`rounded-2xl`, `rounded-3xl`) per a un aspecte modern i suau.
- **Tipografia:** Es prioritza la llegibilitat en entorns d'alta vibració (com un circuit).

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

Per garantir la màxima escalabilitat i mantenibilitat, hem implementat un model de **"Font de la Veritat Única" (Single Source of Truth - SSOT)**.

### 1. El Nucli (`src/theme/colors.ts`)
Aquest fitxer és l'origen de totes les definicions cromàtiques.
- **Funció:** Defineix els valors Hexadecimals/RGBA en un objecte TypeScript.
- **Utilitat:** Proporciona suport natiu per a llibreries de tercers (Mapbox, Reanimated, Charts) que requereixen dades tipades en temps d'execució.

### 2. El Pont de Sincronització (`global.css`)
Les definicions de `colors.ts` es traslladen a variables CSS en l'arrel de l'aplicació.
- **Implementació:** Utilitzem el bloc `@layer base` per definir variables com `--primary` o `--background`.
- **Avantatge:** Permet que qualsevol motor de renderitzat que suporti CSS (com NativeWind) consumeixi els mateixos valors que el codi JavaScript.

### 3. La Capa d'Interfície (NativeWind + `tailwind.config.js`)
El motor de Tailwind consumeix les variables CSS.
- **Configuració:** S'estén el tema de Tailwind per mapar els colors semàntics (ex: `primary`) a les variables CSS (`var(--primary)`).
- **Consum:** Els desenvolupadors utilitzen classes estàndard com `text-primary` o `bg-background`.

## 📈 Beneficis de l'Enfocament
- **Manteniment Centralitzat:** Un únic canvi a `colors.ts` es propaga instantàniament a tota la infraestructura visual (JS i CSS).
- **Robustesa:** Elimina la duplicitat de codis hexadecimals, reduint errors humans i inconsistències visuals.
- **Preparat per Multitema:** L'arquitectura basada en variables CSS està preparada per suportar Mode Clar/Fosc o "branding" dinàmic per circuit sense refactoritzacions de codi.
