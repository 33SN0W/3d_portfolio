const fs = require('fs');
const zlib = require('zlib');

function inspectPng(filePath) {
  const buf = fs.readFileSync(filePath);
  console.log('File size:', buf.length);
  
  let pos = 8; // skip PNG signature
  let idatBuffers = [];
  let width, height, colorType;
  
  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    pos += 8;
    
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos);
      height = buf.readUInt32BE(pos + 4);
      colorType = buf[pos + 9];
      console.log('IHDR width:', width, 'height:', height, 'colorType:', colorType);
    } else if (type === 'IDAT') {
      idatBuffers.push(buf.slice(pos, pos + length));
    }
    pos += length + 4; // skip chunk data + CRC
  }
  
  const compressed = Buffer.concat(idatBuffers);
  try {
    const uncompressed = zlib.inflateSync(compressed);
    console.log('Uncompressed length:', uncompressed.length);
    // Parse color of first non-transparent pixel
    // Assuming RGBA (colorType 6)
    if (colorType === 6) {
      let bpp = 4;
      let stride = width * bpp + 1;
      let nonTransCount = 0;
      let samples = [];
      
      for (let y = 0; y < height; y++) {
        let rowStart = y * stride;
        let filterType = uncompressed[rowStart];
        for (let x = 0; x < width; x++) {
          let p = rowStart + 1 + x * bpp;
          let r = uncompressed[p];
          let g = uncompressed[p+1];
          let b = uncompressed[p+2];
          let a = uncompressed[p+3];
          if (a > 10) {
            nonTransCount++;
            if (samples.length < 10) {
              samples.push({ r, g, b, a });
            }
          }
        }
      }
      console.log('Total non-transparent pixels:', nonTransCount);
      console.log('Sample pixels:', samples);
    } else {
      console.log('Color type is not RGBA (6). It is:', colorType);
    }
  } catch (err) {
    console.error('Inflation error:', err);
  }
}

inspectPng('public/images/ferrari.png');
