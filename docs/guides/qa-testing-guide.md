# Protocol de Control de Qualitat (QA) i Proves Físiques: Circuit Copilot

## 1. El Repte de l'Entorn

Aquesta aplicació no es pot validar només amb simuladors. El Circuit de Barcelona-Catalunya presenta condicions hostils per al maquinari mòbil:

1. **Llum Solar Directa:** Afecta la visibilitat de la pantalla i els sensors de la càmera (AR).
2. **Interferència Magnètica:** Les tribunes són d'acer i formigó, la qual cosa descalibra la brúixola digital.
3. **Ombra GPS (Multipath):** Les estructures altes fan rebotar el senyal GPS.
4. **Saturació de Xarxa:** 100.000 persones competint per l'ample de banda 4G/5G.

## 2. Piràmide de Proves: Estratègia Automatitzada

_Abans de sortir de l'oficina, el codi ha de passar aquests filtres:_

### A. Proves Unitàries i de Lògica (Shared & API)

- **Framework:** [Vitest](https://vitest.dev/).
- **Objectiu:** Validar algoritmes crítics, hooks de lògica i utilitats sense dependències natives.
- **Script:** `npm run test:logic -w mobile`
- **Configuració:** `vitest.config.ts` utilitza `setupTests.vitest.ts` per mockejar mòduls d'Expo i MapLibre.
- **Exemples:**
  - Càlcul de distància entre coordenades (lògica de proximitat de POIs).
  - Validació de formats de telemetria GPS (`poiUtils.ts`).

### B. Proves d'Endpoint (Integració API)

- **Framework:** Vitest + [Supertest](https://github.com/ladjs/supertest).
- **Objectiu:** Garantir que les rutes de l'API responen correctament amb els codis HTTP i esquemes de dades esperats.

### C. Proves de Components (Mòbil)

- **Framework:** [Jest](https://jestjs.io/) + [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/).
- **Objectiu:** Comprovar que les pantalles i components de la UI reaccionen correctament a diferents estats.
- **Script:** `npm run test:components -w mobile`
- **Configuració:** `jest.config.js` utilitza el preset `jest-expo` i `setupTests.jest.ts`.
- **Exemple:** Verificar que el botó d'AR es desactiva si `compass_accuracy` és nul o que els chips de filtrat canvien d'estat.

### D. Resum de Comandes de Prova

Des de l'arrel del projecte:
- `npm run test -w mobile`: Executa totes les proves (Vitest + Jest).
- `npm run test:logic -w mobile`: Només proves de lògica (més ràpides).
- `npm run test:components -w mobile`: Només proves de components UI.

## 3. Fase 1: Simulacions de Laboratori (Oficina)

_Abans d'anar al circuit, comprova això:_

| Cas de Prova              | Acció                                                                    | Resultat Esperat                                                                                    |
| ------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Simulació GPX**         | Carrega un fitxer `.gpx` amb una volta completa al circuit a l'emulador. | El punt blau es mou suaument per la pista sense salts.                                              |
| **Network Throttling**    | Posa el telèfon en mode "2G / Edge" (Ajustos de desenvolupador).         | El mapa base carrega (perquè està a la memòria cau offline) i la ruta es calcula en <3s.             |
| **Soroll de Brúixola**    | Sacseja el telèfon violentament mentre utilitzes AR.                     | Les fletxes han d'intentar mantenir-se estables, no girar com boges.                                |

## 3. Fase 2: Proves de Camp (In Situ)

_Proves obligatòries sobre el terreny real._

### A. La Prova de la "Tribuna de Metall" (Interferència Magnètica)

**Context:** Les brúixoles dels mòbils fallen a prop de grans masses de metall.

- **Ubicació:** Sota la Tribuna Principal o davant de la tanca de la recta.
- **Acció:** Obre el Mode AR.
- **Observació:** Cap a on apunta la fletxa?
- **Error Crític:** La fletxa apunta a la paret en lloc del camí.
- **Solució:** Si falla, l'app ha de detectar `compass_accuracy_low` i suggerir: _"Allunya't 2 metres de l'estructura metàl·lica"_ o canviar automàticament a Mapa 2D.

### B. La Prova "Multipath" (Rebot de Senyal GPS)

**Context:** El senyal GPS rebota a les grades i el telèfon pensa que ets a la pista.

- **Ubicació:** Passadís estret entre la Tribuna G i la Tribuna H.
- **Acció:** Camina en línia recta.
- **Observació:** Comprova si l'avatar al mapa fa salts d'un costat a l'altre (Zig-Zag).
- **Validació:** L'algoritme de "Map Matching" (ajust al camí) ha de mantenir l'usuari sobre el camí de vianants, ignorant salts de coordenades impossibles.

### C. Prova de "Llum Solar Extrema" (Visibilitat AR)

**Context:** El sol directe "encega" la càmera i sobreescalfa el mòbil.

- **Hora:** 12:00 PM - 02:00 PM (Sol Zenital).
- **Acció:** Utilitza l'AR durant 5 minuts continus apuntant a l'asfalt.
- **Riscos a mesurar:**

1. **Pèrdua de Contrast:** Es veuen les fletxes virtuals sobre l'asfalt gris clar? (Haurien de tenir un vora negra o una ombra forta).
2. **Pèrdua de Tracking:** Si el terra no té textura (és molt llis i brilla), ViroReact perdrà l'ancoratge.
3. **Sobreescalfament:** El telèfon treu l'avís de temperatura?

## 4. Fase 3: Proves d'Estrès (Simulació de Cursa)

### El Viatge d'1 km

Un tester ha de completar tot aquest recorregut sense tancar l'app:

1. **Inici:** Pàrquing F.
2. **Destí:** Seient a la Tribuna N.
3. **Condicions:**
  - 100% de brillantor de pantalla.
  - Dades mòbils desactivades (Simulant col·lapse de xarxa).
  - Bluetooth activat (Auriculars).

4. **Criteris d'Acceptació:**
  - **Bateria:** No hauria de baixar més del 8% en aquest trajecte (~15 minuts).
  - **Navegació:** No hauria de requerir reiniciar l'app.
  - **Àudio:** Les instruccions de veu ("Gira a la dreta") han de ser audibles per sobre de la remor ambiental (simula soroll de motors o gent).

## 5. Report de l'Error (Format Estàndard)

Quan els testers informin de fallades des del circuit, han d'incloure:

- **Coordenades Exactes:** (Copiar i enganxar des del mode debug).
- **Condicions del Cel:** (Sol / Núvols / Pluja). _La pluja afecta la pantalla tàctil._
- **Orientació del Dispositiu:** (Vertical / Horitzontal).
- **Captura de pantalla del món debug d'AR:** (Per veure punts d'ancoratge virtual detectats pel sistema).
