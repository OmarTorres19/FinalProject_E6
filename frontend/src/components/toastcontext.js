import { createContext, useContext } from "react";
export const ToastContext = createContext(null);

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return showToast;
}