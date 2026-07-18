import fs from "fs";
import sharp from "sharp";

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <style>
    .icon {
      fill: none;
      stroke: #4de2ff; /* --accent electric cyan in dark theme */
      stroke-width: 2.25;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    @media (prefers-color-scheme: light) {
      .icon {
        stroke: #006699; /* --accent blue/cyan in light theme */
      }
    }
  </style>
  <path class="icon" d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
  <circle class="icon" cx="12" cy="12" r="3"/>
</svg>`;

async function main() {
  console.log("Generating favicons...");

  // 1. Write the vector SVG favicon
  const svgPath = "./public/favicon.svg";
  fs.writeFileSync(svgPath, svgContent);
  console.log(`  Saved vector SVG favicon to ${svgPath}`);

  // 2. Compile legacy favicon.ico using sharp
  // We render the default dark-theme style (bright cyan) for the fallback .ico
  try {
    const pngBuffer = await sharp(Buffer.from(svgContent)).resize(32, 32).png().toBuffer();

    // Construct a standard single-image ICO container header (22 bytes)
    const icoHeader = Buffer.alloc(22);
    icoHeader.writeUInt16LE(0, 0); // Reserved (0)
    icoHeader.writeUInt16LE(1, 2); // Type (1 = ICO)
    icoHeader.writeUInt16LE(1, 4); // Number of images (1)
    icoHeader.writeUInt8(32, 6); // Width (32px)
    icoHeader.writeUInt8(32, 7); // Height (32px)
    icoHeader.writeUInt8(0, 8); // Color count (0 = 256+ colors)
    icoHeader.writeUInt8(0, 9); // Reserved (0)
    icoHeader.writeUInt16LE(1, 10); // Color planes (1)
    icoHeader.writeUInt16LE(32, 12); // Bits per pixel (32 bpp)
    icoHeader.writeUInt32LE(pngBuffer.length, 14); // Image data size in bytes
    icoHeader.writeUInt32LE(22, 18); // Offset of image data in file (22)

    const icoBuffer = Buffer.concat([icoHeader, pngBuffer]);
    const icoPath = "./public/favicon.ico";
    fs.writeFileSync(icoPath, icoBuffer);
    console.log(
      `  Compiled and saved legacy favicon.ico to ${icoPath} (${icoBuffer.length} bytes)`,
    );
  } catch (err) {
    console.error("  Error generating favicon.ico:", err.message);
  }
}

main();
