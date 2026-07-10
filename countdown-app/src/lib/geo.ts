import type { Feature, Position } from "geojson";

// レイキャスティング法による点の多角形内判定。
// 都道府県ポリゴン（GeoJSON）に対して「このイベントの場所はどの県か」を調べるために使う。
function inRing(pt: [number, number], ring: Position[]): boolean {
  const [x, y] = pt;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// GeoJSON Feature（Polygon / MultiPolygon）が点 (lng, lat) を含むか。
// 注意: 使用している県ポリゴンは大きく単純化してあるため、海岸線ぎりぎりの
// 地点は判定から漏れることがある（リスト表示用途なので許容）。
export function pointInFeature(lng: number, lat: number, feature: Feature): boolean {
  const geom = feature.geometry;
  const pt: [number, number] = [lng, lat];
  const polyContains = (coords: Position[][]) =>
    inRing(pt, coords[0]) && !coords.slice(1).some((hole) => inRing(pt, hole));
  if (geom.type === "Polygon") return polyContains(geom.coordinates);
  if (geom.type === "MultiPolygon") return geom.coordinates.some(polyContains);
  return false;
}
