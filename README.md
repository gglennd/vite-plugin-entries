# vite-plugin-entries

A Vite plugin for handling Shopify theme entries. This plugin scans the provided entry directory and automatically generates Rollup input entries, ensuring compatibility with Vite's build process.

## Installation

```sh
npm install @glenndev/vite-plugin-entries --save-dev
```

## Usage

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import entries from "@glenndev/vite-plugin-entries";

export default defineConfig({
  plugins: [
    entries({
      assetFiles: {
        app: "src/app.tsx",
        admin: "src/admin.tsx",
      },
      entryDir: "src/entries",
      rootDir: "src",
      emptyOutDir: true,
      cssMinify: "esbuild",
      rollupOptions: {
        output: {
          dir: "theme/assets",
          format: "es",
          entryFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
          chunkFileNames: "[name].js",
        },
      },
    }),
  ],
});
```

## Options

### `assetFiles`

An object mapping asset names to their corresponding file paths.

```ts
{
  'app': 'src/app.tsx',
  'admin': 'src/admin.tsx'
}
```

### `entryDir`

The directory containing entry files (e.g., `.tsx` files).

### `rootDir` *(optional)*

The root directory of the project.

- **Default:** `"src"`

### `emptyOutDir` *(optional)*

Whether to empty the output directory before building.

- **Default:** `false`

### `cssMinify` *(optional)*

Defines the minification strategy for CSS.

- `true` → Uses default minifier.
- `'esbuild'` → Uses Esbuild.
- `'lightningcss'` → Uses LightningCSS.
- `false` → No CSS minification.
- **Default:** `"esbuild"`

### `rollupOptions` *(optional)*

Custom Rollup options to be merged with default settings.

**Default:**

```ts
{
  output: {
    dir: "theme/assets",
    format: "es",
    entryFileNames: "[name].js",
    assetFileNames: "[name].[ext]",
    chunkFileNames: "[name].js",
  },
}
```

## How It Works

1. The plugin scans the `entryDir` for `.tsx` files and automatically includes them as Rollup input entries.
2. It merges user-defined `assetFiles` with discovered entry files.
3. It generates a Vite build configuration with Rollup settings.
4. The output is placed in `theme/assets` with ES module formatting.

## License

MIT

