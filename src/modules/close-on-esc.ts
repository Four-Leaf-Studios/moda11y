import type { ModalModule, ModalInstance } from "../core";

export interface CloseOnEscOptions {
  stopPropagation?: boolean; // default true
}
export function CloseOnEscModule(opts: CloseOnEscOptions = {}): ModalModule {
  return {
    name: "close-esc",
    setup(instance: ModalInstance) {
      const handler = (e: KeyboardEvent) => {
        if (!instance.isOpen) return;
        if (e.key === "Escape") {
          if (opts.stopPropagation !== false) e.stopPropagation();
          e.preventDefault();
          instance.close();
        }
      };
      document.addEventListener("keydown", handler, true);
      return () => document.removeEventListener("keydown", handler, true);
    },
  };
}
