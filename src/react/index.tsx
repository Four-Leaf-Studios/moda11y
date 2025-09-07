// react/index.tsx
import { useEffect, useRef } from "react";
import { createModal, type ModalModule, type ModalInstance } from "../core";

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modules?: ModalModule[];
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function useMod11y(modules: ModalModule[] = []) {
  const ref = useRef<ModalInstance | null>(null);
  const setRef = (node: HTMLElement | null) => {
    if (!node) return;
    if (!ref.current) ref.current = createModal(node, { modules });
  };
  return [setRef, ref] as const;
}

export function Modal(props: Props) {
  const { open, onOpenChange, modules = [], children, ...rest } = props;
  const [setEl, modalRef] = useMod11y(modules);

  useEffect(() => {
    const m = modalRef.current!;
    const handleOpen = () => onOpenChange?.(true);
    const handleClose = () => onOpenChange?.(false);
    m.on("open", handleOpen);
    m.on("close", handleClose);
    return () => {
      m.off("open", handleOpen);
      m.off("close", handleClose);
    };
  }, [onOpenChange]);

  useEffect(() => {
    const m = modalRef.current!;
    if (open === true) m.open();
    if (open === false) m.close();
  }, [open]);

  return (
    <div ref={setEl} hidden data-mod11y="dialog" {...rest}>
      <div className="m11y__surface">{children}</div>
    </div>
  );
}
