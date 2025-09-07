import type { ModalModule, ModalInstance } from "../core";

export interface FocusTrapOptions {
  initialFocus?: string | HTMLElement | (() => HTMLElement | null);
  returnFocus?: boolean; // default true
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  const sel = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(",");
  return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

function resolveInitial(
  root: HTMLElement,
  opt?: FocusTrapOptions["initialFocus"]
): HTMLElement | null {
  if (!opt) return getFocusable(root)[0] ?? root;
  if (typeof opt === "string")
    return (root.querySelector(opt) as HTMLElement) || null;
  if (typeof opt === "function") return opt();
  return opt;
}

export function FocusTrapModule(opts: FocusTrapOptions = {}): ModalModule {
  return {
    name: "focus-trap",
    setup(instance: ModalInstance) {
      // make container focusable if empty
      if (!instance.el.hasAttribute("tabindex"))
        instance.el.setAttribute("tabindex", "-1");

      const onKeyDown = (e: KeyboardEvent) => {
        if (!instance.isOpen || e.key !== "Tab") return;
        const focusables = getFocusable(instance.el);
        if (focusables.length === 0) {
          e.preventDefault();
          instance.el.focus();
          return;
        }
        const first = focusables[0],
          last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      const onFocus = (e: FocusEvent) => {
        if (!instance.isOpen) return;
        if (instance.el.contains(e.target as Node)) return;
        // redirect stray focus back
        const focusables = getFocusable(instance.el);
        (focusables[0] ?? instance.el).focus();
      };

      const keyListener = (ev: Event) => onKeyDown(ev as KeyboardEvent);
      const focusListener = (ev: Event) => onFocus(ev as FocusEvent);

      document.addEventListener("keydown", keyListener, true);
      document.addEventListener("focus", focusListener, true);

      // share returnFocus flag with core
      if (opts.returnFocus === false) instance.state["returnFocus"] = false;

      return () => {
        document.removeEventListener("keydown", keyListener, true);
        document.removeEventListener("focus", focusListener, true);
      };
    },
    onOpen(instance) {
      const initial = resolveInitial(instance.el, opts.initialFocus);
      (initial ?? instance.el).focus({ preventScroll: true });
    },
  };
}
