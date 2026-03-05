import { db, nodes, pathSegments, pointsOfInterest, sql, eq } from '@app/db';

interface Node {
  id: number;
  location: { x: number; y: number };
}

interface Edge {
  source: number;
  target: number;
  distance: number;
  hasStairs: boolean;
  crowdLevel: string;
}

export async function findRoute(
  origin: { lat?: number; lng?: number; poiId?: number },
  destination: { lat?: number; lng?: number; poiId?: number },
  options: { avoidStairs?: boolean } = {}
) {
  // Helper to resolve coordinates from POI or lat/lng
  const resolveCoords = async (input: { lat?: number; lng?: number; poiId?: number }) => {
    if (input.poiId) {
      const [poi] = await db
        .select({
          location: sql<string>`ST_AsText(location)`
        })
        .from(pointsOfInterest)
        .where(eq(pointsOfInterest.id, input.poiId));
      
      if (!poi) throw new Error(`POI with ID ${input.poiId} not found`);
      const match = poi.location.match(/POINT\((.+) (.+)\)/);
      if (!match) throw new Error('Invalid POI location format');
      return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }
    if (input.lat !== undefined && input.lng !== undefined) {
      return { lat: input.lat, lng: input.lng };
    }
    throw new Error('Invalid origin or destination: must provide coordinates or poiId');
  };

  const startCoords = await resolveCoords(origin);
  const endCoords = await resolveCoords(destination);

  // 1. Fetch nearest nodes to origin and destination
  const [startNode] = await db
    .select({
      id: nodes.id,
      distance: sql<number>`ST_Distance(location, ST_SetSRID(ST_Point(${startCoords.lng}, ${startCoords.lat}), 4326)::geography)`
    })
    .from(nodes)
    .orderBy(sql`location <-> ST_SetSRID(ST_Point(${startCoords.lng}, ${startCoords.lat}), 4326)`)
    .limit(1);

  const [endNode] = await db
    .select({
      id: nodes.id,
      distance: sql<number>`ST_Distance(location, ST_SetSRID(ST_Point(${endCoords.lng}, ${endCoords.lat}), 4326)::geography)`
    })
    .from(nodes)
    .orderBy(sql`location <-> ST_SetSRID(ST_Point(${endCoords.lng}, ${endCoords.lat}), 4326)`)
    .limit(1);


  if (!startNode || !endNode) {
    throw new Error('Could not find nearest nodes');
  }

  // 2. Fetch all nodes and edges (segments)
  // For production, we might want to limit this to a bounding box or use a more efficient graph representation
  const allNodes = await db.select().from(nodes);
  const allEdges = await db.select().from(pathSegments);

  // 3. Build Adjacency List
  const graph: Record<number, { target: number; weight: number; hasStairs: boolean }[]> = {};
  allNodes.forEach(n => graph[n.id] = []);
  
  allEdges.forEach(e => {
    // Skip if stairs are to be avoided
    if (options.avoidStairs && e.hasStairs) return;

    // Weight can be adjusted by crowd level in the future
    let weight = e.distance;
    if (e.crowdLevel === 'high') weight *= 1.5;
    if (e.crowdLevel === 'blocked') weight *= 10;

    graph[e.sourceNodeId].push({ target: e.targetNodeId, weight, hasStairs: !!e.hasStairs });
  });

  // 4. Dijkstra Algorithm
  const distances: Record<number, number> = {};
  const previous: Record<number, number | null> = {};
  const queue: number[] = [];

  allNodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    queue.push(node.id);
  });

  distances[startNode.id] = 0;

  while (queue.length > 0) {
    // Extract node with minimum distance
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift()!;

    if (u === endNode.id) break;
    if (distances[u] === Infinity) break;

    const neighbors = graph[u] || [];
    for (const neighbor of neighbors) {
      const alt = distances[u] + neighbor.weight;
      if (alt < distances[neighbor.target]) {
        distances[neighbor.target] = alt;
        previous[neighbor.target] = u;
      }
    }
  }

  // 5. Reconstruct Path
  const pathNodes: number[] = [];
  let curr: number | null = endNode.id;
  while (curr !== null) {
    pathNodes.unshift(curr);
    curr = previous[curr];
  }

  if (pathNodes[0] !== startNode.id) {
    throw new Error('No path found');
  }

  // 6. Fetch Node Coordinates for Path
  const resultNodes = await db
    .select({
      id: nodes.id,
      location: sql<string>`ST_AsGeoJSON(location)`
    })
    .from(nodes)
    .where(sql`${nodes.id} IN (${sql.join(pathNodes, sql`, `)})`);

  // Map results back to path order
  const nodeMap = new Map(resultNodes.map(n => [n.id, JSON.parse(n.location)]));
  const coordinates = pathNodes.map(id => nodeMap.get(id).coordinates);

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates
    },
    properties: {
      distance: distances[endNode.id],
      durationEstimate: Math.round(distances[endNode.id] / 1.4) // Assuming 1.4 m/s walking speed
    }
  };
}
