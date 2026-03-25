const form = document.getElementById("myForms");
const result = document.getElementById("result");

let currentStep = 1; //Empezamos en step 1
const step1fields = ["name", "tel", "email"];
const step2fields = ["password", "confirmPassword", "passPhrase"];

function validateField(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);
    if (!input || !error) return true;

    //limpia el texto en error y los parámetros de cada text box
    error.textContent = "";
    input.classList.remove("valid", "invalid");

    // Validación básica para required, pattern, email, name, etc.
    if (input.required && input.validity.valueMissing) {
        error.textContent = "This field is needed";
        input.classList.add("invalid");
        return false;
    }

    /* Pattern */
    if (input.validity.patternMismatch) {
        const messages = {
            name: "Name must only contain letters",
            tel: "Telephone must start with (52) and be 10 digits long",
            password: "Min. 8 characters",
            confirmPassword: "Must match the password above"
        };

        error.textContent = messages[id] || "Invalid format";
        input.classList.add("invalid");
        return false;
    }

    /* email */
    if (input.validity.typeMismatch) {
        error.textContent = "Invalid email";
        input.classList.add("invalid");
        return false;
    }

    if (id === 'confirmPassword') {
        const pass = document.getElementById('password');

        if (input.value !== pass.value) {
            error.textContent = "Passwords do not match!";
            input.classList.add('invalid');
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

        const response = await fetch('/', {
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

                result.innerHTML = `<h3 style="color: #00FF41">Welcome to the Bat-Family! Check the console.</h3>`;

                // Volvemos al estado inicial después de 3 segundos
                setTimeout(() => {
                    form.reset();
                    currentStep = 1;
                    document.getElementById('step-2').classList.add('hidden');
                    document.getElementById('step-1').classList.remove('hidden');
                    result.textContent = "";
                }, 3000);
            }
        } else {
            result.textContent = resultData.message;
        }
    } catch (error) {
        console.error('BatSignal Error:', error);
        result.textContent = 'Connection error. Nice try Riddler...';
    }
});