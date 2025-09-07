export type ModalEvent = "mount" | "open" | "close" | "destroy";
export type Handler = (detail?: any) => void;

export interface ModalModule {
  name: string;
  // called once at mount; return cleanup for module-level listeners
  setup(instance: ModalInstance): void | (() => void);
  onOpen?(instance: ModalInstance): void;
  onClose?(instance: ModalInstance): void;
  onDestroy?(instance: ModalInstance): void;
}

export interface ModalOptions {
  modules?: ModalModule[];
  // optional state bag for modules
  state?: Record<string, unknown>;
}

export interface ModalInstance {
  el: HTMLElement;
  isOpen: boolean;
  state: Record<string, unknown>;
  open(): void;
  close(): void;
  toggle(): void;
  destroy(): void;
  on(event: ModalEvent, handler: Handler): void;
  off(event: ModalEvent, handler: Handler): void;
  emit(event: ModalEvent, detail?: any): void;
  // internal
  _cleanup: (() => void)[];
  _modules: ModalModule[];
  _previousActive?: HTMLElement | null;
}

function assertElement(elOrSelector: string | HTMLElement): HTMLElement {
  if (typeof elOrSelector === "string") {
    const el = document.querySelector<HTMLElement>(elOrSelector);
    if (!el) throw new Error(`[mod11y] Element not found: ${elOrSelector}`);
    return el;
  }
  return elOrSelector;
}

export function createModal(
  elOrSelector: string | HTMLElement,
  opts: ModalOptions = {}
): ModalInstance {
  const el = assertElement(elOrSelector);
  el.dataset.mod11y = el.dataset.mod11y || "dialog"; // tag for sanity/debug
  // hidden by default for a11y & layout
  if (!("hidden" in el) || (el as any).hidden === undefined) {
    el.setAttribute("hidden", "");
  } else {
    (el as any).hidden = true;
  }

  const listeners = new Map<ModalEvent, Set<Handler>>();
  const on = (evt: ModalEvent, h: Handler) => {
    if (!listeners.has(evt)) listeners.set(evt, new Set());
    listeners.get(evt)!.add(h);
  };
  const off = (evt: ModalEvent, h: Handler) => listeners.get(evt)?.delete(h);
  const emit = (evt: ModalEvent, detail?: any) =>
    listeners.get(evt)?.forEach((h) => h(detail));

  const instance: ModalInstance = {
    el,
    isOpen: false,
    state: { ...(opts.state || {}) },
    _cleanup: [],
    _modules: opts.modules ?? [],
    open() {
      if (instance.isOpen) return;
      instance._previousActive =
        (document.activeElement as HTMLElement) || null;

      // unhide
      (instance.el as any).hidden = false;
      instance.el.removeAttribute("hidden");
      instance.isOpen = true;

      // notify modules
      instance._modules.forEach((m) => m.onOpen?.(instance));
      emit("open");
    },
    close() {
      if (!instance.isOpen) return;
      instance.isOpen = false;

      // hide
      (instance.el as any).hidden = true;

      // notify modules
      instance._modules.forEach((m) => m.onClose?.(instance));
      emit("close");

      // restore focus if module put it in state
      const returnFocus = instance.state["returnFocus"] as boolean | undefined;
      if (returnFocus !== false && instance._previousActive?.focus) {
        instance._previousActive.focus();
      }
      instance._previousActive = null;
    },
    toggle() {
      instance.isOpen ? instance.close() : instance.open();
    },
    destroy() {
      instance._modules.forEach((m) => m.onDestroy?.(instance));
      for (const c of instance._cleanup)
        try {
          c();
        } catch {}
      listeners.clear();
      emit("destroy");
    },
    on,
    off,
    emit,
  };

  // mount modules
  for (const mod of instance._modules) {
    const maybeCleanup = mod.setup(instance);
    if (typeof maybeCleanup === "function")
      instance._cleanup.push(maybeCleanup);
  }
  emit("mount");
  return instance;
}
