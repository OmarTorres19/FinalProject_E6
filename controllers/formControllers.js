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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    if(step == 2) {
        return res.json({
            success: true,
            message: "Registration complete",
            allData: { name, tel, email, password, passphrase }
        });
    }

    //Simula procesamiento en la BatFamily
    const batMember = {
        name,
        tel,
        email,
        batsuit: 'Robin level',
        mission: 'Gotham recon',
        status: 'Approved'
    };

    res.json({
        success: true,
        message: "Step 1 Ok"
    });

    console.log('New BatMember: ', batMember);
};