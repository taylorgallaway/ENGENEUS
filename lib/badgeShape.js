// Generates a spiky rosette/star shape as a CSS clip-path — this is what turns a
// plain circle into a real "award seal" outline. Fully reusable: change the point
// count or radius ratio to make it spikier, rounder, more or fewer points.
export function starClipPath(points = 10, outerRadius = 50, innerRadius = 36) {
  const coords = [];
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    coords.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return `polygon(${coords.join(', ')})`;
}
