# User Journeys (Viatges de l'Usuari)

## Journey: Sortida Eficient (Gestió de Trànsit)

- **Context:** La cursa acaba de finalitzar. 100.000 persones estan marxant.
- **Acció:** L'usuari obre l'app per trobar el seu cotxe (guardat a US34).
- **Sistema:**
  1. Comprova les coordenades de pàrquing guardades de l'usuari.
  2. Consulta al servidor els "Nivells de Congestió de les Portes".
  3. Dirigeix l'usuari a una porta de sortida secundària que triga 5 minuts més a peu però té 20 minuts menys de cua.
  4. Utilitza fletxes d'AR per guiar-los a través de la multitud.

## Journey: Retrobament de Grup

- **Context:** L'Usuari A està a la Tribuna G, l'Usuari B està a l'àrea de Food Trucks.
- **Acció:** L'Usuari A prem "Troba el B".
- **Sistema:**
  1. El servidor envia l'última ubicació limitada de l'Usuari B (via Socket.io).
  2. L'app dibuixa una línia dinàmica al mapa.
  3. A mesura que s'apropen (<50m), l'App suggereix: "Canvia a AR per localitzar el teu amic en la multitud."

## Journey: Trobar Menjar i Beguda (Restaurants)

- **Context:** L'usuari vol menjar alguna cosa durant la cursa.
- **Acció:** L'usuari cerca la categoria "Restaurants" a l'app.
- **Sistema:**
  1. Mostra les opcions de menjar disponibles a prop.
  2. Indica el temps d'espera en cua en temps real.
  3. Permet fer la comanda i el pagament des del mòbil per recollir.
  4. Envia una notificació quan la comanda està llesta.

## Journey: Localització de Serveis (Lavabos)

- **Context:** L'usuari necessita anar als lavabos.
- **Acció:** L'usuari selecciona "Lavabos" al menú de serveis o al mapa.
- **Sistema:**
  1. Localitza la posició actual de l'usuari.
  2. Mostra els lavabos més propers i el seu estat d'ocupació (lliure/ocupat/cues).
  3. Guia l'usuari fins al lavabo triat amb fletxes al mapa.

## Journey: Arribada al Seient (Tribuna / Pelouse)

- **Context:** L'usuari acaba d'entrar i vol trobar el seu seient assignat.
- **Acció:** L'usuari selecciona "La meva entrada" o escaneja el codi QR.
- **Sistema:**
  1. Identifica la zona, porta, fila i seient a partir de l'entrada.
  2. Genera una ruta pas a pas des de la posició actual fins al lloc exacte.
  3. Utilitza realitat augmentada (AR) per senyalitzar el camí i la ubicació precisa.
