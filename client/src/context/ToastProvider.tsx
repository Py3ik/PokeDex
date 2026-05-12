import { useCallback, useRef, useState } from "react";
import { ToastContext, type ToastType } from "./ToastContext";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ALERT_CLASS: Record<ToastType, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

const DURATION = 3000;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="toast toast-top toast-end z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`alert ${ALERT_CLASS[toast.type]} cursor-pointer`}
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            >
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};
