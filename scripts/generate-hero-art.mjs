import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const width = 1400;
const height = 1000;
const pixels = Buffer.alloc(width * height * 4);

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));

function blendPixel(x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const i = (Math.floor(y) * width + Math.floor(x)) * 4;
  const inv = 1 - alpha;
  pixels[i] = clamp(pixels[i] * inv + color[0] * alpha);
  pixels[i + 1] = clamp(pixels[i + 1] * inv + color[1] * alpha);
  pixels[i + 2] = clamp(pixels[i + 2] * inv + color[2] * alpha);
  pixels[i + 3] = 255;
}

function drawLine(x0, y0, x1, y1, color, alpha = 1, thickness = 1) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  for (let i = 0; i <= steps; i += 1) {
    const x = x0 + (dx * i) / steps;
    const y = y0 + (dy * i) / steps;
    for (let ox = -thickness; ox <= thickness; ox += 1) {
      for (let oy = -thickness; oy <= thickness; oy += 1) {
        if (ox * ox + oy * oy <= thickness * thickness + 0.5) {
          blendPixel(x + ox, y + oy, color, alpha);
        }
      }
    }
  }
}

function fillRect(x, y, w, h, color, alpha = 1) {
  for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy += 1) {
    for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx += 1) {
      blendPixel(xx, yy, color, alpha);
    }
  }
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function fillPolygon(points, color, alpha = 1) {
  const minX = Math.max(0, Math.floor(Math.min(...points.map((p) => p[0]))));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(...points.map((p) => p[0]))));
  const minY = Math.max(0, Math.floor(Math.min(...points.map((p) => p[1]))));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(...points.map((p) => p[1]))));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (pointInPolygon(x, y, points)) blendPixel(x, y, color, alpha);
    }
  }
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * 4;
    const nx = x / width;
    const ny = y / height;
    const rightField = Math.max(0, 1 - Math.hypot(nx - 0.76, ny - 0.44) * 1.35);
    const lowerField = Math.max(0, 1 - Math.hypot(nx - 0.38, ny - 1.08) * 1.2);
    const scan = Math.sin((x + y) * 0.016) * 4;
    const noise = ((x * 17 + y * 29 + ((x * y) % 101)) % 23) - 11;

    pixels[i] = clamp(4 + rightField * 44 + lowerField * 18 + scan + noise * 0.42);
    pixels[i + 1] = clamp(8 + rightField * 60 + lowerField * 22 + scan + noise * 0.36);
    pixels[i + 2] = clamp(16 + rightField * 72 + lowerField * 34 + scan + noise * 0.5);
    pixels[i + 3] = 255;
  }
}

const peach = [255, 132, 98];
const cyan = [88, 225, 255];
const mint = [135, 255, 190];
const violet = [169, 139, 255];
const slate = [22, 34, 50];

fillPolygon(
  [
    [620, 140],
    [1120, 40],
    [1320, 270],
    [740, 390],
  ],
  cyan,
  0.08,
);
fillPolygon(
  [
    [850, 520],
    [1390, 430],
    [1390, 760],
    [940, 860],
  ],
  peach,
  0.1,
);
fillPolygon(
  [
    [140, 740],
    [620, 600],
    [780, 860],
    [260, 980],
  ],
  mint,
  0.075,
);

for (let i = 0; i < 26; i += 1) {
  const y = 120 + i * 32;
  const alpha = i % 4 === 0 ? 0.2 : 0.08;
  drawLine(0, y, width, y - 150, [86, 118, 148], alpha, i % 4 === 0 ? 1 : 0);
}

for (let i = 0; i < 20; i += 1) {
  const x = 520 + i * 44;
  drawLine(x, 0, x - 280, height, [76, 105, 134], i % 5 === 0 ? 0.17 : 0.07, 0);
}

for (let i = 0; i < 44; i += 1) {
  const startX = 80 + ((i * 73) % 1040);
  const startY = 90 + ((i * 47) % 720);
  const midX = startX + 45 + ((i * 19) % 140);
  const midY = startY + (i % 2 === 0 ? -32 : 32);
  const endX = midX + 90 + ((i * 13) % 120);
  const color = i % 5 === 0 ? peach : i % 3 === 0 ? mint : cyan;
  const alpha = i % 5 === 0 ? 0.42 : 0.24;
  drawLine(startX, startY, midX, startY, color, alpha, 1);
  drawLine(midX, startY, midX, midY, color, alpha * 0.8, 1);
  drawLine(midX, midY, endX, midY, color, alpha, 1);
  fillRect(endX - 3, midY - 3, 7, 7, color, alpha * 0.95);
}

for (let layer = 0; layer < 3; layer += 1) {
  const offset = layer * 26;
  fillPolygon(
    [
      [760 + offset, 250 + offset],
      [1015 + offset, 302 + offset],
      [990 + offset, 620 + offset],
      [700 + offset, 560 + offset],
    ],
    layer === 0 ? slate : layer === 1 ? violet : cyan,
    layer === 0 ? 0.62 : 0.11,
  );
  drawLine(760 + offset, 250 + offset, 1015 + offset, 302 + offset, cyan, 0.42, 2);
  drawLine(1015 + offset, 302 + offset, 990 + offset, 620 + offset, peach, 0.34, 2);
  drawLine(990 + offset, 620 + offset, 700 + offset, 560 + offset, mint, 0.24, 2);
  drawLine(700 + offset, 560 + offset, 760 + offset, 250 + offset, violet, 0.28, 2);
}

for (let row = 0; row < 11; row += 1) {
  for (let col = 0; col < 9; col += 1) {
    const x = 744 + col * 27 + row * 4;
    const y = 312 + row * 22 + col * 2;
    const color = (row + col) % 4 === 0 ? peach : (row + col) % 3 === 0 ? mint : cyan;
    fillRect(x, y, 12, 5, color, 0.18 + ((row + col) % 5) * 0.045);
  }
}

for (let i = 0; i < 7; i += 1) {
  const inset = i * 18;
  drawLine(670 - inset, 208 + inset, 1070 + inset, 282 + inset, peach, 0.08, 2);
  drawLine(1070 + inset, 282 + inset, 1028 + inset, 686 - inset, cyan, 0.08, 2);
}

const raw = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y += 1) {
  raw[y * (width * 4 + 1)] = 0;
  pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;

writeFileSync(
  "public/peach-hero-art.png",
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]),
);
