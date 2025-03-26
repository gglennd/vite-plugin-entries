import type { Plugin, UserConfig } from "vite";
import { join, parse, resolve } from "path";
import { readdirSync } from "fs";
import type { RollupOptions } from "rollup";

/**
 * Configuration options for the Vite plugin.
 */
type Props = {
  /**
   * Object mapping asset names to their corresponding file paths.
   * Example:
   * ```ts
   * {
   *   'app': 'src/app.tsx',
   *   'admin': 'src/admin.tsx'
   * }
   * ```
   */
  assetFiles: Record<string, string>;

  /**
   * The directory containing entry files (e.g., `.tsx` files).
   */
  entryDir: string;

  /**
   * The root directory of the project.
   * @default "src"
   */
  rootDir?: string;

  /**
   * Whether to empty the output directory before building.
   * @default false
   */
  emptyOutDir?: boolean;

  /**
   * Minification strategy for CSS.
   * - `true` → Uses default minifier.
   * - `'esbuild'` → Uses Esbuild.
   * - `'lightningcss'` → Uses LightningCSS.
   * - `false` → No CSS minification.
   * @default "esbuild"
   */
  cssMinify?: boolean | "esbuild" | "lightningcss";

  /**
   * Custom Rollup options to be merged with default settings.
   * @default
   * ```ts
   * {
   *   output: {
   *     dir: "theme/assets",
   *     format: "es",
   *     entryFileNames: "[name].js",
   *     assetFileNames: "[name].[ext]",
   *     chunkFileNames: "[name].js"
   *   }
   * }
   * ```
   */
  rollupOptions?: RollupOptions;
};

/**
 * Vite plugin for handling Shopify theme entries.
 *
 * This plugin scans the provided entry directory and automatically generates
 * Rollup input entries, ensuring compatibility with Vite's build process.
 *
 * @param {Props} options - Configuration options for the plugin.
 * @returns {Plugin} A Vite plugin instance.
 */
export default function entries({
  assetFiles,
  rootDir = "src",
  cssMinify = "esbuild",
  emptyOutDir = false,
  entryDir,
  rollupOptions = {},
}: Props): Plugin {
  return {
    name: "@gglennd/vite-plugin-entries",
    /**
     * Vite plugin configuration hook.
     * @returns {UserConfig} Partial Vite config.
     */
    config(): UserConfig {
      const rootPath = resolve(rootDir); // Normalize root directory
      const dir = join(rootPath, entryDir); // Combine paths safely
      const inputEntries: Record<string, string> = { ...assetFiles };

      // Read all `.tsx` files from the entry directory and add them as input entries
      readdirSync(dir).forEach((file) => {
        if (file.endsWith(".tsx")) {
          const name = parse(file).name;
          inputEntries[name] = join(dir, file);
        }
      });

      return {
        publicDir: false,
        build: {
          cssMinify,
          emptyOutDir,
          rollupOptions: {
            input: inputEntries,
            ...rollupOptions,
            output: {
              dir: "theme/assets",
              format: "es",
              entryFileNames: "[name].js",
              assetFileNames: "[name].[ext]",
              chunkFileNames: "[name].js",
              ...rollupOptions.output,
            },
          },
        },
      };
    },
  };
}
