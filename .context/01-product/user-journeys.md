# User Journeys

## Journey: Efficient Exit (Traffic Management)

- **Context:** The race has just finished. 100,000 people are leaving.
- **Action:** The user opens the app to find their car (saved in US34).
- **System:**
  1. Checks the user's saved parking coordinates.
  2. Queries the server for "Gate Congestion Levels".
  3. Directs the user to a secondary exit gate that takes 5 more minutes on foot but has 20 minutes less queue.
  4. Uses AR arrows to guide them through the crowd.

## Journey: Group Reunion

- **Context:** User A is at Grandstand G, User B is at the Food Truck Area.
- **Action:** User A presses "Find B".
- **System:**
  1. The server sends User B's last limited location (via Socket.io).
  2. The app draws a dynamic line on the map.
  3. As they get closer (<50m), the App suggests: "Switch to AR to locate your friend in the crowd."

## Journey: Finding Food and Drink (Restaurants)

- **Context:** The user wants to eat something during the race.
- **Action:** The user searches for the "Restaurants" category in the app.
- **System:**
  1. Shows available food options nearby.
  2. Indicates queue waiting time in real-time.
  3. Allows making the order and payment from the mobile for pickup.
  4. Sends a notification when the order is ready.

## Journey: Locating Services (Restrooms)

- **Context:** The user needs to use the restrooms.
- **Action:** The user selects "Restrooms" in the services menu or map.
- **System:**
  1. Locates the user's current position.
  2. Shows the nearest restrooms and their occupancy status (free/busy/queues).
  3. Guides the user to the chosen restroom with arrows on the map.

## Journey: Arrival at Seat (Grandstand / Standing Area)

- **Context:** The user has just entered and wants to find their assigned seat.
- **Action:** The user selects "My Ticket" or scans the QR code.
- **System:**
  1. Identifies the zone, gate, row, and seat from the ticket.
  2. Generates a step-by-step route from the current position to the exact spot.
  3. Uses augmented reality (AR) to signal the path and precise location.
