import { createContext } from "react";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
