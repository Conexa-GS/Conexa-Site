const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/* Interpolate x over y. Shared, monotone tangents make broad bends without
   hooks, corners or vertical backtracking, including at the loading stop. */
export function smoothRoad(points) {
  if (points.length < 2 || points.some((p, i) => !Number.isFinite(p.x + p.y) || (i > 0 && p.y <= points[i - 1].y))) {
    throw new Error('Road anchors must be finite and increase vertically')
  }
  const slopes = points.slice(1).map((p, i) => (p.x - points[i].x) / (p.y - points[i].y))
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0]
    if (i === points.length - 1) return slopes.at(-1)
    const a = slopes[i - 1], b = slopes[i]
    return a * b <= 0 ? 0 : 2 * a * b / (a + b)
  })
  const segments = points.slice(1).map((end, i) => {
    const start = points[i], dy = (end.y - start.y) / 3
    return { start, c1: { x: start.x + tangents[i] * dy, y: start.y + dy }, c2: { x: end.x - tangents[i + 1] * dy, y: end.y - dy }, end }
  })
  return { segments, d: `M${points[0].x},${points[0].y} ` + segments.map(s => `C${s.c1.x},${s.c1.y} ${s.c2.x},${s.c2.y} ${s.end.x},${s.end.y}`).join(' ') }
}

export function journeyRoute({ depot, farm, market, width, mobile, scale, collection, delivery }) {
  let points
  if (mobile) {
    const right = width - 12, left = 12
    points = [depot,
      { x: right, y: depot.y + (farm.y - depot.y) * .18 },
      { x: right, y: farm.y - 210 }, farm,
      { x: left, y: farm.y + 210 },
      { x: left, y: market.y - 230 }, market]
  } else {
    const halfTruck = 160 * scale
    const laneOut = clamp(collection.left - halfTruck - 40, farm.x + 50, depot.x - 50)
    const laneIn = clamp(delivery.right + halfTruck + 40, farm.x + 50, market.x - 50)
    points = [depot,
      { x: laneOut, y: clamp(collection.top - 100, depot.y + (farm.y - depot.y) * .24, farm.y - 150) }, farm,
      { x: laneIn, y: clamp(delivery.top + 40, farm.y + 160, market.y - 200) }, market]
  }
  return smoothRoad(points)
}
