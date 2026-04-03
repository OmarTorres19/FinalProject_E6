const form = document.getElementById("myForms");
const result = document.getElementById("result");



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

    result.textContent = "";

    // limpia validaciones del step 2
    step2fields.forEach(id => {
      const el = document.getElementById(id);
      const err = document.getElementById("error-" + id);
      if (el) el.classList.remove("valid", "invalid");
      if (err) err.textContent = "";
    });
  });
}





/* submit */
form.addEventListener("submit", async function (e) {
  e.preventDefault() //Detiene recarga

  const fieldsToValidate = (currentStep === 1) ? step1fields : step2fields;
  let isStepValid = true; //validación de campos

  fieldsToValidate.forEach(id => {
    if (!validateField(id)) {
      isStepValid = false;
    }
  });

  if (!isStepValid) {
    result.textContent = 'Please check for errors above.';
    return;
  }


  //AJAX Fetch
  //envía al servidor
  try {
    const data = Object.fromEntries(new FormData(form));
    data.step = currentStep; //Decimos en qué paso vamos

    const response = await fetch('/api/validate', {
      method: 'POST',  //método HTTP
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    //esperamos respuesta del servidor
    const resultData = await response.json();

    if (resultData.success) { //muestra respuesta del servidor
      //Éxito

      if (currentStep === 1) {
        currentStep = 2; //Avanzamos al paso 2

        document.getElementById('step-1').classList.add('hidden'); //Ocultamos el paso 1
        document.getElementById('step-2').classList.remove('hidden'); //Mostramos paso 2

        result.textContent = "Step 1 verified. Secure your account."; //Limpiamos errores previos
      } else {
        // ¡ÉXITO FINAL!
        console.log("--- BAT-DATA RECOLECTADA ---");
        console.log(resultData.allData); // Aquí se ve el JSON

        result.innerHTML = `
            <h3 style="color: #00FF41">Welcome to the Bat-Family! 🦇</h3>
              <p style="margin-bottom: 15px;">Your identity has been encrypted and stored.</p>
              <div class="btnContainer">
                <a href="/login" class="submit link-btn">GO TO LOGIN</a>
              </div>
              <p style="font-size: 0.8em; margin-top: 10px; color: rgba(253,184,19,0.6);">
                Automatic redirection in 5 seconds...
              </p>`;

        // Volvemos al estado inicial después de 3 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 5000);
      
        form.reset();
      }
    } else {
      result.textContent = resultData.message;
    }
  } catch (error) {
    console.error('BatSignal Error:', error);
    result.textContent = 'Connection error. Nice try Riddler...';
  }
});

// Inline popups
$('#inline-popups').magnificPopup({
  delegate: 'a',
  removalDelay: 500, //delay removal by X to allow out-animation
  callbacks: {
    beforeOpen: function() {
       this.st.mainClass = this.st.el.attr('data-effect');
    }
  },
  midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
});

