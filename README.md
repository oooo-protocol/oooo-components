# oooo-components
Abstract the components and functions used in the project

## Setup

### Import Prject
For redcue maintenance pressure, current only support `git submodule` import

```bash
git submodule add git@github.com:l2-bridge/oooo-components.git submodules/oooo-components
```

### Import dependencies
```bash
pnpm i @tanstack/vue-table @tanstack/vue-query @preflower/utils clsx decimal.js-light radix-vue tailwind-merge vee-validate
```

### Config

#### Tailwind
Project default use `shadcn-vue`, so we need update `tailwindcss` config

We need use `postcss-import` to support build time import, more info can follow: https://tailwindcss.com/docs/using-with-preprocessors#build-time-imports

```bash
pnpm i -D postcss-import
```

```js
// tailwind.config.js
import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export const darkMode = ['class']
export const safelist = ['dark']
export const content = [
  './submodules/**/*.{ts,tsx,vue}',
  './pages/**/*.{ts,tsx,vue}',
  './components/**/*.{ts,tsx,vue}',
  './example/**/*.{ts,tsx,vue}',
  './src/**/*.{ts,tsx,vue}'
]
export const theme = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px'
    }
  },
  extend: {
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      }
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    keyframes: {
      'accordion-down': {
        from: { height: 0 },
        to: { height: 'var(--radix-accordion-content-height)' }
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: 0 }
      },
      'collapsible-down': {
        from: { height: 0 },
        to: { height: 'var(--radix-collapsible-content-height)' }
      },
      'collapsible-up': {
        from: { height: 'var(--radix-collapsible-content-height)' },
        to: { height: 0 }
      }
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
      'collapsible-down': 'collapsible-down 0.2s ease-in-out',
      'collapsible-up': 'collapsible-up 0.2s ease-in-out'
    }
  }
}
export const plugins = [animate]
```

```css
- @tailwind base;
- @tailwind components;
- @tailwind utilities;

+ @import "tailwindcss/base";
+ @import "tailwindcss/components";
+ @import "tailwindcss/utilities";
+ @import "oooo-components/ui/tailwind.css";
```

```ts
// main.ts
import 'oooo-components/ui/tailwind.css'
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
