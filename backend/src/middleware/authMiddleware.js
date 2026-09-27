const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Buscar el token en los headers de la petición
    const authHeader = req.headers.authorization;
    
    // Si no trae gafete o no tiene el formato correcto ("Bearer <token>")
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Acceso denegado. No hay token de autenticación." });
    }

    // 2. Extraer solo la cadena del token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Revisar la firma y expiración del gafete usando la llave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Cargar el usuario autenticado en la petición (colgarle el gafete)
        req.user = decoded; 
        
        // 5. Dejarlo pasar al siguiente proceso
        next();
    } catch (error) {
        // Si el token es inventado o ya expiró
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};

module.exports = authMiddleware;