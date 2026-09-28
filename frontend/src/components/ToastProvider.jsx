import { useCallback, useState } from "react";
import { ToastContext } from "./toastcontext";
import "./Toast.css";

const ICONOS = {
  error: "✖",
  success: "✔",
  warning: "⚠",
  info: "ℹ",
};

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "error", duration = 4000) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((current) => [...current, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-show toast-${toast.type}`}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <span className="toast-icon" aria-hidden="true">
              {ICONOS[toast.type] ?? ICONOS.info}
            </span>
            <span className="toast-msg">{toast.message}</span>
            
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
