import type { ModalModule, ModalInstance } from "../core";

export interface AriaOptions {
  role?: "dialog" | "alertdialog";
  labelledBy?: string | HTMLElement;
  describedBy?: string | HTMLElement;
  ariaModal?: boolean;
}
function resolveEl(ref?: string | HTMLElement): string | undefined {
  if (!ref) return;
  if (typeof ref === "string") return ref.startsWith("#") ? ref.slice(1) : ref;
  if (ref.id) return ref.id;
  return;
}

export function AriaModule(opts: AriaOptions = {}): ModalModule {
  return {
    name: "aria",
    setup(instance: ModalInstance) {
      const el = instance.el;
      el.setAttribute(
        "role",
        opts.role ?? (el.getAttribute("role") || "dialog")
      );
      if (opts.ariaModal ?? true) el.setAttribute("aria-modal", "true");

      const labelId = resolveEl(opts.labelledBy);
      if (labelId) el.setAttribute("aria-labelledby", labelId);

      const descId = resolveEl(opts.describedBy);
      if (descId) el.setAttribute("aria-describedby", descId);
    },
  };
}
