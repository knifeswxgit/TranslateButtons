import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { extname, join } from "path";
import { createHash } from "crypto";
import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@swc/core";

const extensions = [".js", ".jsx", ".mjs", ".ts", ".tsx", ".cts", ".mts"];

const plugins = [
  nodeResolve(),
  commonjs(),
  {
    name: "swc",
    async transform(code, id) {
      const ext = extname(id);
      if (!extensions.includes(ext)) return null;
      const ts = ext.includes("ts");
      const tsx = ts ? ext.endsWith("x") : undefined;
      const jsx = !ts ? ext.endsWith("x") : undefined;
      const result = await swc.transform(code, {
        filename: id,
        jsc: {
          externalHelpers: true,
          parser: { syntax: ts ? "typescript" : "ecmascript", tsx, jsx },
        },
        env: {
          targets: "defaults",
          include: ["transform-classes", "transform-arrow-functions"],
        },
      });
      return result.code;
    },
  },
  esbuild({ minify: true }),
];

const pluginsDir = "./plugins";
const outDir = "./dist";

await mkdir(outDir, { recursive: true });

const pluginFolders = await readdir(pluginsDir, { withFileTypes: true });
for (const dirent of pluginFolders) {
  if (!dirent.isDirectory()) continue;
  const pluginName = dirent.name;
  const pluginPath = join(pluginsDir, pluginName);
  const manifestPath = join(pluginPath, "manifest.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
  } catch {
    console.log(`Skipping ${pluginName}: no manifest.json`);
    continue;
  }
  const entry = manifest.main;
  const outPluginDir = join(outDir, pluginName);
  await mkdir(outPluginDir, { recursive: true });

  const bundle = await rollup({
    input: join(pluginPath, entry),
    external: (id) => {
      if (id.startsWith("@vendetta")) return true;
      if (id.startsWith("ApplicationCommandTypes")) return true;
      if (id.startsWith("react-native")) return true;
      return false;
    },
    onwarn: () => {},
    plugins,
  });
  await bundle.write({
    file: join(outPluginDir, "index.js"),
    globals(id) {
      if (id.startsWith("@vendetta")) return id.substring(1).replace(/\//g, ".");
      const map = { react: "window.React" };
      return map[id] || null;
    },
    format: "iife",
    compact: true,
    exports: "named",
  });
  await bundle.close();

  const toHash = await readFile(join(outPluginDir, "index.js"));
  manifest.hash = createHash("sha256").update(toHash).digest("hex");
  manifest.main = "index.js";
  await writeFile(join(outPluginDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Built ${manifest.name || pluginName}`);
}