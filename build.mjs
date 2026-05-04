import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";
import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";

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
      if (id.startsWith("react-native")) return true;
      if (id === "react") return true;
      if (id.includes("ApplicationCommandTypes")) return true;
      return false;
    },
    plugins: [esbuild({ 
      minify: false,
      target: "es2020",
      format: "iife",
      platform: "browser",
      treeShaking: true,
      define: {
        "process.env.NODE_ENV": '"production"'
      }
    })],
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    }
  });
  
  const { output } = await bundle.generate({
    format: "iife",
    name: pluginName,
    exports: "named",
    globals(id) {
      if (id.startsWith("@vendetta")) {
        const name = id.replace("@vendetta/", "").replace("/", ".");
        return `vendetta.${name}`;
      }
      if (id === "react") return "React";
      if (id === "react-native") return "ReactNative";
      return `window.${id}`;
    }
  });
  
  await writeFile(join(outPluginDir, "index.js"), output[0].code);
  await bundle.close();

  const toHash = await readFile(join(outPluginDir, "index.js"));
  manifest.hash = createHash("sha256").update(toHash).digest("hex");
  manifest.main = "index.js";
  await writeFile(join(outPluginDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Built ${manifest.name || pluginName}`);
}