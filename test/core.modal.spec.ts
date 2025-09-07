/// <reference types="vitest" />
import { describe, it, expect } from "vitest";
import { createModal } from "../src/core";
import { AriaModule } from "../src/modules/aria";

describe("createModal", () => {
  it("mounts hidden and toggles open/close", () => {
    document.body.innerHTML = `<div id="dlg"><div class="m11y__surface"></div></div>`;
    const el = document.getElementById("dlg")!;

    const modal = createModal(el, { modules: [AriaModule()] });
    // hidden by default
    expect((el as any).hidden).toBe(true);
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("true");

    modal.open();
    expect((el as any).hidden).toBe(false);

    modal.close();
    expect((el as any).hidden).toBe(true);
  });
});
