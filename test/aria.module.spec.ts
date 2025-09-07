/// <reference types="vitest" />
import { describe, it, expect } from "vitest";
import { createModal } from "../src/core";
import { AriaModule } from "../src/modules/aria";

describe("AriaModule", () => {
  it("applies labelledBy and describedBy", () => {
    document.body.innerHTML = `
      <h2 id="t">Title</h2>
      <p id="d">Desc</p>
      <div id="dlg"><div class="m11y__surface"></div></div>
    `;
    const el = document.getElementById("dlg")!;
    createModal(el, {
      modules: [AriaModule({ labelledBy: "#t", describedBy: "#d" })],
    });
    expect(el.getAttribute("aria-labelledby")).toBe("t");
    expect(el.getAttribute("aria-describedby")).toBe("d");
  });
});
