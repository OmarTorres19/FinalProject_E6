/**
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario.
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente. 
 */
import path from "path";
import { json } from "stream/consumers";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MASTER_USER = {
    email: "batman@gotham.com",
    password: "iamthenight" // texto plano para pruebas
}

export const processLogin = (req, res) => {
    const { email, password } = req.body;

    console.log(`Intentando acceso para ${email}`);

    //lóigca de comparación de identidad
    if (email === MASTER_USER.email && password === MASTER_USER.password) {
        return res.json({
            success: true,
            message: "Access granted, Bruce. Welcome back.",
            redirectURL: "/dashboard" //En caso de éxito, nos dirigimos a dashboard
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "Identity unverified."
        });
    }
}


export const showLanding = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/home.html")); //Muestra home.html
}

export const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html")); //Muestra login.html
}

export const showForm = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formVIJS.html"));
};

export const showValidate = (req, res) => {
    const { name, tel, email, password, passphrase, step } = req.body;

    //validación con el servidor
    if (!name || !tel || !email) {
        return res.status(400).json({
            success: false,
            message: 'All fields must be filled.'
        });
    }

    if (step == 2) {
        return res.json({
            success: true,
            message: "Registration complete",
            allData: { name, tel, email, password, passphrase }
        });
    }

    res.json({
        success: true,
        message: "Step 1 Ok"
    });

    console.log('New BatMember scouted: ', name);
};