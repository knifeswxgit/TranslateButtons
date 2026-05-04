import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { extname, join } from "path";
import { createHash } from "crypto";
import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@swc/core";

const pluginsDir = "./plugins";
const outDir = "./dist";

const extensions = [".js", ".jsx", ".mjs", ".ts", ".tsx", ".cts", ".mts"];

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

  const swcPlugin = {
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
          externalHelpers: false,
          parser: { syntax: ts ? "typescript" : "ecmascript", tsx, jsx },
        },
        env: {
          targets: "ie 11",
          include: [
            "transform-block-scoping",
            "transform-classes",
            "transform-arrow-functions",
            "transform-async-to-generator",
            "transform-optional-chaining",
            "transform-nullish-coalescing",
          ],
        },
      });
      return result.code;
    },
  };

  const bundle = await rollup({
    input: join(pluginPath, entry),
    plugins: [
      nodeResolve({ extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"] }),
      commonjs(),
      swcPlugin,
      esbuild({
        minify: false,
        target: "es5",
        jsx: "transform",
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
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
      if (id.startsWith("@vendetta")) return id.substring(1).replace(/\//g, ".");
      if (id === "react") return "React";
      if (id === "react-native") return "ReactNative";
      return id;
    },
    compact: false,
    exports: "named",
  });

  await bundle.close();

  const toHash = await readFile(join(outPluginDir, "index.js"));
  manifest.hash = createHash("sha256").update(toHash).digest("hex");
  manifest.main = "index.js";
  await writeFile(join(outPluginDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Built ${manifest.name || pluginName}`);
}
