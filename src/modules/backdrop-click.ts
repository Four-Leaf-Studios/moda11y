import type { ModalModule, ModalInstance } from "../core";

export interface BackdropClickOptions {
  surfaceSelector?: string; // default '.m11y__surface'
}
export function BackdropClickModule(
  opts: BackdropClickOptions = {}
): ModalModule {
  return {
    name: "backdrop-click",
    setup(instance: ModalInstance) {
      const surfaceSel = opts.surfaceSelector ?? ".m11y__surface";
      const onPointer = (e: PointerEvent) => {
        if (!instance.isOpen) return;
        const surface = instance.el.querySelector(surfaceSel);
        if (!surface) return;
        // click outside the surface closes
        if (!surface.contains(e.target as Node)) instance.close();
      };
      instance.el.addEventListener("pointerdown", onPointer);
      return () => instance.el.removeEventListener("pointerdown", onPointer);
    },
  };
}
