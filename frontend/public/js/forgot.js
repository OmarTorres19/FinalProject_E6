// Toggle visibilidad de campos de contraseña
function togglePwd(id) {
    const input = document.getElementById(id);
    const btn   = input.parentElement.querySelector('.toggle-password');
    if (input.type === 'password') {
        input.type      = 'text';
        btn.textContent = '🙈';
    } else {
        input.type      = 'password';
        btn.textContent = '👁';
    }
}

// DOM
const recoveryForm = document.getElementById('recoveryForm');
const btnLoadQuestion = document.getElementById('btnLoadQuestion');
const step1 = document.getElementById('recovery-step-1');
const step2 = document.getElementById('recovery-step-2');
const displayQuestion = document.getElementById('display-question');

// Variable para el email a buscar
let userEmail = "";

// STEP 1 - Búsqueda de identidad
btnLoadQuestion.addEventListener('click', async () => {
    userEmail = document.getElementById('email').value.trim();

    if (!userEmail) {
        showToast("Enter a valid email first.", "warning");
        return;
    }

    // Loader
    btnLoadQuestion.disabled = true;
    btnLoadQuestion.textContent = "Searching...";

    try {
        const response = await fetch('/api/recovery/step1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();

        if (data.success) {
            displayQuestion.textContent = data.question;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            showToast("Identity confirmed. Answer your security challenge.", "info");
        } else {
            showToast(data.message, "error");
            btnLoadQuestion.disabled = false;
            btnLoadQuestion.textContent = "Find Identity";
        }
    } catch (error) {
        console.error("Error detected: ", error);
        showToast("Bat-Signal lost. Server connection failed.", "error");
        btnLoadQuestion.disabled = false;
        btnLoadQuestion.textContent = "Find Identity";
    }
});


// STEP 2 - Actualizar contraseña
recoveryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passphrase = document.getElementById('passphrase').value;
    const newPassword = document.getElementById('newPassword').value;
    const submitBtn   = recoveryForm.querySelector('button[type="submit"]');

    // Loader
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    try {
        const response = await fetch('/api/recovery/step2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, passphrase, newPassword })
        });

        const data = await response.json();

        if (data.success) {
            showToast("Security Protocols updated. Redirecting to login...", "success");
            setTimeout(() => { window.location.href = '/login'; }, 2500);
        } else {
            showToast(data.message, "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Update Protocols";
        }
    } catch (error) {
        showToast("Critical error during protocol update.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Update Protocols";
    }
});