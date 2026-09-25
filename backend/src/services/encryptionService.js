const crypto = require('crypto');

// Usaremos el estándar de la industria (Advanced Encryption Standard de 256 bits)
const algorithm = 'aes-256-cbc';

// Sacamos tu Llave Maestra de la bóveda secreta (.env)
// ADVERTENCIA: Esta llave DEBE tener exactamente 32 caracteres.
const secretKey = process.env.ENCRYPTION_KEY; 

const encrypt = (text) => {
    // 1. Generamos la "sal aleatoria" (16 bytes para AES)
    const iv = crypto.randomBytes(16);
    
    // 2. Creamos la caja fuerte con el algoritmo, tu llave y la sal
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    
    // 3. Metemos el texto y cerramos la caja
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // 4. Devolvemos la sal y el texto cifrado unidos por un ':' 
    // Necesitamos guardar la sal junto al texto para saber cómo abrirlo después
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (hash) => {
    // 1. Separamos la sal (IV) del texto cifrado usando el ':'
    const textParts = hash.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    
    // 2. Creamos la herramienta para abrir usando la MISMA llave y la MISMA sal
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    
    // 3. Desciframos y devolvemos el texto original
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
};

module.exports = { encrypt, decrypt };