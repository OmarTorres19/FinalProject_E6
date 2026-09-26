// Toggle visibilidad de campos de contraseña
function togglePwd(id) {
    const input = document.getElementById(id);
    const btn   = input.parentElement.querySelector('.toggle-password');
    if (input.type === 'password') {
        input.type  = 'text';
        btn.textContent = '🙈';
    } else {
        input.type  = 'password';
        btn.textContent = '👁';
    }
}

const loginForm = document.getElementById("loginForm");
const submitBtn = loginForm.querySelector('button[type="submit"]');

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Loader: desactiva botón mientras espera respuesta
    submitBtn.disabled = true;
    submitBtn.textContent = "Verifying...";

    const data = Object.fromEntries(new FormData(loginForm));

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const resData = await response.json();

        if (resData.success) {
            showToast("Access granted. Redirecting to Batcave...", "success");
            setTimeout(() => {
                window.location.href = resData.redirectURL; // Nos lleva al dashboard
            }, 1500);
        } else {
            showToast(resData.message, "error");
            // Restaura el botón solo en caso de error
            submitBtn.disabled = false;
            submitBtn.textContent = "Unlock";
        }
    } catch (error) {
        showToast("Error connecting to the Batcave.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Unlock";
    }
});