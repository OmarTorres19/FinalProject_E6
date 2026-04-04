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

const form = document.getElementById("myForms");



let currentStep = 1; //Empezamos en step 1
const step1fields = ["name", "tel", "email"];const step2fields = ["password", "confirmPassword", "question", "passphrase"];



/*Scar: Estoy colocando reglas para validación por  pregunta de seguridad */
const securityRules = {
  favColor: {
    pattern: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,30}$/,
    message: "Color favorito: solo letras (3 a 30)."
  },
  petName: {
    pattern: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{2,30}$/,
    message: "Mascota: solo letras (2 a 30)."
  },
  birthYear: {
    pattern: /^(19\d{2}|20\d{2})$/,
    message: "Año: 4 dígitos (ej. 2002)."
  }
};

/*pruebas paara validacopm de la pregunta de seguridad */
function validateField(id) {
  const input = document.getElementById(id);
  const error = document.getElementById("error-" + id);
  if (!input || !error) return true;

  error.textContent = "";
  input.classList.remove("valid", "invalid");

  // REQUIRED
  if (input.required) {
    const isEmpty = /*Se considera cuando el cmpo vacio en dos casos */
      (input.tagName === "SELECT" && input.value === "") ||
      (input.value.trim() === ""); //trim() elimina espacios al inicio y al final. Si solo hay espacios, se considera vacío.

    if (isEmpty) {
      error.textContent = "This field is needed";
      input.classList.add("invalid");
      return false;
    }
  }

  // PATTERN mismatch (inputs con pattern HTML)
  if (input.validity && input.validity.patternMismatch) {
    const messages = {
      name: "Name must only contain letters",
      tel: "Telephone must start with (52) and be 10 digits long",
      password: "Min. 8 characters"
    };
    error.textContent = messages[id] || "Invalid format";
    input.classList.add("invalid");
    return false;
  }

  // EMAIL (si cambiaste type="email" algún día, esto sirve)
  if (input.validity && input.validity.typeMismatch) {
    error.textContent = "Invalid email";
    input.classList.add("invalid");
    return false;
  }

  // Confirm password
  if (id === "confirmPassword") {
    const pass = document.getElementById("password");
    if (input.value !== pass.value) {
      error.textContent = "Passwords do not match!";
      input.classList.add("invalid");
      return false;
    }
  }

  // Passphrase depende de la pregunta elegida
  if (id === "passphrase") {
    const q = document.getElementById("question");

    if (!q.value) {
      error.textContent = "Select a security question first.";
      input.classList.add("invalid");
      return false;
    }
  

    const rule = securityRules[q.value];
    if (!rule.pattern.test(input.value.trim())) {
      error.textContent = rule.message;
      input.classList.add("invalid");
      return false;
    }
  }

  input.classList.add("valid");
    return true;
}


/* eventos en inputs */
[...step1fields, ...step2fields].forEach(id => {
  const input = document.getElementById(id);

  if (!input) return;

  input.addEventListener("blur", () => validateField(id));
  input.addEventListener("input", () => validateField(id));
});

/* Revalidar cuando cambie la pregunta */
const questionSelect = document.getElementById("question");
if (questionSelect) {
  questionSelect.addEventListener("change", () => {
    validateField("passphrase"); //Revalidamos la respuesta si se cambia la pregunta
  });
}


/* BACK: volver al paso 1 */
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    currentStep = 1;

    document.getElementById("step-2").classList.add("hidden");
    document.getElementById("step-1").classList.remove("hidden");

    updateStepIndicator(1);

    // Limpia validaciones del step 2
    step2fields.forEach(id => {
      const el = document.getElementById(id);
      const err = document.getElementById("error-" + id);
      if (el) el.classList.remove("valid", "invalid");
      if (err) err.textContent = "";
    });
  });
}





/* Referencia al botón activo según el step */
function getActiveBtn() {
  return currentStep === 1
    ? form.querySelector('#step-1 button[type="submit"]')
    : form.querySelector('#step-2 button[type="submit"]');
}

/* Actualiza el indicador visual de pasos */
function updateStepIndicator(step) {
  const dot1 = document.getElementById('step-dot-1');
  const dot2 = document.getElementById('step-dot-2');

  if (step === 2) {
    dot1.classList.remove('active');
    dot1.classList.add('completed');
    dot2.classList.add('active');
  } else {
    dot2.classList.remove('active');
    dot1.classList.remove('completed');
    dot1.classList.add('active');
  }
}

/* submit */
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Detiene recarga

  const fieldsToValidate = (currentStep === 1) ? step1fields : step2fields;
  let isStepValid = true;

  fieldsToValidate.forEach(id => {
    if (!validateField(id)) isStepValid = false;
  });

  if (!isStepValid) {
    showToast("Please check for errors above.", "warning");
    return;
  }

  // Loader: desactiva botón mientras espera
  const btn = getActiveBtn();
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    const data = Object.fromEntries(new FormData(form));
    data.step = currentStep;

    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const resultData = await response.json();

    if (resultData.success) {
      if (currentStep === 1) {
        currentStep = 2;

        document.getElementById('step-1').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');

        updateStepIndicator(2);
        showToast("Step 1 verified. Secure your account.", "info");

        // Restaura botón del step 2
        btn.disabled = false;
        btn.textContent = originalText;
      } else {
        // ¡ÉXITO FINAL!
        showToast("Welcome to the Bat-Family! Redirecting to login...", "success");
        form.reset();
        setTimeout(() => { window.location.href = '/login'; }, 5000);
      }
    } else {
      showToast(resultData.message, "error");
      btn.disabled = false;
      btn.textContent = originalText;
    }
  } catch (error) {
    console.error('BatSignal Error:', error);
    showToast("Connection error. Nice try Riddler...", "error");
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

