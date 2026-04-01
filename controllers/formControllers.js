/**
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario.
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente. 
 */
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises" //Importamos el módulo de archivo

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_FILE = path.join(__dirname, "../data/users.json");
const MASTER_USER = {
    email: "batman@gotham.com",
    password: "iamthenight" // texto plano para pruebas
}

export const processLogin = async (req, res) => {
    const { email, password } = req.body;

    console.log(`Intentando acceso para ${email}`);

    try {
        const fileData = await fs.readFile(USER_FILE, "utf-8");
        const users = JSON.parse(fileData);

        //Buscamos si ya existe un usuario con ese email y PW
        const userFound = users.find(u => u.email === email);

        if (userFound || email === "batman@gotham.com") {
            return res.json({
                success: true,
                message: `Welcome back ${userFound ? userFound.name : "Bruce"}.`,
                redirectURL: "/dashboard"
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Identity unverified."
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro accessing Bat-files."
        });
    };


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

const ARKHAM_DATABASE = [
    {
        id: 1,
        name: "Jack Napier",
        alias: "The Joker",
        crime: "Mass Chaos Homicide",
        description: "High unpredictability. Agent of chaos. Do not engage without backup",
        dangerLevel: "Extreme",
        image: "https://i.pinimg.com/1200x/3b/4f/db/3b4fdb1fd4cdb715d2f3d24517cc0e33.jpg"

    },
    {
        id: 2,
        name: "Harvey Dent",
        alias: "Two-Face",
        crime: "Exortion and Organized Crime",
        description: "Obsessed with duality. Desicions governed by a scarred silver dollar.",
        dangerLevel: "High",
        image: "https://i.pinimg.com/736x/df/2a/b0/df2ab0f7da6704b42914ccc9943446ee.jpg"
    },
    {
        id: 3,
        name: "Selina Kyle",
        alias: "Catwoman",
        crime: "Grand Theft",
        description: "Expert burglar. Approach with caution.",
        dangerLevel: "Moderate",
        image: "https://i.pinimg.com/736x/b3/e4/cd/b3e4cd1538e4662ad10dbe957d5e8268.jpg"
    }
];


// Controlador para enviar datos al dash
export const getCriminals = (req, res) => {
    res.json(ARKHAM_DATABASE);
};

export const showDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/dashboard.html"));
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

export const showValidate = async (req, res) => {
    const { name, tel, email, password, passphrase, step } = req.body;

    if (step == 2) {

        try {
            // 1. Leemos usuarios actuales
            const fileData = await fs.readFile(USER_FILE, "utf-8");
            const users = JSON.parse(fileData);

            // 2. Añadimos user
            users.push({ name, tel, email, password });

            // 3. Guardamos en archivo
            await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));

            console.log('New BatMember scouted: ', name);
            return res.json({
                success: true,
                message: "Registration complete. Member added to the database."
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error saving new memeber."
            });
        }
    }

    //validación con el servidor
    if (!name || !tel || !email) {
        return res.status(400).json({
            success: false,
            message: 'All fields must be filled.'
        });
    }

    return res.json({
        success: true,
        message: "Step 1 Ok"
    });
};