function showToast(message, type = "info") {
    const icons = {
        success: "✔",
        error:   "✖",
        warning: "⚠",
        info:    "ℹ"
    };

    // 1. Crear el elemento toast
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] ?? icons.info}</span>
        <span class="toast-msg">${message}</span>
    `;

    // 2. Insertarlo en el body
    document.body.appendChild(toast);

    // 3. Pequeño delay para que el navegador registre el elemento antes de animarlo
    setTimeout(() => toast.classList.add("toast-show"), 10);

    // 4. Quitarlo después de 4 segundos
    setTimeout(() => {
        toast.classList.remove("toast-show");
        // Espera a que termine la animación de salida antes de eliminarlo del DOM
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
