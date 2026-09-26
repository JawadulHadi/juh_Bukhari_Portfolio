# Theming & Design System

## Layers

1. **Classical design system** (`_ds/classical-…/styles.css`): the base tokens, including colour ramps generated in OKLCH, spacing (`--space-*`), and fonts (Cormorant Garamond for display, Lora for body). This is the **Paper** look. The folder is generated, so retune it at the source rather than editing it here.
2. **`theme.js`**: overrides a small set of CSS variables on `<html>` to switch themes at runtime.
3. **Pages**: use tokens only (`var(--color-text)`, `var(--ink-accent)`, `var(--space-8)`…), so each theme applies everywhere.

## Themes

| Key | Label | Scheme | Character |
| --- | --- | --- | --- |
| `horizon` | Horizon | dark | Night grid, ember accent `#e8784a` (default) |
| `classical` | Paper | light | Paper, ink and gold. Uses the Classical tokens as-is |
| `mono` | Mono | dark | Black, white, editorial |

Variables that themes override: `--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--color-divider`, `--ink-accent`, `--muted`, `--page-grid`.

## Persistence

- Saved in `localStorage` under **`juh-dc-theme`** (wrapped in try/catch, so private mode still works).
- A `storage` event listener syncs the theme across open tabs.
- Each change dispatches `window` event **`juh-theme`** with `detail` set to the theme key, and sets `data-theme` on `<html>`.

## `window.JUHTheme` API

| Member | Description |
| --- | --- |
| `THEMES` | Theme definitions |
| `KEY` | Storage key (`juh-dc-theme`) |
| `get()` | The current theme key |
| `set(key)` | Save and apply a theme |
| `apply(key)` | Apply without saving. Unknown keys fall back to `horizon` |
| `saved()` | The saved key, or `null` |
| `reveal()` | (Re)bind scroll-reveal for `[data-reveal]` elements. A no-op under reduced motion |

```js
window.JUHTheme.set('mono');
window.addEventListener('juh-theme', (e) => console.log('theme →', e.detail));
```

## Adding a theme

1. Add an entry to `THEMES` in `theme.js` with `label`, `desc`, `scheme` and `vars`.
2. Only override the variables listed above. Anything else won't be reset when the theme switches.
3. Check contrast for body text and `--ink-accent` links (WCAG AA: 4.5:1).
4. Check both pages and the agent panel.

## Motion

Scroll reveals use `data-reveal="<delay ms>"`. All transitions and animations are disabled under `prefers-reduced-motion: reduce`.
