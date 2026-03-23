const form = document.getElementById("myForms");
const result = document.getElementById("result");
const fields = ["name", "tel", "email"];

function validateField(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-"+id);

    if(!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valid", "invalid");

    /* Campo obligatorio*/
    if(input.required && input.validity.valueMissing) {
        error.textContent = "This field is needed";
        input.classList.add("invalid");
        return false;
    }

    /* Pattern */
    if(input.validity.patternMismatch) {
        const messages = {
            name: "Name must only contain letters",
            tel: "Telephone must start with (52) and be 10 digits long"
        };

        error.textContent = messages[id] || "Invalid format";
        input.classList.add("invalid");
        return false;
    }

    /* email */
    if(input.validity.typeMismatch){
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

    if(!input) return;

    input.addEventListener("blur", () => validateField(id));
    input.addEventListener("input", () => validateField(id));

});


/* submit */
form.addEventListener("submit", function(e) {
    let valid = true;
        e.preventDefault();
    fields.forEach(id => {
        if(!validateField(id)){
            valid = false;
        }
    });

    if(!valid) {
        return;
    }


    // crear objeto JS a partir de un FormData
    /*
      {
        atr1:valor,
        atr2:valor,
        ... 
        atrn:valor
      }
    */
   const data = Object.fromEntries(new FormData(form));

   result.textContent = JSON.stringify(data, null, 2);
   console.log(data);

   /*
    localStorage.setItem("formDatos", JSON.stringify(datos));

    const datosGuardados = JSON.parse(localStorage.getItem("formDatos"));
    console.log(datosGuardados);
    */
})