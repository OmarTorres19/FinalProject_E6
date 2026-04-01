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
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_FILE = path.join(__dirname, "../data/users.json");
const MASTER_USER = {
    email: "batman@gotham.com",
    password: "iamthenight" // texto plano para pruebas
}

export const showLanding = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/home.html")); //Muestra home.html
}

export const processLogin = async (req, res) => {
    const { email, password } = req.body;

    console.log(`Intentando acceso para ${email}`);

    try {
        const fileData = await fs.readFile(USER_FILE, "utf-8");
        const users = JSON.parse(fileData);

        //Buscamos el usuario solo por el email
        const userFound = users.find(u => u.email === email);
        const isMaster = (email === MASTER_USER.email && password === MASTER_USER.password);

        if (isMaster) {
            return res.json({
                success: true,
                message: `Welcome back, Bruce.`,
                redirectURL: "/dashboard"
            });
        }

        if (userFound) {
            const isMatch = await bcrypt.compare(password, userFound.password);

            if (isMatch) {
                return res.json({
                    success: true,
                    message: `Welcome back ${userFound.name}.`,
                    redirectURL: "/dashboard"
                });
            }
        }

        // Si no es Batman y no hay match de user, regresamos
        return res.status(401).json({
            success: false,
            message: "Credentials do not match"
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Error accessing Bat-files."
        });
    };
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

export const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html")); //Muestra login.html
}

/*Agregare un almacenamiento en la memoria*/
const usersByEmail = new Map();
/**/

export const showForm = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formVIJS.html"));
};

export const showUser = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formUser.html"));
};

export const showValidate = async (req, res) => {
    const { name, tel, email, password, question, passphrase, step } = req.body;

    if (step == 2) {
        try {
            // 1. Leemos usuarios actuales
            let users = [];
            try {
                const fileData = await fs.readFile(USER_FILE, "utf-8");
                users = JSON.parse(fileData);
            } catch (error) {
                // Si el archivo no existe, iniciamos uno desde 0
                users = [];
            }

            // 2. Verficamos que no haya duplicados
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Identity already on file. Use another email."
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const hashedPassphrase = await bcrypt.hash(passphrase, salt); //cifra respuesta

            // 3. Añadimos user
            users.push({
                name, tel, email,
                password: hashedPassword,
                question,
                passphrase: hashedPassphrase
            });

            // 3. Guardamos en archivo
            await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));

            console.log('New BatMember scouted: ', name);
            return res.json({
                success: true,
                message: "Registration complete. Member added to the database."
            });
        } catch (error) {
            console.error("Save error:", error);
            return res.status(500).json({
                success: false,
                message: "Error saving new member."
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


/* Recuperacao Primero obtenemos la pregunta */
export const getSecurityQuestion = async (req, res) => {
    const { email } = req.body;

    try {
        const fileData = await fs.readFile(USER_FILE, "utf-8");
        const users = JSON.parse(fileData);
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Identity not found in Batcomputer records."
            });
        }

        // Devolvemos la pregunta, no la respuesta
        res.json({
            success: true,
            question: user.question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error accessing database."
        });
    }
};

export const showForgotPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/forgotPassword.html"));
};


// RECUPERACAO - Validamos y autenticamos
export const resetPassword = async (req, res) => {
    const { email, passphrase, newPassword } = req.body;

    try {
        const fileData = await fs.readFile(USER_FILE, "utf-8");
        let users = JSON.parse(fileData);

        //busco al usuario por email y passphrase
        const userIndex = users.findIndex(u => u.email === email);


        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isPassphraseValid = await bcrypt.compare(passphrase, users[userIndex].passphrase);

        if (!isPassphraseValid) {
            return res.status(401).json({
                success: false,
                message: "Security answer incorrect."
            });
        }

        const salt = await bcrypt.genSalt(10);

        //Actualizamos PW en array
        users[userIndex].password = await bcrypt.hash(newPassword, salt);

        //save
        await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));

        res.json({
            success: true,
            message: "Security Protocols updated. Use new password."
        });
    } catch (error) {
        console.error("Reset Error: ", error);
        res.status(500).json({
            success: false,
            message: "Error updating protocols."
        });
    }
};