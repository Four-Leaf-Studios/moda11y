import type { ModalModule } from "../core";

export interface ScrollLockOptions {
  compensateScrollbar?: boolean; // adds padding-right to body
}
export function ScrollLockModule(opts: ScrollLockOptions = {}): ModalModule {
  let prevOverflow = "";
  let prevPaddingRight = "";
  return {
    name: "scroll-lock",
    onOpen() {
      const body = document.body;
      prevOverflow = body.style.overflow;
      prevPaddingRight = body.style.paddingRight;
      const scrollBar =
        window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      if (opts.compensateScrollbar && scrollBar > 0) {
        body.style.paddingRight = `${scrollBar}px`;
      }
    },
    onClose() {
      const body = document.body;
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    },
    setup() {},
  };
}
