import { useState } from "react";

import { Modal } from "@four-leaf-studios/moda11y/react";
import {
  AriaModule,
  FocusTrapModule,
  CloseOnEscModule,
  BackdropClickModule,
  ScrollLockModule,
} from "@four-leaf-studios/moda11y/modules";

export default function App() {
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  return (
    <div className="container">
      <h1>mod11y playground</h1>
      <p>
        Test the core modal with plug-in modules, stacking, focus, ESC, backdrop
        and scroll lock.
      </p>

      <div className="grid">
        <button className="primary" onClick={() => setOpenA(true)}>
          Open Modal A
        </button>
        <button onClick={() => setOpenB(true)}>Open Modal B</button>
      </div>

      {/* Modal A: all the usual modules */}
      <Modal
        open={openA}
        onOpenChange={setOpenA}
        aria-labelledby="modal-a-title"
        aria-describedby="modal-a-desc"
        modules={[
          AriaModule({
            role: "dialog",
            labelledBy: "#modal-a-title",
            describedBy: "#modal-a-desc",
          }),
          FocusTrapModule({ initialFocus: "#email" }),
          CloseOnEscModule(),
          BackdropClickModule(),
          ScrollLockModule({ compensateScrollbar: true }),
        ]}
      >
        <h2 id="modal-a-title">Sign up</h2>
        <p id="modal-a-desc">Enter your email and we’ll send a confirmation.</p>
        <div style={{ display: "grid", gap: 8, marginBlock: 12 }}>
          <label>
            Email
            <input id="email" type="email" style={{ width: "100%" }} />
          </label>
          <label>
            Name
            <input type="text" style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setOpenA(false)}>Cancel</button>
          <button className="primary" onClick={() => setOpenA(false)}>
            Submit
          </button>
        </div>
      </Modal>

      {/* Modal B: fewer modules (no backdrop click) */}
      <Modal
        open={openB}
        onOpenChange={setOpenB}
        aria-labelledby="modal-b-title"
        aria-describedby="modal-b-desc"
        modules={[
          AriaModule({
            role: "dialog",
            labelledBy: "#modal-b-title",
            describedBy: "#modal-b-desc",
          }),
          FocusTrapModule(),
          CloseOnEscModule(),
          ScrollLockModule(),
        ]}
      >
        <h2 id="modal-b-title">Stacking test</h2>
        <p id="modal-b-desc">
          Try opening Modal A while this is open, then tab around and hit ESC.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setOpenB(false)}>Close</button>
          <button className="primary" onClick={() => setOpenA(true)}>
            Open A on top
          </button>
        </div>
      </Modal>
    </div>
  );
}
