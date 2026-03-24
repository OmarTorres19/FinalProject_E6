const form = document.getElementById("myForms");
const result = document.getElementById("result");
const fields = ["name", "tel", "email"];

function validateField(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);

    if (!input || !error) return true;

    //limpia el texto en error y los parámetros de cada text box
    error.textContent = "";
    input.classList.remove("valid", "invalid");

    /* Campo obligatorio*/
    if (input.required && input.validity.valueMissing) {
        error.textContent = "This field is needed";
        input.classList.add("invalid");
        return false;
    }

    /* Pattern */
    if (input.validity.patternMismatch) {
        const messages = {
            name: "Name must only contain letters",
            tel: "Telephone must start with (52) and be 10 digits long"
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

    input.classList.add("valid");
    return true;
}

/* eventos en inputs */
fields.forEach(id => {
    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("blur", () => validateField(id));
    input.addEventListener("input", () => validateField(id));

});


/* submit */
form.addEventListener("submit", async function (e) {
    e.preventDefault() //Detiene recarga

    let valid = true; //validación de campos
    fields.forEach(id => {
        if (!validateField(id)) {
            valid = false;
        }
    });

    if (!valid) {
        result.textContent = 'Check for mistakes';
        return;
    }

    //AJAX Fetch
    //envía al servidor
    try {
        const data = Object.fromEntries(new FormData(form));

        const response = await fetch('/', {
            method: 'POST',  //método HTTP
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        //esperamos respuesta del servidor
        const resultData = await response.json();

        if (resultData.success) { //muestra respuesta del servidor
            //Éxito
            result.innerHTML = `
            <div style="color: #00FF41; font-weight: bold;">
            ${resultData.message}<br>
            Suit: ${resultData.member.batsuit}<br>
            <a href="${resultData.secretBase}" target="_blank">Access to the Batcave</a>
            </div>
            `;
            form.reset();
        } else {
            //Error
            result.textContent = `${resultData.message}`;
        }
    } catch (error) {
        console.error('BatSignal Error:', error);
        result.textContent = 'Connection error. Nice try Riddler...';
    }
});