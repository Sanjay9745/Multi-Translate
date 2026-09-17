import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePNG(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with filter byte per scanline
  const rawScanlines = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.42;

  for (let y = 0; y < height; y++) {
    rawScanlines[offset++] = 0; // Filter 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let rCol = 37, gCol = 99, bCol = 235, aCol = 255; // #2563eb Blue

      // Outer circle border
      if (Math.abs(dist - r) < width * 0.03) {
        rCol = 255; gCol = 255; bCol = 255;
      }
      // Horizontal equator
      else if (dist < r && Math.abs(dy) < width * 0.02) {
        rCol = 255; gCol = 255; bCol = 255;
      }
      // Vertical meridian
      else if (dist < r && Math.abs(dx) < width * 0.02) {
        rCol = 255; gCol = 255; bCol = 255;
      }
      // Language badges
      else if (Math.sqrt((x - width * 0.72) ** 2 + (y - height * 0.72) ** 2) < width * 0.15) {
        rCol = 16; gCol = 185; bCol = 129; // Green #10b981
      }
      else if (Math.sqrt((x - width * 0.28) ** 2 + (y - height * 0.28) ** 2) < width * 0.15) {
        rCol = 245; gCol = 158; bCol = 11; // Amber #f59e0b
      }

      rawScanlines[offset++] = rCol;
      rawScanlines[offset++] = gCol;
      rawScanlines[offset++] = bCol;
      rawScanlines[offset++] = aCol;
    }
  }

  const compressedData = zlib.deflateSync(rawScanlines);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), generatePNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), generatePNG(512, 512));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), generatePNG(512, 512));

console.log('Successfully generated PWA PNG icons in public/icons/');
