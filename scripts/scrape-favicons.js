import fs from "fs";
import path from "path";
import sharp from "sharp";

// Single source of truth: the content collection. Each favicon is scraped from
// a project's `links.site`, keyed by its JSON filename (which is also the
// collection id ProjectCard resolves the favicon against). Adding a project to
// src/content/projects/ is enough; there is no separate list to keep in sync.
const contentDir = "./src/content/projects";
const projects = fs
  .readdirSync(contentDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
    return { name: path.basename(file, ".json"), url: data.links?.site };
  })
  .filter((proj) => proj.url);

const destDir = "./src/assets/projects";
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Helper to remove any old favicon files with different extensions for a project
function cleanupOldExtensions(name, currentExt) {
  const extensions = [".ico", ".png", ".svg", ".jpg", ".jpeg"];
  for (const otherExt of extensions) {
    if (otherExt !== currentExt) {
      const pathToRemove = path.join(destDir, `${name}-favicon${otherExt}`);
      if (fs.existsSync(pathToRemove)) {
        fs.unlinkSync(pathToRemove);
        console.log(`  Removed old format file: ${pathToRemove}`);
      }
    }
  }
}

async function scrapeFavicon(name, siteUrl) {
  console.log(`Scraping favicon for ${name} from ${siteUrl}...`);
  try {
    const response = await fetch(siteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch site HTML: ${response.statusText}`);
    }
    const html = await response.text();

    // Regex to scan for link tags specifying icon format
    const linkRegex = /<link\s+[^>]*rel=["'](?:shortcut\s+)?icon["'][^>]*>/gi;
    let match;
    let iconUrl = null;

    while ((match = linkRegex.exec(html)) !== null) {
      const tag = match[0];
      const hrefMatch = /href=(["'])(.*?)\1/i.exec(tag);
      if (hrefMatch) {
        iconUrl = hrefMatch[2];
        break;
      }
    }

    if (!iconUrl) {
      // Fallback: search for apple-touch-icon
      const appleTouchRegex = /<link\s+[^>]*rel=["']apple-touch-icon["'][^>]*>/gi;
      const appleMatch = appleTouchRegex.exec(html);
      if (appleMatch) {
        const hrefMatch = /href=(["'])(.*?)\1/i.exec(appleMatch[0]);
        if (hrefMatch) {
          iconUrl = hrefMatch[2];
        }
      }
    }

    if (!iconUrl) {
      // Fallback to domain's standard favicon.ico
      const urlObj = new URL(siteUrl);
      iconUrl = `${urlObj.origin}/favicon.ico`;
      console.log(`  No link icon found in HTML. Falling back to default: ${iconUrl}`);
    }

    // Handle Inline data URI icons (e.g. parallax-web)
    if (iconUrl.startsWith("data:")) {
      console.log(`  Found inline data URI icon`);
      const commaIdx = iconUrl.indexOf(",");
      if (commaIdx !== -1) {
        const meta = iconUrl.substring(0, commaIdx);
        const rawData = iconUrl.substring(commaIdx + 1);
        let buffer;
        let ext = ".png";

        if (meta.includes("base64")) {
          buffer = Buffer.from(rawData, "base64");
        } else {
          buffer = Buffer.from(decodeURIComponent(rawData));
        }

        if (meta.includes("svg")) {
          ext = ".svg";
        }

        // Optimize if it is a raster image
        if (ext === ".png" && buffer.length > 0) {
          try {
            const metadata = await sharp(buffer).metadata();
            if (metadata.width > 32 || metadata.height > 32) {
              console.log(
                `  Inline image is ${metadata.width}x${metadata.height}. Resizing to 32x32...`,
              );
              buffer = await sharp(buffer).resize(32, 32, { fit: "contain" }).png().toBuffer();
            }
          } catch (err) {
            console.warn(`  Failed to resize inline image: ${err.message}`);
          }
        }

        const destPath = path.join(destDir, `${name}-favicon${ext}`);
        fs.writeFileSync(destPath, buffer);
        console.log(`  Successfully decoded and saved data URI favicon to ${destPath}`);
        cleanupOldExtensions(name, ext);
        return;
      }
    }

    // Resolve relative URLs for remote files
    if (!iconUrl.startsWith("http://") && !iconUrl.startsWith("https://")) {
      const urlObj = new URL(siteUrl);
      if (iconUrl.startsWith("//")) {
        iconUrl = `${urlObj.protocol}${iconUrl}`;
      } else if (iconUrl.startsWith("/")) {
        iconUrl = `${urlObj.origin}${iconUrl}`;
      } else {
        // Relative to current directory path of URL
        const basePath = urlObj.pathname.endsWith("/")
          ? urlObj.pathname
          : path.dirname(urlObj.pathname);
        const cleanBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
        iconUrl = `${urlObj.origin}${cleanBasePath}${iconUrl}`;
      }
    }
    console.log(`  Found icon link in HTML: ${iconUrl}`);

    const iconRes = await fetch(iconUrl);
    if (!iconRes.ok) {
      throw new Error(`Failed to fetch icon from ${iconUrl}: ${iconRes.statusText}`);
    }

    let arrayBuffer = await iconRes.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // Determine correct extension from resolved URL or Content-Type header
    let ext = path.extname(new URL(iconUrl).pathname);
    if (!ext || ext.length > 5 || ext.includes("?")) {
      const contentType = iconRes.headers.get("content-type") || "";
      if (contentType.includes("svg")) ext = ".svg";
      else if (contentType.includes("png")) ext = ".png";
      else if (contentType.includes("x-icon") || contentType.includes("microsoft")) ext = ".ico";
      else ext = ".png";
    }

    // If it is a large PNG/JPG, resize it using sharp to keep page size tiny
    if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
      try {
        const metadata = await sharp(buffer).metadata();
        if (metadata.width > 32 || metadata.height > 32) {
          console.log(`  Image is ${metadata.width}x${metadata.height}. Resizing to 32x32...`);
          buffer = await sharp(buffer).resize(32, 32, { fit: "contain" }).png().toBuffer();
          ext = ".png"; // standardise resized favicons to PNG
        }
      } catch (err) {
        console.warn(`  Failed to resize image with sharp, using original: ${err.message}`);
      }
    }

    const destPath = path.join(destDir, `${name}-favicon${ext}`);
    fs.writeFileSync(destPath, buffer);
    console.log(`  Successfully saved favicon to ${destPath} (size: ${buffer.length} bytes)`);
    cleanupOldExtensions(name, ext);
  } catch (err) {
    console.error(`  Error scraping favicon for ${name}:`, err.message);
  }
}

async function main() {
  for (const proj of projects) {
    await scrapeFavicon(proj.name, proj.url);
  }
}

main();
