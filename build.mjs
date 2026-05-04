import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";
import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

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
      if (id === "react" || id === "react-native") return true;
      return false;
    },
    plugins: [
      nodeResolve({ extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"] }),
      commonjs(),
      esbuild({
        minify: false,
        target: "es2020",
        jsx: "react",
      }),
    ],
    onwarn(warning, warn) {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      warn(warning);
    },
  });

  await bundle.write({
    file: join(outPluginDir, "index.js"),
    format: "iife",
    name: pluginName,
    globals(id) {
      if (id === "react") return "React";
      if (id === "react-native") return "ReactNative";
      if (id.startsWith("@vendetta/")) {
        const path = id.slice(10);
        const parts = path.split("/");
        return `vendetta.${parts.join(".")}`;
      }
      if (id === "@vendetta") return "vendetta";
      return id;
    },
  });

  await bundle.close();

  const toHash = await readFile(join(outPluginDir, "index.js"));
  manifest.hash = createHash("sha256").update(toHash).digest("hex");
  manifest.main = "index.js";
  await writeFile(join(outPluginDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Built ${manifest.name || pluginName}`);
}