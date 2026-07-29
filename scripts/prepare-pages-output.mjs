/** Adds directory indexes so GitHub Pages and plain static servers resolve clean routes. */
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, relative, sep } from "node:path";

const outputRoot = join(process.cwd(), "dist-pages");

/** Returns every file below a directory without following generated links. */
async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  }));
  return nested.flat();
}

/** Keeps public route HTML while excluding framework and parameter templates. */
function isPublicRouteHtml(file) {
  if (extname(file) !== ".html" || basename(file) === "index.html") return false;
  return relative(outputRoot, file)
    .split(sep)
    .every((segment) => !segment.startsWith("(") && !segment.startsWith("[") && !segment.startsWith("+") && !segment.startsWith("_"));
}

const routeFiles = (await listFiles(outputRoot)).filter(isPublicRouteHtml);
for (const source of routeFiles) {
  const routePath = source.slice(0, -".html".length);
  const destination = join(routePath, "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

await writeFile(join(outputRoot, ".nojekyll"), "");
process.stdout.write(`Prepared ${routeFiles.length} clean static routes for GitHub Pages\n`);
