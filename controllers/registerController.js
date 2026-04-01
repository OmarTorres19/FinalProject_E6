//import bcrypt from "bcryptjs";
//bcrypt es una librería para hashear contraseñas, lo que es fundamental para la seguridad de los usuarios. Nunca debes guardar contraseñas en texto plano. En este ejemplo, se utiliza bcrypt para hashear tanto la contraseña como la respuesta a la pregunta de seguridad antes de guardarlas en el JSON (o base de datos).
const bcrypt = require("bcryptjs");

exports.userRegister = async (req, res) => {

    const { name, tel, email, password, question, passphrase } = req.body;

    //Validaciones básicas
    if(!name || !tel || !email || !password || !question || !passphrase) {
        return res.status(400).json({
            success: false,
            message: "All fields must be filled"
        });
    }

    //Simulación de guardado
try {
    // Hash de password y respuesta (nunca texto plano)
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const passphraseHash = await bcrypt.hash(passphrase, saltRounds);

    // Usuario listo para guardar en JSON (BD)
    const user = {
      nombre: name,
      tel,
      correo: email,
      contrasena: passwordHash,
      preguntarc: question,        // ej: "favColor"
      respuestarc: passphraseHash, // hash bcrypt
      fecha: new Date().toISOString()
    };

    // Aquí deberías guardarlo en tu JSON (model/service)
    console.log("Data received:", user);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: { nombre: user.nombre, correo: user.correo } // no regreses hashes si no quieres
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};