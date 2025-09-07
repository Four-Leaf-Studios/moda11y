# moda11y

Tiny, framework‑agnostic, fully accessible modal dialogs. Focused, modular, and TypeScript‑first.

- Package: `@four-leaf-studios/moda11y`
- Repo: https://github.com/Four-Leaf-Studios/moda11y
- License: MIT

## Install

- npm: `npm i @four-leaf-studios/moda11y`
- pnpm: `pnpm add @four-leaf-studios/moda11y`
- yarn: `yarn add @four-leaf-studios/moda11y`

Optional styles:

```ts
import '@four-leaf-studios/moda11y/styles.css';
```

The CSS provides sensible, accessible defaults and animations. You can also bring your own styles.

## Core Usage (vanilla JS/TS)

```html
<!-- Your dialog container -->
<div id="my-dialog">
  <div class="m11y__surface">
    <h2 id="title">Hello</h2>
    <p id="desc">This modal is fully accessible.</p>
    <button id="close">Close</button>
  </div>
  <!-- Clicking outside .m11y__surface will close when BackdropClickModule is used -->
  <!-- Container gets [data-mod11y="dialog"] and [hidden] managed by the library -->
  <!-- Include styles.css for default backdrop and surface styling (optional) -->
  </div>
```

```ts
import '@four-leaf-studios/moda11y/styles.css'; // optional defaults
import {
  createModal,
  AriaModule,
  FocusTrapModule,
  CloseOnEscModule,
  BackdropClickModule,
  ScrollLockModule,
} from '@four-leaf-studios/moda11y';

const modal = createModal('#my-dialog', {
  modules: [
    AriaModule({ role: 'dialog', labelledBy: 'title', describedBy: 'desc' }),
    FocusTrapModule(),
    CloseOnEscModule(),
    BackdropClickModule(),
    ScrollLockModule(),
  ],
});

document.getElementById('open')?.addEventListener('click', () => modal.open());
document.getElementById('close')?.addEventListener('click', () => modal.close());

// Optional events
modal.on('open', () => console.log('opened'));
modal.on('close', () => console.log('closed'));
```

### Core API

```ts
createModal(elOrSelector: string | HTMLElement, options?: {
  modules?: ModalModule[];
  state?: Record<string, unknown>;
}): ModalInstance
```

`ModalInstance`:

- `el`: host element
- `isOpen`: boolean
- `open() | close() | toggle() | destroy()`
- `on(event, handler) | off(event, handler) | emit(event, detail?)`
- `state`: shared bag for modules (e.g., `returnFocus` flag)

Events: `mount | open | close | destroy`.

## React Usage

React bindings are exported from the `react` subpath.

```tsx
import '@four-leaf-studios/moda11y/styles.css';
import { Modal, useMod11y } from '@four-leaf-studios/moda11y/react';
import { AriaModule, FocusTrapModule, CloseOnEscModule, BackdropClickModule, ScrollLockModule } from '@four-leaf-studios/moda11y';

export function MyModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      modules={[
        AriaModule({ labelledBy: 'title', describedBy: 'desc' }),
        FocusTrapModule(),
        CloseOnEscModule(),
        BackdropClickModule(),
        ScrollLockModule(),
      ]}
      role="dialog"
      aria-modal="true"
    >
      <h2 id="title">Hello</h2>
      <p id="desc">This modal is fully accessible.</p>
      <button onClick={() => onOpenChange(false)}>Close</button>
    </Modal>
  );
}
```

Also available: `useMod11y(modules)` returns a ref‑callback and an instance ref for advanced control.

## Built‑in Modules

Import from the package root: `@four-leaf-studios/moda11y` or from `@four-leaf-studios/moda11y/modules`.

- `AriaModule({ role, labelledBy, describedBy, ariaModal })`: sets `role`, `aria-modal`, and `aria-*` associations.
- `FocusTrapModule({ initialFocus, returnFocus })`: keeps focus within the dialog and optionally restores focus on close.
- `CloseOnEscModule({ stopPropagation })`: closes on Escape; stops propagation by default.
- `BackdropClickModule({ surfaceSelector = '.m11y__surface' })`: closes when clicking outside the surface element.
- `ScrollLockModule({ compensateScrollbar })`: disables page scroll while open, optionally compensates for the scrollbar.

## Styling

- Default styles: `import '@four-leaf-studios/moda11y/styles.css'`.
- Structure: the root receives `data-mod11y="dialog"`; put content in a `.m11y__surface` child for sensible defaults and backdrop‑click behavior.
- Bring your own: override or omit the stylesheet to fully customize appearance.

## Accessibility

moda11y aims for practical, robust a11y by default:

- Applies ARIA semantics (`role`, `aria-modal`, labels/description) via `AriaModule`.
- Traps focus and restores focus to the previously active element.
- Closes on Escape; optional backdrop close.
- Maintains visibility with `[hidden]` and DOM‑only control (no portals required).

## Scripts (development)

- `dev`: builds in watch mode
- `build`: production build
- `preview`: serves the built output
- `play`: run the local playground
- `play:build` / `play:preview`: build/serve playground
- `test`, `test:watch`, `test:ci`: run tests (Vitest)

## Contributing

Issues and PRs welcome! Please open an issue first for significant changes: https://github.com/Four-Leaf-Studios/moda11y/issues

## License

MIT © Four Leaf Studios

