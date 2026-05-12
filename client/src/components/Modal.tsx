import { forwardRef, type ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ title, children, actions }, ref) => {
    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="py-4">{children}</div>
          {actions && <div className="modal-action">{actions}</div>}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
