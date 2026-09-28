import { useEffect, useRef } from "react";
import "./ConfirmDialog.css";

function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loadingText = "Procesando...",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);


  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);


  useEffect(() => {
    if (!open) return;
    const handleKey = (event) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={() => !loading && onCancel()}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirm-title">{title}</h3>
        <p id="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            ref={cancelRef}
            type="button"
            className="reset"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
