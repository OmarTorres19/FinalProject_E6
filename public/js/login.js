const loginForm = document.getElementById("loginForm");
const result = document.getElementById("result");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(loginForm));

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const resData = await response.json();

        if (resData.success){
            result.textContent = "Access granted. Redirecting...";
            setTimeout(() => {
                window.location.href = resData.redirectURL; //Nos lleva al dashboard
            }, 1500);
        } else {
            result.textContent = resData.message;
        }
    } catch (error) {
        result.textContent = "Error connecting  to the Batcave.";
    }
});