// DOM
const recoveryForm = document.getElementById('recoveryForm');
const btnLoadQuestion = document.getElementById('btnLoadQuestion');
const step1 = document.getElementById('recovery-step-1');
const step2 = document.getElementById('recovery-step-2');
const displayQuestion = document.getElementById('display-question');
const result = document.getElementById('result');

//Variable para el email a buscar
let userEmail = "";

// STEP 1 - Busqueda
btnLoadQuestion.addEventListener('click', async () => {
    userEmail = document.getElementById('email').value.trim();

    if (!userEmail) {
        result.textContent = "Enter a valid email first.";
        return;
    }

    try {
        const response = await fetch('/api/recovery/step1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();

        if (data.success) {
            //Success -> Mostramos pregunta y cambiamos el panel
            displayQuestion.textContent = data.question;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            result.textContent = "Identity confirmed. Recovery from passphrase.";
            result.style.color = "#FDB813";
        } else {
            result.textContent = data.message;
            result.style.color = "#FF0040";
        }
    } catch (error) {
        console.error("Error detected: ", error);
        result.textContent = "Bat-Signal lost. Server connection failed.";
    }
});


// STEP 2 - Actualizar datos
recoveryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passphrase = document.getElementById('passphrase').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch('/api/recovery/step2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                passphrase,
                newPassword
            })
        });

        const data = await response.json();

        if(data.success) {
            result.textContent = data.message;
            result.style.color = "#00FF41";

            //Redireccionamos después de validación
            setTimeout(() => {
                window.location.href = '/login';
            }, 2500);
        } else {
            result.textContent = data.message;
            result.style.color = "#FF0040";
        }
    } catch (error) {
        result.textContent = "Critical error during protocol update.";
    }
});