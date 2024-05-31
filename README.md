# oooo-components
Abstract the components and functions used in the project

## Setup

### Import Project
For redcue maintenance pressure, current only support `git submodule` import

```bash
git submodule add git@github.com:l2-bridge/oooo-components.git submodules/oooo-components
```

Add script to ensure git submodule update when install dependencies

```json
// package.json
{
  "scripts": {
    "pnpm:devPreinstall": "git submodule update --init"
  }
}
```

### Import dependencies
```bash
pnpm i @tanstack/vue-query radix-vue @vueuse/core
```

### Config

#### Tailwind
Project default use `shadcn-vue`, so we need update `tailwindcss` config

We need use `postcss-import` to support build time import, more info can follow: https://tailwindcss.com/docs/using-with-preprocessors#build-time-imports

```bash
pnpm i -D postcss-import
```

```js
// tailwind.config.ts
import type { Config } from 'tailwindcss'
+ import OoooPreset from './submodules/oooo-components/src/config/tailwind.preset.js'

export default {
+  presets: [
+    OoooPreset
+  ],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
+    './submodules/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}'
  ]
} satisfies Config
```

```css
- @tailwind base;
- @tailwind components;
- @tailwind utilities;

+ @import "tailwindcss/base";
+ @import "tailwindcss/components";
+ @import "tailwindcss/utilities";
+ @import "oooo-components/config/tailwind.css";
```

#### Alias
Project use `oooo-components` alias to associate with different components

```ts
// vite.config.ts
{
  ...
  resolve: {
    alias: {
      'oooo-components': path.resolve(__dirname, 'submodules/oooo-components/src')
    }
  }
}
```

```ts
// tsconfig.json
{
  "compilerOptions": {
    ...
    "paths": {
      ...
      "oooo-components/*": [
        "submodules/oooo-components/src/*"
      ]
    }
  }
}
```

#### Workspace
Add workspace to prevent generic dependency repackaging issues

```yaml
# pnpm-workspace.yaml
packages:
  - 'submodules/*'
```
