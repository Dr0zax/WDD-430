# Color Picker — four frameworks

Each folder is an independent implementation of the same color-picker experience:

- `vanilla` — HTML, CSS, and JavaScript; open `index.html` directly.
- `react` — React loaded from the browser via esm.sh; open `index.html` directly.
- `vue` — Vue loaded from the browser via esm.sh; open `index.html` directly.
- `svelte` — Svelte + Vite source project.

To run the Svelte version:

```bash
cd svelte
npm install
npm run dev
```

The picker includes hue and opacity controls, HEX/RGB/alpha readouts, copy-to-clipboard, and quick swatches.
